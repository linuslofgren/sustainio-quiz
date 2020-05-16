import React, { useState, useEffect } from 'react';
import { useQuery } from 'urql'
import Question from '../components/question/Question'
import '../App.css';
import QuizRunner from './QuizRunner/QuizRunner'

const Quiz = ({code, setInvalid}) => {
  const [res, executeQuery] = useQuery({
    query: `
      query ($code: String!) {
        questionnaireByCode(code: $code) {
          _id
          code
          expiryDate
          name
          finishFeedback
          fullQuestions {
            _id
            text
            answers {
              _id
              text
              correct
            }
          }
        }
      }
    `,
    variables: { code: code }
  })

  useEffect(()=>{
    if(!(res.data && res.data.questionnaireByCode && res.data.questionnaireByCode.fullQuestions) && !res.fetching) {
      setInvalid(true)
    }
  },  [res.fetching])

  if(res.data && res.data.questionnaireByCode && res.data.questionnaireByCode.fullQuestions) {
    return (
      <QuizRunner questionnaire={res.data.questionnaireByCode}/>
    )
  } else {
    return null
  }

}

export default Quiz;
