from fastapi import APIRouter, HTTPException
from src.api.deps import SessionDep, CurrentUser
from pydantic import BaseModel
from src.api.response_models import QuestionnaireResponse, QuestionnaireAnswerResponse, StartQuestionnaire
from src.models.user import Classroom
from src.models.question import (
    Questionnaire,
    QuestionnaireUpdate,
    StudentStartsQuestionnaireBase,
)
from src.models.question import Option
import src.crud as crud
from datetime import datetime, timedelta
from src.utils import get_student_result


class QuestionnaireBase(BaseModel):
    classroom_id: int
    duration: int
    question_ids: list[int]


class AnswerOptionBase(BaseModel):
    question_id: int
    option_id: int


class AnswerQuestionnaireBase(BaseModel):
    questionnaire_id: int
    answers: list[AnswerOptionBase]
    

router = APIRouter(prefix="/questionnaire", tags=["questionnaire"])


@router.post(
    "",
    status_code=201,
    response_model=QuestionnaireResponse
)
def create_questionnaire(
    questionnaire: QuestionnaireBase, session: SessionDep, current_user: CurrentUser
):
    classroom = session.get(Classroom, questionnaire.classroom_id)

    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found.")
    
    existing_teacher = crud.get_teacher_by_user_id(session=session, user_id=current_user.id)
    has_permission = current_user.is_superuser or (existing_teacher and questionnaire.classroom_id in existing_teacher.classrooms)
    
    if not has_permission:
        raise HTTPException(status_code=403, detail="You don't have permission to create a questionnaire for this classroom.")

    questions = crud.get_questions_by_ids(session=session, question_ids=questionnaire.question_ids)

    if len(questions) != len(questionnaire.question_ids) or len(questions) == 0:
        raise HTTPException(status_code=400, detail="Some questions were not found or is zero.")

    questionnaire = Questionnaire(
        classroom_id=questionnaire.classroom_id,
        duration=questionnaire.duration,
        questions=questions
    )
    session.add(questionnaire)
    session.commit()
    session.refresh(questionnaire)
    return questionnaire


@router.get(
    "/{questionnaire_id}",
    response_model=QuestionnaireResponse,
)
def read_questionnaire(questionnaire_id: int, session: SessionDep, current_user: CurrentUser):
    questionnaire = session.get(Questionnaire, questionnaire_id)
    if questionnaire is None:
        raise HTTPException(status_code=404, detail="Questionnaire not found")

    existing_teacher = crud.get_teacher_by_user_id(session=session, user_id=current_user.id)
    existing_student = crud.get_student_by_user_id(session=session, user_id=current_user.id)
    
    student_has_permission = (
        existing_student and 
        questionnaire.classroom_id == existing_student.classroom_id and 
        questionnaire.released and 
        not questionnaire.closed
    )
    
    teacher_has_permission = (
        existing_teacher and 
        questionnaire.classroom_id in [classroom.id for classroom in existing_teacher.classrooms]
    )
    
    if not student_has_permission and not teacher_has_permission and not current_user.is_superuser:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to read this questionnaire."
        )
    
    return questionnaire


@router.get(
    "/{questionnaire_id}/answers",
    response_model=QuestionnaireAnswerResponse,
)
def read_questionnaire_answers(questionnaire_id: int, session: SessionDep, current_user: CurrentUser):
    questionnaire = session.get(Questionnaire, questionnaire_id)
    if questionnaire is None:
        raise HTTPException(status_code=404, detail="Questionnaire not found")
    
    # O aluno só vai poder ver as respostas quando ele estiver respondido o questionário
    # Portanto, iremos deixar essa verificação para depois
    existing_teacher = crud.get_teacher_by_user_id(session=session, user_id=current_user.id)
    teacher_has_permission = existing_teacher and questionnaire.classroom_id in existing_teacher.classrooms
    
    if not teacher_has_permission and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="You don't have permission to read this questionnaire.")
    
    return questionnaire


