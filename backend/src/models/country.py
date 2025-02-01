from sqlmodel import Field, SQLModel, UniqueConstraint, Relationship

class CountryBase(SQLModel):
    name: str = Field(max_length=128, min_length=3)


class Country(CountryBase, table=True):
    id: int = Field(default=None, primary_key=True)
    slug_name: str | None = Field(max_length=256, min_length=3, unique=True)
    cities: list["City"] = Relationship(back_populates="country")

class CityBase(SQLModel):
    name: str = Field(max_length=128, min_length=3)
    country_id: int


class City(CityBase, table=True):
    id: int = Field(default=None, primary_key=True)
    slug_name: str | None = Field(default=None, max_length=256, min_length=3)
    country_id: int = Field(foreign_key="country.id")
    country: Country = Relationship(back_populates="cities")
    schools: list["School"] = Relationship(back_populates="city")

    __table_args__ = (
        UniqueConstraint("slug_name", "country_id", name="city_unique_slug_country_constraint"),
    )


class SchoolBase(SQLModel):
    name: str = Field(max_length=128, min_length=3)
    city_id: int = Field(foreign_key="city.id")


class School(SchoolBase, table=True):
    id: int = Field(default=None, primary_key=True)
    slug_name: str | None = Field(default=None, max_length=256, min_length=3)
    city: City = Relationship(back_populates="schools")
    classrooms: list["Classroom"] = Relationship(back_populates="school")

    __table_args__ = (
        UniqueConstraint("slug_name", "city_id", name="school_unique_slug_city_constraint"),
   )


class ClassroomBase(SQLModel):
    name: str = Field(max_length=128, min_length=3)
    school_id: int = Field(foreign_key="school.id")


