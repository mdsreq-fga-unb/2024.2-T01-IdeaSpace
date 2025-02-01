from pydantic import BaseModel
from src.models.country import Country
from src.models.user import User, UserPublic

class CityResponse(BaseModel):
    id: int
    name: str
    country_id: int
    slug_name: str
    country: Country

class SchoolResponse(BaseModel):
    id: int
    name: str
    city_id: int
    slug_name: str
    city: CityResponse

class ClassroomResponse(BaseModel):
    id: int
    name: str
    school_id: int
    slug_name: str
    school: SchoolResponse


class TeacherResponse(BaseModel):
    user_id: int
    user: UserPublic
    classrooms: list[ClassroomResponse]


class StudentResponse(BaseModel):
    user_id: int
    classroom_id: int
    user: UserPublic
    classroom: ClassroomResponse
    
class TeacherResponseNoUser(BaseModel):
    classrooms: list[ClassroomResponse]

class StudentResponseNoUser(BaseModel):
    classroom: ClassroomResponse

class UserResponse(BaseModel):
    id: int
    username: str
    full_name: str | None
    is_active: bool
    is_superuser: bool
    teacher: TeacherResponseNoUser | None
    student: StudentResponseNoUser | None