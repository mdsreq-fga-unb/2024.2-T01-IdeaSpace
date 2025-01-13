from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import func, select
from typing import Any

import src.crud as crud
from src.models.user import UserPublic, UsersPublic, UserCreate, UserUpdate, User
from src.api.deps import get_current_active_superuser, SessionDep, CurrentUser


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


@router.get("/me", response_model=UserPublic)
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
def update_user(*, session: SessionDep, user_id: int, user_in: UserUpdate) -> Any:
    db_user = session.get(User, user_id)

    if not db_user:
        raise HTTPException(
            status_code=400, detail="User with this id does not exist in the system"
        )

    if user_in.username:
        existing_user = crud.get_user_by_username(
            session=session, username=user_in.username
        )

        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=400, detail="A user already exists with this username"
            )

    db_user = crud.update_user(session=session, db_user=db_user, user_in=user_in)
    return db_user
