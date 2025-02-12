from sqlmodel import Session, select

from src.core.security import get_password_hash, verify_password
from src.utils import get_slug
from src.models.user import User, UserCreate, UserUpdate, Teacher, Classroom, Student
from src.models.country import CountryBase, Country, CityBase, City, SchoolBase, School, ClassroomBase
from src.models.question import (
    Category,
    Question,
    QuestionBase,
    OptionBase,
    Option,
    CategoryBase,
    Questionnaire,
    QuestionnaireUpdate,
    StudentStartsQuestionnaire,
    StudentAnswerOption,
)


def create_user(*, session: Session, user_create: UserCreate) -> User:
    user = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def update_user(*, session: Session, db_user: User, user_in: UserUpdate):
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}

    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password

    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_username(*, session: Session, username: str) -> User | None:
    statement = select(User).where(User.username == username)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, username: str, password: str) -> User | None:
    db_user = get_user_by_username(session=session, username=username)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_country(*, session: Session, country_in: CountryBase) -> Country:
    country = Country.model_validate(
        country_in, update={"slug_name": get_slug(country_in.name)}
    )
    session.add(country)
    session.commit()
    session.refresh(country)
    return country


def get_country_by_id(*, session: Session, country_id: int) -> Country | None:
    country = session.get(Country, country_id)
    return country


def get_countries(*, session: Session, skip: int = 0, limit: int = 100) -> list[Country]:
    statement = select(Country).offset(skip).limit(limit)
    countries = session.exec(statement).all()
    return countries


def delete_country(*, session: Session, country: Country) -> Country:
    # Store country data before deletion
    country_copy = Country(
        id=country.id,
        name=country.name,
        slug_name=country.slug_name
    )
    
    session.delete(country)
    session.commit()
    
    return country_copy


def get_country_by_slug(*, session: Session, slug_name: str) -> Country | None:
    statement = select(Country).where(Country.slug_name == slug_name)
    country = session.exec(statement).first()
    return country


def create_city(*, session: Session, city_in: CityBase) -> City:
    city = City.model_validate(
        city_in, update={"slug_name": get_slug(city_in.name)}
    )
    session.add(city)
    session.commit()
    session.refresh(city)
    return city


def get_city_by_id(*, session: Session, city_id: int) -> City | None:
    city = session.get(City, city_id)
    return city


def get_cities(*, session: Session, skip: int = 0, limit: int = 100) -> list[City]:
    statement = select(City).offset(skip).limit(limit)
    cities = session.exec(statement).all()
    return cities


def delete_city(*, session: Session, city: City) -> City:
    # Store city data before deletion
    city_copy = City(
        id=city.id,
        name=city.name,
        country_id=city.country_id,
        slug_name=city.slug_name,
        country=city.country
    )
    
    session.delete(city)
    session.commit()
    
    return city_copy


def get_city_by_slug_and_country(*, session: Session, slug_name: str, country_id: int) -> City | None:
    statement = select(City).where(City.slug_name == slug_name, City.country_id == country_id)
    city = session.exec(statement).first()
    return city


def create_school(*, session: Session, school_in: SchoolBase) -> School:
    school = School.model_validate(
        school_in, update={"slug_name": get_slug(school_in.name)}
    )
    session.add(school)
    session.commit()
    session.refresh(school)
    return school


def get_school_by_id(*, session: Session, school_id: int) -> School | None:
    school = session.get(School, school_id)
    return school


def get_school_by_slug_and_city(*, session: Session, slug_name: str, city_id: int) -> School | None:
    statement = select(School).where(School.slug_name == slug_name, School.city_id == city_id)
    school = session.exec(statement).first()
    return school


def get_schools(*, session: Session, skip: int = 0, limit: int = 100) -> list[School]:
    statement = select(School).offset(skip).limit(limit)
    schools = session.exec(statement).all()
    return schools


def delete_school(*, session: Session, school: School) -> School:
    # Store school data before deletion
    school_copy = School(
        id=school.id,
        name=school.name,
        city_id=school.city_id,
        slug_name=school.slug_name,
        city=school.city
    )
    
    # Delete the school
    session.delete(school)
    session.commit()
    
    return school_copy


