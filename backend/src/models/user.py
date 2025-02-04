from sqlmodel import Field, SQLModel, Relationship, UniqueConstraint
from typing import Optional
from pydantic import field_validator
from src.models.country import ClassroomBase, School

class UserBase(SQLModel):
    username: str = Field(min_length=3, max_length=32, unique=True)
    full_name: Optional[str] = Field(max_length=255, default=None)
    is_active: bool = True
    is_superuser: bool = False
    
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
    teacher: "Teacher" = Relationship(back_populates="user", cascade_delete=True)
    student: "Student" = Relationship(back_populates="user", cascade_delete=True)


class ClassroomTeacher(SQLModel, table=True):
    classroom_id: int = Field(foreign_key="classroom.id", primary_key=True)
    teacher_id: int = Field(foreign_key="teacher.user_id", primary_key=True)
    
class Teacher(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True) 
    user: User = Relationship(back_populates="teacher") 
    classrooms: list["Classroom"] = Relationship(back_populates="teachers", link_model=ClassroomTeacher)


class Classroom(ClassroomBase, table=True):
    id: int = Field(default=None, primary_key=True)
    slug_name: str | None = Field(default=None, max_length=256, min_length=3)
    school: School = Relationship(back_populates="classrooms")
    teachers: list["Teacher"] = Relationship(back_populates="classrooms", link_model=ClassroomTeacher)
    students: list["Student"] = Relationship(back_populates="classroom")

    __table_args__ = (
        UniqueConstraint("slug_name", "school_id", name="classroom_unique_slug_school_constraint"),
   )


class Student(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True) 
    classroom_id: int | None = Field(default=None, foreign_key="classroom.id")
    user: User = Relationship(back_populates="student")
    classroom: Classroom = Relationship(back_populates="students")
    

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
