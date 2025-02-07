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
import src.crud as crud
from datetime import datetime, timedelta


class QuestionnaireBase(BaseModel):
    classroom_id: int
    duration: int
    question_ids: list[int]
    

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
    student_has_permission = existing_student and questionnaire.classroom_id == existing_student.classroom_id and questionnaire.released and not questionnaire.closed
    teacher_has_permission = existing_teacher and questionnaire.classroom_id in existing_teacher.classrooms
    
    if not student_has_permission and not teacher_has_permission and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="You don't have permission to read this questionnaire.")
    
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
    "/{classroom_id}",
    response_model=list[QuestionnaireResponse],
)
def read_questionnaires_by_classroom(classroom_id: int, session: SessionDep, current_user: CurrentUser):
    existing_teacher = crud.get_teacher_by_user_id(session=session, user_id=current_user.id)
    teacher_permission = existing_teacher and classroom_id in existing_teacher.classrooms

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
    has_permission = current_user.is_superuser or (existing_teacher and questionnaire.classroom_id in existing_teacher.classrooms)
    
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
        session=session, student_id=start_info.student_id, questionnaire_id=start_info.questionnaire_id
    )

    if existing_info is None:
        existing_info = crud.create_start_questionnaire(session=session, student_starts_questionnaire=start_info)
    
    duration = timedelta(minutes=questionnaire.duration)
    if existing_info.started_at + duration < datetime.now():
        raise HTTPException(status_code=400, detail="Questionnaire has already expired")

    return {
        "info": existing_info,
        "questionnaire": questionnaire
    }