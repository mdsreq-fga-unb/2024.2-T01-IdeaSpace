from fastapi import APIRouter, Depends, HTTPException
from src.models.country import SchoolBase
from src.api.deps import get_current_active_superuser, SessionDep, CurrentUser
import src.crud as crud
from src.utils import get_slug
from src.api.response_models import SchoolResponse

router = APIRouter(prefix="/schools", tags=["schools"])


@router.post(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=SchoolResponse,
)
def create_school(*, session: SessionDep, school_in: SchoolBase):
    school_in.name = school_in.name.strip().capitalize()
    slug_name = get_slug(school_in.name)
    existing_school = crud.get_school_by_slug_and_city(
        session=session, slug_name=slug_name, city_id=school_in.city_id
    )

    if existing_school:
        raise HTTPException(status_code=400, detail="School already exists")

    existing_city = crud.get_city_by_id(session=session, city_id=school_in.city_id)

    if existing_city is None:
        raise HTTPException(status_code=404, detail="City not found")

    school = crud.create_school(session=session, school_in=school_in)
    return school


@router.get(
    "/{school_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=SchoolResponse,
)
def read_school(school_id: int, session: SessionDep):
    school = crud.get_school_by_id(session=session, school_id=school_id)
    if school is None:
        raise HTTPException(status_code=404, detail="School not found")
    return school


@router.get("/", response_model=list[SchoolResponse])
def read_schools(*, session: SessionDep, skip: int = 0, limit: int = 100):
    schools = crud.get_schools(session=session, skip=skip, limit=limit)
    return schools


@router.delete(
    "/{school_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=SchoolResponse,
)
def delete_school(school_id: int, session: SessionDep):
    school = crud.get_school_by_id(session=session, school_id=school_id)
    if school is None:
        raise HTTPException(status_code=404, detail="School not found")
    crud.delete_school(session=session, school_id=school_id)
    return school