def create_classroom(*, session: Session, classroom_in: ClassroomBase) -> Classroom:
    classroom = Classroom.model_validate(
        classroom_in, update={"slug_name": get_slug(classroom_in.name)}
    )
    session.add(classroom)
    session.commit()
    session.refresh(classroom)
    return classroom


def get_classroom_by_id(*, session: Session, classroom_id: int) -> Classroom | None:
    classroom = session.get(Classroom, classroom_id)
    return classroom


def get_classrooms(*, session: Session, skip: int = 0, limit: int = 100) -> list[Classroom]:
    statement = select(Classroom).offset(skip).limit(limit)
    classrooms = session.exec(statement).all()
    return classrooms


def get_classroom_by_slug_and_school(*, session: Session, slug_name: str, school_id: int) -> Classroom | None:
    statement = select(Classroom).where(Classroom.slug_name == slug_name, Classroom.school_id == school_id)
    classroom = session.exec(statement).first()
    return classroom


def get_classrooms_by_school(*, session: Session, school_id: int) -> list[Classroom]:
    statement = select(Classroom).where(Classroom.school_id == school_id)
    classrooms = session.exec(statement).all()
    return classrooms


def get_teachers(*, session: Session, skip: int = 0, limit: int = 100) -> list[Teacher]:
    statement = select(Teacher).offset(skip).limit(limit)
    teachers = session.exec(statement).all()
    return teachers


def create_teacher(*, session: Session, user_id: int) -> Teacher:
    teacher = Teacher(user_id=user_id)
    session.add(teacher)
    session.commit()
    session.refresh(teacher)
    return teacher


def get_teacher_by_user_id(*, session: Session, user_id: int) -> Teacher | None:
    teacher = session.get(Teacher, user_id)
    return teacher


def create_student(*, session: Session, user_id: int, classroom_id: int) -> Student:
    student = Student(user_id=user_id, classroom_id=classroom_id)
    session.add(student)
    session.commit()
    session.refresh(student)
    return student


def get_student_by_user_id(*, session: Session, user_id: int) -> Student | None:
    student = session.get(Student, user_id)
    return student


def get_students(*, session: Session, skip: int = 0, limit: int = 100) -> list[Student]:
    statement = select(Student).offset(skip).limit(limit)
    students = session.exec(statement).all()
    return students 


def get_classrooms(*, session: Session, skip: int = 0, limit: int = 100) -> list[Classroom]:
    statement = select(Classroom).offset(skip).limit(limit)
    classrooms = session.exec(statement).all()
    return classrooms


def get_student_by_user_id(*, session: Session, user_id: int) -> Student | None:
    statement = select(Student).where(Student.user_id == user_id)
    student = session.exec(statement).first()
    return student


def get_teacher_by_user_id(*, session: Session, user_id: int) -> Teacher | None:
    statement = select(Teacher).where(Teacher.user_id == user_id)
    teacher = session.exec(statement).first()
    return teacher


def delete_classroom(*, session: Session, classroom: Classroom) -> None:
    session.delete(classroom)
    session.commit()
    return


def get_category_by_slug(*, session: Session, slug_name: str) -> Category | None:
    statement = select(Category).where(Category.slug_name == slug_name)
    category = session.exec(statement).first()
    return category


def get_categories(*, session: Session, skip: int = 0, limit: int = 100) -> list[Category]:
    statement = select(Category).offset(skip).limit(limit)
    categories = session.exec(statement).all()
    return categories 


def get_questions(*, session: Session, skip: int = 0, limit: int = 100) -> list[Question]:
    statement = select(Question).offset(skip).limit(limit)
    questions = session.exec(statement).all()
    return questions


def delete_user(*, session: Session, user_id: int) -> User:
    user = session.get(User, user_id)
    session.delete(user)
    session.commit()
    return user


def get_questions_by_ids(*, session: Session, question_ids: list[int]) -> list[Question]:
    statement = select(Question).where(Question.id.in_(question_ids))
    questions = session.exec(statement).all()
    return questions


