from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import func, select
from typing import Any

import src.crud as crud
from src.models.user import UserPublic, UsersPublic, UserCreate, UserUpdate, User, Classroom
from src.api.deps import get_current_active_superuser, SessionDep, CurrentUser
from src.api.response_models import TeacherResponse, UserResponse, StudentResponse
from src.utils import get_student_result


router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UsersPublic,
)
def read_users(*, session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve users.
    """

    count_statement = select(func.count()).select_from(User)
    count = session.exec(count_statement).one()

    statement = select(User).offset(skip).limit(limit)
    users = session.exec(statement).all()

    return UsersPublic(data=users, count=count)


@router.get(
    "/teachers",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=list[TeacherResponse],
)
def read_teachers(*, session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve teachers.
    """

    teachers = crud.get_teachers(session=session, skip=skip, limit=limit)
    return teachers


@router.post(
    "/teachers",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=TeacherResponse,
)
def create_teacher(*, session: SessionDep, user_id: int) -> TeacherResponse:
    """
    Create a new teacher profile
    """
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=400, detail="User with this id does not exist in the system"
        )
    
    existing_teacher = crud.get_teacher_by_user_id(session=session, user_id=user_id)

    if existing_teacher:
        raise HTTPException(
            status_code=400, detail="Teacher already exists for this user"
        )
    
    teacher = crud.create_teacher(session=session, user_id=user_id)
    return teacher


@router.post(
    "/", dependencies=[Depends(get_current_active_superuser)], response_model=UserPublic
)
def create_user(session: SessionDep, user_in: UserCreate):
    """
    Create a new user
    """

    user = crud.get_user_by_username(session=session, username=user_in.username)

    if user:
        raise HTTPException(
            status_code=400, detail="User already exists with this username"
        )

    user = crud.create_user(session=session, user_create=user_in)
    return user


@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: CurrentUser):
    """
    Get current user
    """
    return current_user


@router.patch(
    "/{user_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UserPublic,
)
def update_user(*, session: SessionDep, user_id: int, user_in: UserUpdate, current_user: CurrentUser) -> Any:
    db_user = session.get(User, user_id)

    if not db_user:
        raise HTTPException(
            status_code=400, detail="User with this id does not exist in the system"
        )

    if user_in.username:
        existing_user = crud.get_user_by_username(
            session=session, username=user_in.username
        )

        if existing_user and existing_user.id != db_user.id:
            raise HTTPException(
                status_code=400, detail="A user already exists with this username"
            )

    if current_user.id == user_id and user_in.is_superuser != db_user.is_superuser:
        raise HTTPException(
            status_code=400, detail="You cannot change your own privileges."
        )

    db_user = crud.update_user(session=session, db_user=db_user, user_in=user_in)
    return db_user


@router.post(
    "/students",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=StudentResponse,
)
def create_student(*, session: SessionDep, user_id: int, classroom_id: int) -> StudentResponse:
    """
    Create a new student profile
    """
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=400, detail="User with this id does not exist in the system"
        )
    
    existing_student = crud.get_student_by_user_id(session=session, user_id=user_id)
    
    if existing_student:
        raise HTTPException(
            status_code=400, detail="Student already exists for this user"
        )
    
    classroom = session.get(Classroom, classroom_id)

    if not classroom:
        raise HTTPException(
            status_code=400, detail="Classroom with this id does not exist in the system"
        )

    student = crud.create_student(session=session, user_id=user_id, classroom_id=classroom_id)
    return student


@router.get(
    "/students",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=list[StudentResponse],
)
def read_students(*, session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve students.
    """

    students = crud.get_students(session=session, skip=skip, limit=limit)
    return students


@router.patch(
    "/{user_id}/student",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=StudentResponse,
)
def update_student(*, session: SessionDep, user_id: int, classroom_id: int | None = None) -> StudentResponse:
    """
    Update a student profile
    """
    student = crud.get_student_by_user_id(session=session, user_id=user_id)

    if not student:
        raise HTTPException(
            status_code=400, detail="Student with this id does not exist in the system"
        )

    classroom = None
    if classroom_id is not None:
        classroom = session.get(Classroom, classroom_id)

        if not classroom:
            raise HTTPException(
                status_code=400, detail="Classroom with this id does not exist in the system"
            )

    student = crud.update_student(session=session, student=student, classroom_id=classroom_id)
    return student



@router.delete(
    "/{user_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UserPublic,
)
def delete_user(*, session: SessionDep, user_id: int, current_user: CurrentUser) -> Any:
    """
    Delete a user
    """
    db_user = session.get(User, user_id)

    if not db_user:
        raise HTTPException(
            status_code=400, detail="User with this id does not exist in the system"
        )
    
    if current_user.id == user_id:
        raise HTTPException(
            status_code=400, detail="You cannot delete your own account."
        )

    db_user = crud.delete_user(session=session, user_id=user_id)
    return db_user


@router.get(
    "/{user_id}/student",
)
def read_student_results(*, session: SessionDep, user_id: int, current_user: CurrentUser) -> Any:
    """
    Retrieve student results
    """
    student = crud.get_student_by_user_id(session=session, user_id=user_id)

    if not student:
        raise HTTPException(
            status_code=400, detail="Student with this id does not exist in the system"
        )

    existing_teacher = crud.get_teacher_by_user_id(session=session, user_id=current_user.id)
    has_permission = (
        (existing_teacher and student.classroom_id in existing_teacher.classroom_ids)
        or student.user_id == current_user.id
        or current_user.is_superuser
    )

    if not has_permission:
        raise HTTPException(
            status_code=400, detail="You do not have permission to view this student's results"
        )

    questionnaires = crud.get_student_questionnaires(session=session, student_id=student.user_id)
    global_questions_amount = 0
    global_correct_answers = 0
    results = []

    for questionnaire in questionnaires:
        result = get_student_result(questionnaire_id=questionnaire.questionnaire_id, student_id=student.user_id, session=session)
        results.append(result)

        global_questions_amount += result["total_questions"]
        global_correct_answers += result["correct_answers"]
    
    return {
        "global_questions_amount": global_questions_amount,
        "global_correct_answers": global_correct_answers,
        "total_questionnaires": len(questionnaires),
        "results": results,
    }