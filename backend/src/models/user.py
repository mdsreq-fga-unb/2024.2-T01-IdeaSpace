from sqlmodel import Field, SQLModel
from typing import Optional
from pydantic import field_validator
from enum import Enum


class Role(str, Enum):
    TEACHER = "teacher" 
    STUDENT = "student"
    ADMIN = "admin"


class UserBase(SQLModel):
    username: str = Field(min_length=3, max_length=32, unique=True)
    full_name: Optional[str] = Field(max_length=255, default=None)
    is_active: bool = True
    role: Role = Field(default=Role.STUDENT)

    @field_validator("username", mode="before")
    @classmethod
    def validate_username(cls, value: str) -> str:
        value = value.strip().lower()

        if not value.isascii():
            raise ValueError("Username must have only normal characters.")

        has_spaces = any(c.isspace() for c in value)

        if has_spaces:
            raise ValueError("Username must not have spaces.")

        return value


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class UserCreate(UserBase):
    password: str


class UserPublic(UserBase):
    id: int

class UserUpdate(UserBase):
    password: Optional[str] = None
    username: Optional[str] = Field(max_length=255, default=None)

# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None

class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int
