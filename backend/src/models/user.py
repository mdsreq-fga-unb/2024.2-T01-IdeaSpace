from sqlmodel import Field, Relationship, SQLModel
from typing import Optional


class UserBase(SQLModel):
    username: str = Field(max_length=32, unique=True)
    full_name: Optional[str] = Field(max_length=255, default=None)
    is_active: bool = True
    is_superuser: bool = False


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
