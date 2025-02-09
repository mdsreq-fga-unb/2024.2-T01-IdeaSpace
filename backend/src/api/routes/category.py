from fastapi import APIRouter, Depends, HTTPException
from src.api.deps import get_current_active_superuser, SessionDep, CurrentUser
from src.models.question import Category, CategoryBase
from src.utils import get_slug
import src.crud as crud


router = APIRouter(prefix="/category", tags=["category"])


@router.post(
    "",
    status_code=201,
    dependencies=[Depends(get_current_active_superuser)],
)
def create_category(
    category: CategoryBase, session: SessionDep
):
    category.name = category.name.strip().capitalize()
    slug_name = get_slug(category.name)
    existing_category = crud.get_category_by_slug(session=session, slug_name=slug_name)

    if existing_category:
        raise HTTPException(status_code=400, detail="Category already exists")

    category = Category.model_validate(category, update={"slug_name": slug_name})
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


@router.get(
    "/{category_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=Category,
)
def read_category(category_id: int, session: SessionDep):
    category = session.get(Category, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.get(
    "/",
    response_model=list[Category]
)
def read_categories(*, session: SessionDep, skip: int = 0, limit: int = 100):
    categories = crud.get_categories(session=session, skip=skip, limit=limit)
    return categories



@router.delete(
    "/{category_id}",
    dependencies=[Depends(get_current_active_superuser)],
    status_code=204,
)
def delete_category(category_id: int, session: SessionDep):
    category = session.get(Category, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    
    session.delete(category)
    session.commit()
    return