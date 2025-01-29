from pydantic import BaseModel
from src.models.country import Country

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
