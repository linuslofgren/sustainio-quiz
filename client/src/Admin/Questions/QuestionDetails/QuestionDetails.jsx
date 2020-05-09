import React from 'react';
import { useQuery, useMutation } from 'urql'
import { useParams } from 'react-router-dom'
import Question from '../../../components/question/Question'

const QuestionDetails = ({}) => {
  let {questionId} = useParams()
  const [res, executeQuery] = useQuery({
    query: `
      query ($id: String!) {
        question(_id: $id) {
          _id
          text
          answers {
            _id
            text
          }
        }
      }
    `,
    variables: { id: questionId }
  })
  const [addAnswerResult, addAnswer] = useMutation(`
      mutation ($answer: AnswerInput, $question: String) {
        addAnswer (answer: $answer, question: $question) {
          _id
        }
      }
    `)
  let question = {
    text: "---"
  }
  if (res.data && res.data.question) {
    question = res.data.question
  }
  return <div className="admin-questions-items-container">
      <h1 className="admin-questioncards-title">{question.text}</h1>
      <p>ID: {questionId}</p>
      <h2>Answers</h2>
      <span onClick={()=>addAnswer({answer: {text: "New answer"}, question: questionId})}>Add answer</span>
      <ol>
        {(question.answers || []).map(q => <li key={q._id}>
          <p>{q.text}</p>
        </li>)}
      </ol>
      <h2>Preview</h2>
      <Question text={question.text} answers={(question.answers || [])}></Question>
  </div>
}

export default QuestionDetails;
