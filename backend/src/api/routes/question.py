from fastapi import APIRouter, Depends, HTTPException
from src.api.deps import get_current_active_superuser,get_current_active_superuser_or_teacher, SessionDep
from src.models.question import Question, Option, QuestionBase, OptionBase, Category, QuestionBaseOptional
from pydantic import BaseModel
from src.api.response_models import QuestionWithOptionsAnswer, QuestionResponse
import src.crud as crud

class QuestionWithOption(BaseModel):
    question: QuestionBase
    options: list[OptionBase]


router = APIRouter(prefix="/questions", tags=["question"])


@router.post(
    "",
    response_model=QuestionWithOptionsAnswer,
    status_code=201,
    dependencies=[Depends(get_current_active_superuser)],
)
def create_question(
    question_with_option: QuestionWithOption, session: SessionDep    
):
    answer_qtd = 0

    for option in question_with_option.options:
        answer_qtd += option.is_answer
    
    if answer_qtd != 1:
        raise HTTPException(status_code=400, detail="Question needs exactly one answer.")
    
    category = session.get(Category, question_with_option.question.category_id)

    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")
    
    question_dict = question_with_option.model_dump()
    question = Question(**question_dict["question"])
    session.add(question)
    session.flush()
    
    for option in question_dict["options"]:
        session.add(Option.model_validate(option, update={"question_id": question.id}))
    
    session.commit()
    session.refresh(question)
    return question


@router.get(
    "/{question_id}",
    response_model=QuestionWithOptionsAnswer,
    dependencies=[Depends(get_current_active_superuser)],
)
def read_question(question_id: int, session: SessionDep):
    question = session.get(Question, question_id)
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    
    return question


@router.get(
    "/",
    response_model=list[QuestionResponse],
    dependencies=[Depends(get_current_active_superuser_or_teacher)],
)
def read_questions(*, session: SessionDep, skip: int = 0, limit: int = 100):
    questions = crud.get_questions(session=session, skip=skip, limit=limit)
    return questions


@router.post(
    "/{question_id}/options",
    response_model=OptionBase,
    status_code=201,
    dependencies=[Depends(get_current_active_superuser)],
)
def create_option(question_id: int, option: OptionBase, session: SessionDep):
    question = session.get(Question, question_id)
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    new_option = Option(**option.model_dump(), question_id=question_id)
    
    session.add(new_option)
    session.commit()
    session.refresh(new_option)
    
    return new_option


@router.delete(
    "/{question_id}",
    dependencies=[Depends(get_current_active_superuser)],
)
def delete_question(question_id: int, session: SessionDep):
    question = session.get(Question, question_id)
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    session.delete(question)
    session.commit()
    return question


@router.patch(
    "/{question_id}",
    response_model=QuestionWithOptionsAnswer,
    dependencies=[Depends(get_current_active_superuser)],
)
def update_question(question_id: int, question: QuestionBaseOptional, session: SessionDep):
    question_db = session.get(Question, question_id)
    
    if not question_db:
        raise HTTPException(status_code=404, detail="Question not found")
    
    if question.category_id is not None:
        category = session.get(Category, question.category_id)
        
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        question_db.category_id = question.category_id
    
    if question.text:
        question_db.text = question.text 
    
    session.commit()
    session.refresh(question_db)
    return question_db


@router.patch(
    "/options/{option_id}",
    response_model=OptionBase,
    dependencies=[Depends(get_current_active_superuser)],
)
def update_option(
    option_id: int, option_text: str, session: SessionDep
):
    option_db = session.get(Option, option_id)
    
    if not option_db:
        raise HTTPException(status_code=404, detail="Option not found")

    option_db.text = option_text
    session.commit()
    session.refresh(option_db)
    return option_db


@router.delete(
    "/options/{option_id}",
    response_model=OptionBase,
    dependencies=[Depends(get_current_active_superuser)],
)
def delete_option(option_id: int, session: SessionDep):
    option = session.get(Option, option_id)
    
    if not option:
        raise HTTPException(status_code=404, detail="Opção não encontrada")
    
    session.delete(option)
    session.commit()
    return option
