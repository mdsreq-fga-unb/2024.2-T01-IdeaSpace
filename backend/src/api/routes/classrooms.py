from fastapi import APIRouter, Depends, HTTPException
from src.api.deps import get_current_active_superuser, SessionDep, CurrentUser
import src.crud as crud
from src.utils import get_slug
from src.api.response_models import ClassroomResponse, ClassWithUsersResponse
from src.models.country import ClassroomBase

router = APIRouter(prefix="/classrooms", tags=["classroom"])


@router.post(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=ClassroomResponse,
)
def create_classroom(*, session: SessionDep, classroom_in: ClassroomBase):
    """
    Create a new classroom 
    """
    classroom_in.name = classroom_in.name.strip().capitalize()
    slug_name = get_slug(classroom_in.name)
    existing_classroom = crud.get_classroom_by_slug_and_school(
        session=session, slug_name=slug_name, school_id=classroom_in.school_id
    )

    if existing_classroom:
        raise HTTPException(status_code=400, detail="Classroom already exists")

    existing_school = crud.get_school_by_id(session=session, school_id=classroom_in.school_id)

    if existing_school is None:
        raise HTTPException(status_code=404, detail="School not found")

    classroom = crud.create_classroom(session=session, classroom_in=classroom_in)
    return classroom


@router.get(
    "/{classroom_id}",
    response_model=ClassroomResponse,
)
def read_classroom(classroom_id: int, session: SessionDep, current_user: CurrentUser):
    """
    Get classroom by id 
    """
    classroom = crud.get_classroom_by_id(session=session, classroom_id=classroom_id)

    # O usuário deve ter acesso à sala de aula
    # ou deve ser um superusuário
    has_access = current_user.is_superuser

    if current_user.teacher:
        classrooms = current_user.teacher.classrooms
        classroom_ids = [c.id for c in classrooms] 
        has_access |= classroom_id in classroom_ids
    
    if current_user.student:
        has_access |= classroom_id == current_user.student.classroom_id
    
    if not has_access or classroom is None:
        raise HTTPException(status_code=403, detail="Classroom not found or you don't have access to it")
    
    return classroom


@router.get(
    "/",
    response_model=list[ClassroomResponse],
)
def read_classrooms(*, session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100):
    """
    Get all classrooms 
    """
    classrooms = crud.get_classrooms(session=session, skip=skip, limit=limit)

    if current_user.is_superuser:
        return classrooms

    if current_user.teacher:
        classrooms = current_user.teacher.classrooms
        return classrooms

    if current_user.student:
        classroom = current_user.student.classroom
        return [classroom]

    return classrooms


@router.post(
    "/{classroom_id}/add_student",
    response_model=ClassroomResponse,    
    dependencies=[Depends(get_current_active_superuser)]
)
def add_student_to_classroom(classroom_id: int, user_id: int, session: SessionDep):
    """
    Add a student to a classroom
    """
    classroom = crud.get_classroom_by_id(session=session, classroom_id=classroom_id)
    if classroom is None:
        raise HTTPException(status_code=404, detail="Classroom not found")

    student = crud.get_student_by_user_id(session=session, user_id=user_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")

    student.classroom_id = classroom_id
    session.commit()
    return classroom


@router.post(
    "/{classroom_id}/add_teacher",
    response_model=ClassroomResponse,
    dependencies=[Depends(get_current_active_superuser)]
)
def add_teacher_to_classroom(classroom_id: int, user_id: int, session: SessionDep):
    """
    Add a teacher to a classroom
    """
    classroom = crud.get_classroom_by_id(session=session, classroom_id=classroom_id)
    if classroom is None:
        raise HTTPException(status_code=404, detail="Classroom not found")

    teacher = crud.get_teacher_by_user_id(session=session, user_id=user_id)
    if teacher is None:
        raise HTTPException(status_code=404, detail="Teacher not found")

    teacher.classrooms.append(classroom)
    session.commit()
    return classroom


@router.delete(
    "/{classroom_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=ClassroomResponse,
)
def delete_classroom(classroom_id: int, session: SessionDep):
    """
    Delete a classroom 
    """
    classroom = crud.get_classroom_by_id(session=session, classroom_id=classroom_id)
    if classroom is None:
        raise HTTPException(status_code=404, detail="Classroom not found")
    classroom = crud.delete_classroom(session=session, classroom=classroom)
    return classroom


@router.post(
    "/{classroom_id}/remove_student",
    response_model=ClassroomResponse,
    dependencies=[Depends(get_current_active_superuser)]
)
def remove_student_from_classroom(classroom_id: int, user_id: int, session: SessionDep):
    """
    Remove a student from a classroom
    """
    classroom = crud.get_classroom_by_id(session=session, classroom_id=classroom_id)
    if classroom is None:
        raise HTTPException(status_code=404, detail="Classroom not found")

    student = crud.get_student_by_user_id(session=session, user_id=user_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if student.classroom_id != classroom_id:
        raise HTTPException(status_code=404, detail="Student is not in this classroom")

    student.classroom_id = None
    session.commit()
    return classroom


@router.post(
    "/{classroom_id}/remove_teacher",
    response_model=ClassroomResponse,
    dependencies=[Depends(get_current_active_superuser)],
)
def remove_teacher_from_classroom(classroom_id: int, user_id: int, session: SessionDep):
    """
    Remove a teacher from a classroom
    """
    classroom = crud.get_classroom_by_id(session=session, classroom_id=classroom_id)
    if classroom is None:
        raise HTTPException(status_code=404, detail="Classroom not found")

    teacher = crud.get_teacher_by_user_id(session=session, user_id=user_id)
    if teacher is None:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    if classroom not in teacher.classrooms:
        raise HTTPException(status_code=404, detail="Teacher is not in this classroom")

    teacher.classrooms.remove(classroom)
    session.commit()
    return classroom


@router.get(
    "/{classroom_id}/users",
    response_model=ClassWithUsersResponse,
)
def read_classroom_with_users(classroom_id: int, session: SessionDep, current_user: CurrentUser):
    """
    Get classroom with users 
    """
    classroom = crud.get_classroom_by_id(session=session, classroom_id=classroom_id)
    if classroom is None:
        raise HTTPException(status_code=404, detail="Classroom not found")
    
    if not current_user.is_superuser:
        has_access = False
        if current_user.teacher:
            classrooms = current_user.teacher.classrooms
            classroom_ids = [c.id for c in classrooms] 
            has_access |= classroom_id in classroom_ids
        
        if not has_access:
            raise HTTPException(status_code=403, detail="You don't have access to this classroom")
    
    return classroom