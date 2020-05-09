import React, { useState } from 'react';
import { useQuery, useMutation } from 'urql'
import { useParams, Link } from 'react-router-dom'
import QuestionSelection from './QuestionSelection'

const QuestionnaireDetails = ({}) => {
  let {questionnaireId} = useParams()
  const [res, executeQuery] = useQuery({
    query: `
      query ($id: String!) {
        questionnaire(_id: $id) {
          _id
          name
          code
          fullQuestions {
            _id
            text
            answers {
              _id
              text
            }
          }
          responses {
            _id
            time
          }
        }
      }
    `,
    variables: { id: questionnaireId }
  })
  const [addQuestionResult, addQuestion] = useMutation(`
      mutation ($question: String, $questionnaire: String) {
        addQuestion (question: $question, questionnaire: $questionnaire) {
          _id
        }
      }
    `)
  let [showAddQuestion, setShowQuestion] = useState(false)
  let questionnaire = {}
  if (res.data && res.data.questionnaire) {
    questionnaire = res.data.questionnaire
  }
  return <div className="admin-questions-items-container">
      <h1 className="admin-questioncards-title">{questionnaire.name}</h1>
      <p>ID: {questionnaireId}</p>
      <p>Code: {questionnaire.code}</p>
      <p>Responses: {(questionnaire.responses || []).length}</p>
      <h2>Questions</h2>
      <span onClick={()=>setShowQuestion(s => !s)}>Add Question</span>
      {showAddQuestion ? <QuestionSelection addQuestion={(questionId)=>addQuestion({question: questionId, questionnaire:  questionnaireId})}/> : null}
      <ol>
        {(questionnaire.fullQuestions || []).map(q => <li key={q._id}>
          <Link to={'/admin/questions/' + q._id}>
            <p>{q.text}</p>
            <ul>
              {(q.answers || []).map(a =>
                <li key={a._id}>{a.text}</li>
              )}
            </ul>
          </Link>
        </li>)}
      </ol>
  </div>
}

export default QuestionnaireDetails;
