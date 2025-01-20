'use client';

import QuizQuestion from './quizQuestion'
import Result from './result'
import questions from './questions'
import React, { useState } from 'react'

const page = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (isCorrect) => {
    const newAnswers = [...answers, isCorrect ? 1: 0]

    setAnswers(newAnswers);

    if(currentQuestion >= questions.length - 1){
        setShowResult(true);
    }else{
        setCurrentQuestion(currentQuestion + 1);
    }
  }

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  }


  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-r from-slate-800 to-gray-950'>
        <div className='m-5 w-full max-w-xl rounded-3xl bg-white p-5 shadow-lg md:m-10 nd:p-10'>
            <QuizQuestion 
            question = {questions[currentQuestion]}
            questionNumber = {currentQuestion + 1}
            onAnswer = {handleAnswer}
            />
            {showResult && <Result answers = {answers} restartTest = {restartTest}/>}
        </div>
    </div>
  )
}

export default page