@router.get(
    "/classroom/{classroom_id}",
    response_model=list[QuestionnaireResponse],
)
def read_questionnaires_by_classroom(classroom_id: int, session: SessionDep, current_user: CurrentUser):
    existing_teacher = crud.get_teacher_by_user_id(session=session, user_id=current_user.id)
    teacher_permission = existing_teacher and classroom_id in [c.id for c in existing_teacher.classrooms]


    # Alunos também podem ver os questionários que já foram liberados
    # Mas eles devem ter respondido o questionário para conseguir visualizar
    # Portanto, essa verificação será feita depois
    # existing_student = crud.get_student_by_user_id(session=session, user_id=current_user.id)
    student_permission = False
    
    if not teacher_permission and not student_permission and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="You don't have permission to read questionnaires for this classroom.")
    
    only_released = not teacher_permission and not current_user.is_superuser
    questionnaires = crud.get_questionnaires_by_classroom(
        session=session, classroom_id=classroom_id, only_released=only_released
    )
    return questionnaires


@router.patch(
    "/{questionnaire_id}",
    response_model=QuestionnaireResponse,
)
def update_questionnaire(
    questionnaire_id: int, questionnaire_in: QuestionnaireUpdate, session: SessionDep, current_user: CurrentUser
):
    questionnaire = session.get(Questionnaire, questionnaire_id)
    if questionnaire is None:
        raise HTTPException(status_code=404, detail="Questionnaire not found")
    
    existing_teacher = crud.get_teacher_by_user_id(session=session, user_id=current_user.id)
    has_permission = current_user.is_superuser or (
        existing_teacher and 
        questionnaire.classroom_id in [classroom.id for classroom in existing_teacher.classrooms]
    )
    
    if not has_permission:
        raise HTTPException(status_code=403, detail="You don't have permission to update this questionnaire.")
    
    questionnaire = crud.update_questionnaire(session=session, db_questionnaire=questionnaire, questionnaire_in=questionnaire_in)
    return questionnaire


@router.post(
    "/{questionnaire_id}/start",
    response_model=StartQuestionnaire,
)
def start_questionnaire(
    start_info: StudentStartsQuestionnaireBase, session: SessionDep, current_user: CurrentUser 
):
    """
    Estudante inicia e retorna um questionário 
    """
    questionnaire = session.get(Questionnaire, start_info.questionnaire_id)
    if questionnaire is None:
        raise HTTPException(status_code=404, detail="Questionnaire not found")
    
    if not questionnaire.released or questionnaire.closed:
        raise HTTPException(status_code=400, detail="Questionnaire is not available to start.")

    existing_student = crud.get_student_by_user_id(session=session, user_id=current_user.id)
    has_permission = existing_student and questionnaire.classroom_id == existing_student.classroom_id

    if not has_permission:
        raise HTTPException(status_code=403, detail="You don't have permission to start this questionnaire.")
    
    existing_info = crud.get_student_starts_questionnaire(
        session=session, student_id=current_user.id, questionnaire_id=start_info.questionnaire_id
    )

    if existing_info is None:
        existing_info = crud.create_start_questionnaire(session=session, student_id=current_user.id, questionnaire_id=start_info.questionnaire_id)
    
    duration = timedelta(minutes=questionnaire.duration)
    if existing_info.started_at + duration < datetime.now() or existing_info.already_answered:
        raise HTTPException(status_code=400, detail="Questionnaire has already expired or you have already answered it.")

    return {
        "info": existing_info,
        "questionnaire": questionnaire
    }


@router.post(
    "/{questionnaire_id}/answer",
)
def answer_questionnaire(
    answer_info: AnswerQuestionnaireBase, session: SessionDep, current_user: CurrentUser
):
    """
    Estudante responde as questões do questionário
    """
    questionnaire = session.get(Questionnaire, answer_info.questionnaire_id)
    if questionnaire is None:
        raise HTTPException(status_code=404, detail="Questionnaire not found")
    
    existing_student = crud.get_student_by_user_id(session=session, user_id=current_user.id)
    has_permission = existing_student and questionnaire.classroom_id == existing_student.classroom_id

    if not has_permission:
        raise HTTPException(status_code=403, detail="You don't have permission to answer this questionnaire.")
    
    existing_info = crud.get_student_starts_questionnaire(
        session=session, student_id=current_user.id, questionnaire_id=answer_info.questionnaire_id
    )

    if existing_info is None:
        raise HTTPException(status_code=400, detail="You have not started this questionnaire yet.")
    
    duration = timedelta(minutes=questionnaire.duration)
    if existing_info.started_at + duration < datetime.now() or existing_info.already_answered:
        raise HTTPException(status_code=400, detail="Questionnaire has already expired or you have already answered it.")
    
    # Verificar se as respostas são válidas
    questions = crud.get_questions_by_ids(session=session, question_ids=[answer.question_id for answer in answer_info.answers])
    if len(questions) != len(answer_info.answers):
        raise HTTPException(status_code=400, detail="Some questions were not found or are duplicated.")
    
    for answer in answer_info.answers:
        option = session.get(Option, answer.option_id)
        if option is None or option.question_id != answer.question_id:
            raise HTTPException(status_code=400, detail="Some options were not found or does not belong to the question.")
    
    # Verificar se as respostas já foram respondidas
    existing_answers = crud.get_student_answers(
        session=session, student_id=current_user.id, questionnaire_id=answer_info.questionnaire_id
    )
    if existing_answers:
        raise HTTPException(status_code=400, detail="You have already answered this questionnaire.")
    
    # Salvar as respostas
    for answer in answer_info.answers:
        crud.add_student_answer(
            session=session,
            student_id=current_user.id,
            option_id=answer.option_id,
            question_id=answer.question_id,
            questionnaire_id=answer_info.questionnaire_id
        )
    
    existing_info.already_answered = True
    session.commit()
    return {"message": "Answers saved successfully."}


