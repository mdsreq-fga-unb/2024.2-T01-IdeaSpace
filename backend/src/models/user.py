from sqlmodel import Field, Relationship, SQLModel
from typing import List, Optional


class UserPermission(SQLModel, table=True):
    user_id: int | None = Field(default=None, primary_key=True, foreign_key="user.id")
    permission_id: int | None = Field(
        default=None, primary_key=True, foreign_key="permission.id"
    )


class Permission(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    users: Optional[List["User"]] = Relationship(
        back_populates="permissions", link_model=UserPermission
    )


class UserBase(SQLModel):
    is_active: bool = True
    is_superuser: bool = False
    full_name: Optional[str] = Field(max_length=255, default=None)
    username: str = Field(max_length=32, unique=True)


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    permissions: Optional[List[Permission]] = Relationship(
        back_populates="users", link_model=UserPermission
    )


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    password: Optional[str] = None
