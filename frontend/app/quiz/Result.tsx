'use client';

import React from 'react'
import questions from './questions';

const result = ({answers, restartTest}) => {

  const score = answers.reduce((total, score) => total + score, 0)

  const mistakes = questions.filter((_, index) => answers[index] === 0).map((question) => ({
    question: question.text,
    correctAnswer: question.options.find((opt) => opt.isCorrect).text
  }))

  return (
    <div className='flex flex-col gap-6 text-center'>

      <h2 className='text-3xl font-bold text-gray-800'>Questionário concluído</h2>

      <p className='text-2xl font-semibold text-gray-700'>Pontuação: {score} de {questions.length}</p>


      {mistakes.length > 0 && (
        <div className='mt-4 text-left'>
          <h3 className='mb-3 text-xl font-semibold text-red-600'>Perguntas que você perdeu:</h3>


          <ul className='space-y-3'>
            {mistakes.map((mistake, index) => (
              <li key = {index} className='rounded-lg bg-red-50 p-4'>
                <p className='font-medium text-gray-800'>{mistake.question}</p>
                <p className='mt-1 text-green-600'>
                  Resposta correta: {mistake.correctAnswer}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
      onClick={restartTest}
      className='mt-4 rounded-full bg-pink-600 px-4 py-2 text-xl text-white transition-colors hover:opacity-80'
      >Tente novamente</button>
    </div>
  )
}

export default result