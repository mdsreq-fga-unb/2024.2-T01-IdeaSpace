from fastapi import APIRouter, Depends, HTTPException
from src.models.country import CityBase
from src.api.deps import get_current_active_superuser, SessionDep
import src.crud as crud
from src.utils import get_slug
from src.api.response_models import CityResponse

router = APIRouter(prefix="/cities", tags=["city"])


@router.post(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=CityResponse,
)
def create_city(*, session: SessionDep, city_in: CityBase):
    city_in.name = city_in.name.strip().capitalize()
    slug_name = get_slug(city_in.name)
    existing_city = crud.get_city_by_slug_and_country(
        session=session, slug_name=slug_name, country_id=city_in.country_id
    )

    if existing_city:
        raise HTTPException(status_code=400, detail="City already exists")

    existing_country = crud.get_country_by_id(
        session=session, country_id=city_in.country_id
    )

    if existing_country is None:
        raise HTTPException(status_code=404, detail="Country not found")

    city = crud.create_city(session=session, city_in=city_in)
    return city


@router.get("/{city_id}", response_model=CityResponse)
def read_city(city_id: int, session: SessionDep):
    city = crud.get_city_by_id(session=session, city_id=city_id)
    if city is None:
        raise HTTPException(status_code=404, detail="City not found")
    return city


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=list[CityResponse],
)
def read_cities(*, session: SessionDep, skip: int = 0, limit: int = 100):
    cities = crud.get_cities(session=session, skip=skip, limit=limit)
    return cities


@router.delete(
    "/{city_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=CityResponse,
)
def delete_city(city_id: int, session: SessionDep):
    city = crud.get_city_by_id(session=session, city_id=city_id)
    if city is None:
        raise HTTPException(status_code=404, detail="City not found")
    city = crud.delete_city(session=session, city=city)
    return city
