'use client';

import React from 'react'

const quizQuestion = ({question, questionNumber, onAnswer}) => {
  return (
    <div>
        <h2 className='mb-4 text-xl font-bold text-gray-700 sm:text-2xl'>Question {questionNumber}</h2>

        <p className='mb-6 text-xl font-semibold text-gray-600 sm:text-2xl'>{question.text}</p>

        <div className='flex flex-col space-y-4'>
            {question.options.map((option) => (
                <button key={option.text}
                onClick={() => onAnswer(option.isCorrect)}
                className='rounded-xl bg-pink-600 py-2 text-lg text-white hover:opacity-80 sm:text.xl'
                >
                    {option.text}
                </button>
            ))}
        </div>
    </div>
  )
}

export default quizQuestion