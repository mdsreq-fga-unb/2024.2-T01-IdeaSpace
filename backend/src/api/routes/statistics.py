from fastapi import APIRouter, Depends, HTTPException
from src.api.deps import get_current_active_superuser, SessionDep
from src.models.user import Student, Classroom
from src.models.country import School
from src.models.question import Question
from sqlmodel import func, select


router = APIRouter(prefix="/statistics", tags=["statistics"])


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
)
def get_statistics(*, session: SessionDep):
    students_count = session.exec(select(func.count(Student.user_id))).first()
    classrooms_count = session.exec(select(func.count(Classroom.id))).first()
    schools_count = session.exec(select(func.count(School.id))).first()
    questions_count = session.exec(select(func.count(Question.id))).first()
    
    return {
        "students_count": students_count,
        "classrooms_count": classrooms_count,
        "schools_count": schools_count,
        "questions_count": questions_count,
    }