from sqlmodel import Session, select

from src.core.security import get_password_hash, verify_password

from src.models.user import User, UserCreate


def create_user(session: Session, user_create: UserCreate) -> User:
    user = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
