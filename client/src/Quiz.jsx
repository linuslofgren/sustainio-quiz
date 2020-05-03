import React from 'react';
import { useQuery } from 'urql'
import Question from './components/question/Question'
import './App.css';

const Quiz = ({code}) => {
  const [res, executeQuery] = useQuery({
    query: `
      query ($code: String!) {
        questionnaireByCode(code: $code) {
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
  let questions = []
  if(res.data && res.data.questionnaireByCode && res.data.questionnaireByCode.fullQuestions) {
    questions = res.data.questionnaireByCode.fullQuestions
  }
  return (
    <div className="App">
      <h1>{((res.data || {}).questionnaireByCode || {}).name}</h1>
      {questions.map(q => <Question key={q._id} text={q.text} answers={q.answers}></Question>)}
    </div>
  );
}

export default Quiz;
