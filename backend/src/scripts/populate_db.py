import sys
import os

# Dynamically add the base project directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from faker import Faker
from src.core.db import engine
from sqlmodel import Session
import src.crud as crud
from random import randint, choice

from src.models.user import UserCreate
from src.models.country import CountryBase, CityBase, SchoolBase, ClassroomBase
from src.models.question import QuestionBase, CategoryBase, OptionBase, DifficultyLevel

AMOUNT_ENTRIES = 10

fake = Faker('pt_BR')

"""
This script is used to populate the database with random data.
It should be used only for development purposes.
"""

def create_country():
    with Session(engine) as session:
        amount = AMOUNT_ENTRIES
        while amount > 0:
            try:
                country_in = CountryBase(name=fake.country())
                crud.create_country(session=session, country_in=country_in)
                amount -= 1
            except:
                pass


def create_city():
    with Session(engine) as session:
        countries = crud.get_countries(session=session)
        amount = AMOUNT_ENTRIES
        while amount > 0:
            try:
                country_index = randint(0, len(countries) - 1)
                city_in = CityBase(name=fake.city(), country_id=countries[country_index].id)
                crud.create_city(session=session, city_in=city_in)
                amount -= 1
            except:
                pass


def create_school():
    with Session(engine) as session:
        cities = crud.get_cities(session=session)
        amount = AMOUNT_ENTRIES
        while amount > 0:
            try:
                city_index = randint(0, len(cities) - 1)
                school_in = SchoolBase(name=fake.company(), city_id=cities[city_index].id)
                crud.create_school(session=session, school_in=school_in)
                amount -= 1
            except:
                pass


def create_classroom():
    with Session(engine) as session:
        schools = crud.get_schools(session=session)
        amount = AMOUNT_ENTRIES
        while amount > 0:
            try:
                school_index = randint(0, len(schools) - 1)
                classroom_in = ClassroomBase(name=fake.word(), school_id=schools[school_index].id)
                crud.create_classroom(session=session, classroom_in=classroom_in)
                amount -= 1
            except:
                pass


def create_student():
    with Session(engine) as session:
        classrooms = crud.get_classrooms(session=session)
        amount = AMOUNT_ENTRIES
        while amount > 0:
            try:
                classroom_index = randint(0, len(classrooms) - 1)
                user_in = UserCreate(
                    username=fake.user_name(),
                    password=fake.password(),
                    full_name=fake.name(),
                    is_superuser=False,
                )
                user = crud.create_user(session=session, user_create=user_in)
                crud.create_student(session=session, user_id=user.id, classroom_id=classrooms[classroom_index].id)
                amount -= 1
            except:
                pass
            

def create_teacher():
    with Session(engine) as session:
        amount = AMOUNT_ENTRIES
        while amount > 0:
            try:
                user_in = UserCreate(
                    username=fake.user_name(),
                    password=fake.password(),
                    full_name=fake.name(),
                    is_superuser=False,
                )
                user = crud.create_user(session=session, user_create=user_in)
                crud.create_teacher(session=session, user_id=user.id)
                amount -= 1
            except:
                pass


def add_teacher_to_classroom():
    with Session(engine) as session:
        classrooms = crud.get_classrooms(session=session)
        teachers = crud.get_teachers(session=session)
        for _ in range(AMOUNT_ENTRIES):
            classroom_index = randint(0, len(classrooms) - 1)
            teacher_index = randint(0, len(teachers) - 1)

            while teachers[teacher_index] in classrooms[classroom_index].teachers:
                classroom_index = randint(0, len(classrooms) - 1)
                teacher_index = randint(0, len(teachers) - 1)

            classrooms[classroom_index].teachers.append(teachers[teacher_index])
            session.commit()


def create_category():
    with Session(engine) as session:
        amount = AMOUNT_ENTRIES
        while amount > 0:
            try:
                category_in = CategoryBase(name=fake.word())
                crud.create_category(session=session, category_in=category_in)
                amount -= 1
            except:
                pass


def create_question():
    with Session(engine) as session:
        categories = crud.get_categories(session=session)
        amount = AMOUNT_ENTRIES
        while amount > 0:
            try:
                category_index = randint(0, len(categories) - 1)
                difficulty = choice([difficulty.value for difficulty in DifficultyLevel])
                question_in = QuestionBase(
                    text=fake.sentence(),
                    category_id=categories[category_index].id,
                    difficulty=difficulty
                )
                question = crud.create_question(session=session, question=question_in)

                for _ in range(3):
                    option_in = OptionBase(
                        text=fake.sentence(),
                        is_answer=False
                    )
                    crud.create_option(session=session, option=option_in, question_id=question.id)
                
                option_in = OptionBase(
                    text=fake.sentence(),
                    is_answer=True
                )
                crud.create_option(session=session, option=option_in, question_id=question.id)
                amount -= 1
            except:
                pass


def populate_db():
    create_country()
    create_city()
    create_school()
    create_classroom()
    create_student()
    create_teacher()
    add_teacher_to_classroom()
    create_category()
    create_question()


if __name__ == "__main__":
    populate_db()