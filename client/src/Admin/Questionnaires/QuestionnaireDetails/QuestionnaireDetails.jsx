import React, { useState } from 'react';
import { useQuery, useMutation } from 'urql'
import { useParams, Link, Switch, Route } from 'react-router-dom'
import QuestionSelection from './QuestionSelection'
import MainInput from '../../../components/input/MainInput'
import Responses from './Responses/Responses'

const QuestionnaireDetails = ({}) => {
  let {questionnaireId} = useParams()
  const [res, executeQuery] = useQuery({
    query: `
      query ($id: String!) {
        questionnaire(_id: $id) {
          _id
          name
          code
          expiryDate
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
            answers {
              answer
              question
            }
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
  const [changeNameResult, changeName] = useMutation(`
      mutation ($questionnaire: String, $name: String) {
        Questionnaire(_id: $questionnaire) {
          name(input: $name) {
            _id
          }
        }
      }
    `)
  let [showAddQuestion, setShowQuestion] = useState(false)
  let [showChangeName, setShowChangeName] = useState(false)
  let questionnaire = {}
  if (res.data && res.data.questionnaire) {
    questionnaire = res.data.questionnaire
  }
  // {/*<div><input/><button onClick={()=>changeName({questionnaire: questionnaireId, name: "New auto name"})}>Save</button></div>*/}
<<<<<<< HEAD
  return <div className="admin-questions-items-container">
      {
        showChangeName ?
          <MainInput defaultValue={questionnaire.name} save={(newName)=>{
              changeName({questionnaire: questionnaireId, name: newName})
              .then(()=>setShowChangeName(false))
            }}></MainInput>
        :
          <h1 className="admin-questioncards-title" onClick={()=>setShowChangeName(true)}>{questionnaire.name}</h1>
      }
      <p>ID: {questionnaireId}</p>
      <p>Code: {questionnaire.code}</p>
      {
        questionnaire.expiryDate ?
          <p>Expires: {questionnaire.expiryDate}</p>
        :
          <p>Never Expires</p>
      }

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
=======
  return <Switch>
    <Route path="/admin/questionnaires/:questionnaireId/responses">
      <Responses questionnaire={questionnaire}/>
    </Route>
    <Route>
      <div className="admin-questions-items-container">
          {
            showChangeName ?
              <MainInput defaultValue={questionnaire.name} save={(newName)=>{
                  changeName({questionnaire: questionnaireId, name: newName})
                  .then(()=>setShowChangeName(false))
                }}></MainInput>
            :
              <h1 className="admin-questioncards-title" onClick={()=>setShowChangeName(true)}>{questionnaire.name}</h1>
          }
          <p>ID: {questionnaireId}</p>
          <p>Code: {questionnaire.code}</p>
          {
            questionnaire.expiryDate ?
              <p>Expires: {questionnaire.expiryDate}</p>
            :
              <p>Never Expires</p>
          }

          <Link to={`/admin/questionnaires/${questionnaireId}/responses`}><p>Responses: {(questionnaire.responses || []).length}</p></Link>
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
    </Route>
  </Switch>

>>>>>>> Submit answer
}

export default QuestionnaireDetails;
