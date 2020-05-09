import React, { useState } from 'react';
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
  let [qIdx, setQIdx] = useState(0)
  let questions = []
  if(res.data && res.data.questionnaireByCode && res.data.questionnaireByCode.fullQuestions) {
    questions = res.data.questionnaireByCode.fullQuestions
  }
  return (
    <div className="App">
      <h1>{((res.data || {}).questionnaireByCode || {}).name}</h1>
      {questions.map((q, i) => {
        if(i === qIdx) {
          return <Question key={q._id} index={i+1} total={questions.length} text={q.text} answers={q.answers} progress={()=>setQIdx(i => i+1)}></Question>
        } else {
          return null
        }
      })}
      {qIdx ? <span onClick={()=>{setQIdx(i => i - 1)}}>Back</span> : null}
    </div>
  );
}

export default Quiz;
