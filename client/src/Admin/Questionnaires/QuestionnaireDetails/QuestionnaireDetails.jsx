import React from 'react';
import { useQuery } from 'urql'
import { useParams } from 'react-router-dom'

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
      <ol>
        {(questionnaire.fullQuestions || []).map(q => <li key={q._id}>
          <p>{q.text}</p>
          <ul>{q.answers.map(a => <li key={a._id}>{a.text}</li>)}</ul>
        </li>)}
      </ol>
  </div>
}

export default QuestionnaireDetails;
