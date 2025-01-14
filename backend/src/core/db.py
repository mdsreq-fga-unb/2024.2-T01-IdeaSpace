from sqlmodel import Session, create_engine, select

from src import crud
from src.core.config import settings

from src.models.user import User, UserCreate, Permission
from src.constants import PERMISSIONS

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def init_db() -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    from sqlmodel import SQLModel

    # This works because the models are already imported and registered from app.models
    SQLModel.metadata.create_all(engine)


def create_first_superuser(session: Session) -> None:
    user = session.exec(
        select(User).where(User.username == settings.FIRST_SUPERUSER)
    ).first()

    if not user:
        user_in = UserCreate(
            username=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        user = crud.create_user(session=session, user_create=user_in)


def update_permissions(session: Session) -> None:
    permissions_db = session.exec(select(Permission)).all()
    permissions_names = [permission["name"] for permission in PERMISSIONS]

    for permission in permissions_db:
        if permission.name not in permissions_names:
            session.delete(permission)

    for permission in PERMISSIONS:
        perm = session.exec(
            select(Permission).where(Permission.name == permission["name"])
        ).first()
        if not perm:
            perm = Permission(
                name=permission["name"], description=permission["description"]
            )
            session.add(perm)
    session.commit()

