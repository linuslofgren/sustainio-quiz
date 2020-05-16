import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from 'urql'
import { useParams, Link, Switch, Route } from 'react-router-dom'
import QuestionSelection from './QuestionSelection'
import MainInput from '../../../components/input/MainInput'
import Plus from '../../../components/icons/Plus'
import Responses from './Responses/Responses'

const QuestionnaireDetails = ({}) => {
  const context = useMemo(()=>({additionalTypenames: ['Questionnaire']}), [])
  let {questionnaireId} = useParams()
  const [res, executeQuery] = useQuery({
    query: `
      query ($id: String!) {
        questionnaire(_id: $id) {
          _id
          name
          code
          expiryDate
          questions
          finishFeedback
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
  const [changeCodeResult, changeCode] = useMutation(`
      mutation ($questionnaire: String) {
        Questionnaire(_id: $questionnaire) {
          code {
            _id
          }
        }
      }
    `)
    const [setFinishFeedbackResult, setFinishFeedback] = useMutation(`
        mutation ($questionnaire: String, $show: Boolean) {
          Questionnaire(_id: $questionnaire) {
            finishFeedback(show: $show) {
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
          <p>Code: {questionnaire.code} <button onClick={()=>changeCode({questionnaire: questionnaireId})
            // .then(()=>{
            //   executeQuery({ requestPolicy: 'cache-and-network' })
            // })
          }>Re-Generate</button></p>
          {
            questionnaire.expiryDate ?
              <p>Expires: {questionnaire.expiryDate}</p>
            :
              <p>Never Expires</p>
          }
          <span><input type="checkbox" checked={questionnaire.finishFeedback || false} onChange={(e)=>{
              setFinishFeedback({questionnaire: questionnaireId, show: e.target.checked})
          }}/> Show answers when completed</span>
          <Link to={`/admin/questionnaires/${questionnaireId}/responses`}><p>Responses: {(questionnaire.responses || []).length}</p></Link>
          <h2>Questions</h2>
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
          {showAddQuestion ? null : <span onClick={()=>setShowQuestion(s => !s)}>Add Question</span>}
          {showAddQuestion ? <QuestionSelection hide={()=>setShowQuestion(false)} addedQuestions={(questionnaire.questions || [])} addQuestion={(questionId)=>addQuestion({question: questionId, questionnaire:  questionnaireId})}/> : null}
      </div>
    </Route>
  </Switch>

}

export default QuestionnaireDetails;