def get_questionnaires_by_classroom(*, session: Session, classroom_id: int, only_released: bool = False) -> list[Questionnaire]:
    if only_released:
        statement = select(Questionnaire).where(Questionnaire.classroom_id == classroom_id, Questionnaire.released == True)
    else:
        statement = select(Questionnaire).where(Questionnaire.classroom_id == classroom_id)
        
    questionnaires = session.exec(statement).all()
    return questionnaires


def update_questionnaire(*, session: Session, db_questionnaire: Questionnaire, questionnaire_in: QuestionnaireUpdate):
    questionnaire_data = questionnaire_in.model_dump(exclude_unset=True)
    db_questionnaire.sqlmodel_update(questionnaire_data)
    session.add(db_questionnaire)
    session.commit()
    session.refresh(db_questionnaire)
    return db_questionnaire


def update_student(*, session: Session, student: Student, classroom_id: int | None) -> Student:
    student.classroom_id = classroom_id
    session.add(student)
    session.commit()
    session.refresh(student)
    return student


def create_start_questionnaire(*, session: Session, student_id: int, questionnaire_id: int) -> StudentStartsQuestionnaire:
    student_starts_questionnaire = StudentStartsQuestionnaire(
        student_id=student_id,
        questionnaire_id=questionnaire_id,
    )
    session.add(student_starts_questionnaire)
    session.commit()
    session.refresh(student_starts_questionnaire)
    return student_starts_questionnaire


def get_student_starts_questionnaire(*, session: Session, student_id: int, questionnaire_id: int) -> StudentStartsQuestionnaire | None:
    statement = select(StudentStartsQuestionnaire).where(
        StudentStartsQuestionnaire.student_id == student_id,
        StudentStartsQuestionnaire.questionnaire_id == questionnaire_id
    )
    student_starts_questionnaire = session.exec(statement).first()
    return student_starts_questionnaire


def get_student_answers(*, session: Session, student_id: int, questionnaire_id: int) -> list[StudentAnswerOption]:
    statement = select(StudentAnswerOption).where(
        StudentAnswerOption.student_id == student_id,
        StudentAnswerOption.questionnaire_id == questionnaire_id
    )
    student_answers = session.exec(statement).all()
    return student_answers


def add_student_answer(*, session: Session, student_id: int, option_id: int, question_id: int, questionnaire_id: int) -> StudentAnswerOption:
    student_answer = StudentAnswerOption(
        student_id=student_id,
        option_id=option_id,
        question_id=question_id,
        questionnaire_id=questionnaire_id
    )  
    session.add(student_answer)
    session.commit()
    session.refresh(student_answer)
    return student_answer


def get_questions_by_ids(*, session: Session, question_ids: list[int]) -> list[Question]:
    statement = select(Question).where(Question.id.in_(question_ids))
    questions = session.exec(statement).all()
    return questions


def get_all_users_answered_questionnaire(*, session: Session, questionnaire_id: int) -> list[StudentStartsQuestionnaire]:
    statement = select(StudentStartsQuestionnaire).where(
        StudentStartsQuestionnaire.questionnaire_id == questionnaire_id,
        StudentStartsQuestionnaire.already_answered == True
    )
    students = session.exec(statement).all()
    return students


def get_student_questionnaires(*, session: Session, student_id: int) -> list[StudentStartsQuestionnaire]:
    statement = select(StudentStartsQuestionnaire).where(
        StudentStartsQuestionnaire.student_id == student_id,
        StudentStartsQuestionnaire.already_answered == True
    )
    student_questionnaires = session.exec(statement).all()
    return student_questionnaires


def create_question(*, session: Session, question: QuestionBase) -> Question:
    question = Question.model_validate(question)
    session.add(question)
    session.commit()
    session.refresh(question)
    return question


def create_option(*, session: Session, option: OptionBase, question_id: int) -> Option:
    option = Option.model_validate(option, update={"question_id": question_id})
    session.add(option)
    session.commit()
    session.refresh(option)
    return option


def create_category(*, session: Session, category_in: CategoryBase) -> Category:
    category = Category.model_validate(category_in, update={"slug_name": get_slug(category_in.name)})
    session.add(category)
    session.commit()
    session.refresh(category)
    return category