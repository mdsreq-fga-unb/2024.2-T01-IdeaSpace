from fastapi import APIRouter, Depends, HTTPException
from src.models.country import CountryBase, Country
from src.api.deps import get_current_active_superuser, SessionDep
import src.crud as crud
from src.utils import get_slug

router = APIRouter(prefix="/countries", tags=["country"])


@router.post(
    "/", dependencies=[Depends(get_current_active_superuser)], response_model=Country
)
def create_country(*, session: SessionDep, country_in: CountryBase):
    country_in.name = country_in.name.strip().capitalize()
    slug_name = get_slug(country_in.name)
    existing_country = crud.get_country_by_slug(session=session, slug_name=slug_name)

    if existing_country:
        raise HTTPException(status_code=400, detail="Country already exists")

    country = crud.create_country(session=session, country_in=country_in)
    return country


@router.get("/{country_id}", response_model=Country)
def read_country(country_id: int, session: SessionDep):
    country = crud.get_country_by_id(session=session, country_id=country_id)
    if country is None:
        raise HTTPException(status_code=404, detail="Country not found")
    return country


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=list[Country],
)
def read_countries(*, session: SessionDep, skip: int = 0, limit: int = 100):
    countries = crud.get_countries(session=session, skip=skip, limit=limit)
    return countries


@router.delete(
    "/{country_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=Country,
)
def delete_country(country_id: int, session: SessionDep):
    country = crud.get_country_by_id(session=session, country_id=country_id)
    if country is None:
        raise HTTPException(status_code=404, detail="Country not found")
    country = crud.delete_country(session=session, country=country)
    return country
