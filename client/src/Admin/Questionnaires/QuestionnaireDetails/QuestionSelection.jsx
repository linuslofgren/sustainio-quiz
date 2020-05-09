import React from 'react';
import { useQuery } from 'urql'

const QuestionSelection = ({addQuestion}) => {
  const [res, executeQuery] = useQuery({
    query: `
      query {
        questions {
          _id
          text
        }
      }
    `
  })
  let questions = []
  if(res.data) {
    questions = res.data.questions
  }
  return (
    <ul>
      {questions.map(q => <li key={q._id} onClick={()=>addQuestion(q._id)}>{q.text}</li>)}
    </ul>
  );
}

export default QuestionSelection;
