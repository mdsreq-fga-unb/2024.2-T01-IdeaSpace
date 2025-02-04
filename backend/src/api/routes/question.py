from fastapi import APIRouter, Depends, HTTPException
from src.api.deps import get_current_active_superuser, SessionDep, CurrentUser
from src.models.question import Question, Option, QuestionBase, OptionBase, Category
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
    dependencies=[Depends(get_current_active_superuser)],
)
def read_questions(*, session: SessionDep, skip: int = 0, limit: int = 100):
    questions = crud.get_questions(session=session, skip=skip, limit=limit)
    return questions