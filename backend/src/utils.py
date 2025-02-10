from unidecode import unidecode
from src.models.question import StudentAnswerOption, Questionnaire
from src.api.deps import SessionDep
from fastapi import HTTPException
from sqlmodel import select

def get_slug(name: str) -> str:
    name = unidecode(name)
    return name.lower().replace(" ", "_")

def get_student_result(questionnaire_id: int, student_id: int, session: SessionDep):
    student_answers_query = select(StudentAnswerOption).where(
        StudentAnswerOption.student_id == student_id, StudentAnswerOption.questionnaire_id == questionnaire_id
    )
    student_answers = session.exec(student_answers_query).all() 

    if not student_answers:
        raise HTTPException(status_code=404, detail="Student answers not found")

    questionnaire = session.get(Questionnaire, questionnaire_id)

    if not questionnaire:
        raise HTTPException(status_code=404, detail="Questionnaire not found")
    
    question_student_answers = {answer.question_id: answer.option_id for answer in student_answers}
    total_questions = len(questionnaire.questions)
    correct_answers = 0
    result = []

    for questionnaire_question in questionnaire.questions:
        student_answered = question_student_answers.get(questionnaire_question.id, None)
        correct_option = None
        
        for option in questionnaire_question.options:
            if option.is_answer:
                correct_option = option.id
                break
        
        correct_answers += student_answered == correct_option
        result.append(
            {
                "question_id": questionnaire_question.id,
                "question_text": questionnaire_question.text,
                "options": [option.model_dump() for option in questionnaire_question.options],
                "student_answer": student_answered,
                "correct_answer": correct_option,
                "is_correct": student_answered == correct_option,
            }
        )
    
    return {
        "total_questions": total_questions,
        "correct_answers": correct_answers,
        "result": result,
    }