@router.get(
    "/{questionnaire_id}/results",
)
def read_questionnaire_answers_by_student(
    questionnaire_id: int, session: SessionDep, current_user: CurrentUser
):
    """
    Estudante vê suas respostas do questionário, após o questionário ter sido respondido
    O estudante também vê as respostas corretas
    """
    existing_student = crud.get_student_by_user_id(session=session, user_id=current_user.id)
    if not existing_student:
        raise HTTPException(status_code=403, detail="You don't have permission to see the results.")
    
    student_answered = crud.get_student_starts_questionnaire(
        session=session, student_id=current_user.id, questionnaire_id=questionnaire_id
    )

    if student_answered is None or not student_answered.already_answered:
        raise HTTPException(status_code=400, detail="You have not answered this questionnaire yet.")
    
    result = get_student_result(questionnaire_id=questionnaire_id, student_id=current_user.id, session=session)
    return result


@router.get(
    "/{questionnaire_id}/results/all",
)
def read_questionnaire_answers_all_students(
    questionnaire_id: int, session: SessionDep, current_user: CurrentUser
):
    """
    Professor ou superusuário vê as respostas de todos os estudantes
    """
    questionnaire = session.get(Questionnaire, questionnaire_id)
    if questionnaire is None:
        raise HTTPException(status_code=404, detail="Questionnaire not found")
    
    existing_teacher = crud.get_teacher_by_user_id(session=session, user_id=current_user.id)
    has_permission = current_user.is_superuser or (existing_teacher and questionnaire.classroom_id in existing_teacher.classrooms)
    
    if not has_permission:
        raise HTTPException(status_code=403, detail="You don't have permission to see the results.")
    
    student_answers = crud.get_all_users_answered_questionnaire(session=session, questionnaire_id=questionnaire_id)
    result = {}
    for student_answer in student_answers:
        result[student_answer.student_id] = get_student_result(questionnaire_id=questionnaire_id, student_id=student_answer.student_id, session=session)
    
    return result


@router.get(
    "/{questionnaire_id}/results/student/{student_id}",
)
def read_questionnaire_answers_by_student_id(
    questionnaire_id: int, student_id: int, session: SessionDep, current_user: CurrentUser
):
    """
    Professor ou superusuário vê as respostas de um estudante específico
    """
    questionnaire = session.get(Questionnaire, questionnaire_id)
    if questionnaire is None:
        raise HTTPException(status_code=404, detail="Questionnaire not found")
    
    existing_teacher = crud.get_teacher_by_user_id(session=session, user_id=current_user.id)
    has_permission = current_user.is_superuser or (existing_teacher and questionnaire.classroom_id in existing_teacher.classrooms)
    
    if not has_permission:
        raise HTTPException(status_code=403, detail="You don't have permission to see the results.")
    
    student_answer = crud.get_student_starts_questionnaire(
        session=session, student_id=student_id, questionnaire_id=questionnaire_id
    )
    if student_answer is None or not student_answer.already_answered:
        raise HTTPException(status_code=400, detail="Student has not answered this questionnaire yet.")
    
    result = get_student_result(questionnaire_id=questionnaire_id, student_id=student_id, session=session)
    return result