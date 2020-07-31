import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'
import Question from '../components/question/Question'
import '../App.css';
import QuizRunner from './QuizRunner/QuizRunner'

const QuizById = () => {
  let [invalid, setInvalid] = useState(false)

  let { id } = useParams()
  const [res, executeQuery] = useQuery({
    query: `
      query ($uri: String!) {
        questionnaireByLinkUri(uri: $uri) {
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
    variables: { uri: id }
  })

  useEffect(()=>{
    if(!(res.data && res.data.questionnaireByLinkUri && res.data.questionnaireByLinkUri.fullQuestions) && !res.fetching) {
      setInvalid(true)
    }
  },  [res.fetching])

  if(invalid) {
    return <p>Invalid Link</p>
  }

  if(res.data && res.data.questionnaireByLinkUri && res.data.questionnaireByLinkUri.fullQuestions) {
    return (
      <QuizRunner questionnaire={res.data.questionnaireByLinkUri}/>
    )
  } else {
    return null
  }

}

export default QuizById;
