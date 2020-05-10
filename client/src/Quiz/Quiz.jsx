import React, { useState } from 'react';
import { useQuery } from 'urql'
import Question from '../components/question/Question'
import '../App.css';
import QuizRunner from './QuizRunner/QuizRunner'

const Quiz = ({code}) => {
  const [res, executeQuery] = useQuery({
    query: `
      query ($code: String!) {
        questionnaireByCode(code: $code) {
          _id
          code
          expiryDate
          name
          fullQuestions {
            _id
            text
            answers {
              _id
              text
            }
          }
        }
      }
    `,
    variables: { code: code }
  })
  if(res.data && res.data.questionnaireByCode && res.data.questionnaireByCode.fullQuestions) {
    return (
      <QuizRunner questionnaire={res.data.questionnaireByCode}/>
    )
  } else {
    return null
  }

}

export default Quiz;
