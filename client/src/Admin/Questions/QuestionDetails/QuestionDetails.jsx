import React, {useState} from 'react';
import { useQuery, useMutation } from 'urql'
import { useParams } from 'react-router-dom'
import Question from '../../../components/question/Question'
import MainInput from '../../../components/input/MainInput'
import EditableItem from '../../../components/input/EditableItem'
import Tags from './Tags/Tags'
import './QuestionDetails.css'

const QuestionDetails = ({}) => {
  let {questionId} = useParams()
  const [res, executeQuery] = useQuery({
    query: `
      query ($id: String!) {
        question(_id: $id) {
          _id
          text
          tags
          answers {
            _id
            text
            correct
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
  const [changeTextResult, changeText] = useMutation(`
      mutation ($question: String, $text: String) {
      	Question(_id: $question) {
          text(input: $text) {
            _id
          }
        }
      }
    `)

  const [changeAnswerTextResult, changeAnswerText] = useMutation(`
    mutation ($question: String, $answer: String, $text: String) {
    	Question(_id: $question) {
        Answer(answer: $answer) {
          text(input: $text) {
            _id
          }
        }
      }
    }
  `)
  const [changeAnswerCorrectResult, changeAnswerCorrect] = useMutation(`
    mutation ($question: String, $answer: String, $correct: Boolean) {
    	Question(_id: $question) {
        Answer(answer: $answer) {
          correct(correct: $correct) {
            _id
          }
        }
      }
    }
  `)
  const [removeAnswerResult, removeAnswer] = useMutation(`
    mutation ($question: String, $answer: String) {
    	Question(_id: $question) {
        Answer(answer: $answer) {
          remove {
            _id
          }
        }
      }
    }
  `)
  let [showChangeText, setShowChangeText] = useState(false)
  let question = {
    text: "---"
  }
  if (res.data && res.data.question) {
    question = res.data.question
  }
  return <div className="admin-questions-items-container">
      {
        showChangeText ?
          <MainInput defaultValue={question.text} save={(newVal)=>{
              changeText({question: questionId, text:newVal})
              .then(()=>setShowChangeText(false))
            }}/>
        :
          <h1 className="admin-questioncards-title" onClick={()=>setShowChangeText(true)}>{question.text}</h1>
      }

      <p>ID: {questionId}</p>
      <Tags tags={question.tags}/>
      <h2>Answers</h2>
      <span className="small-button" onClick={()=>addAnswer({answer: {text: "New answer"}, question: questionId})}>Add answer</span>
      <ol>
        {(question.answers || []).map(q => <li key={q._id}>
          <div className="admin-questioncards-answer-item">
            <input type="checkbox" checked={(q.correct || false)} onChange={(e)=>{
                changeAnswerCorrect({question: questionId, answer: q._id, correct: e.target.checked})
              }}/>
            <EditableItem defaultValue={q.text} save={(newVal)=>{
                changeAnswerText({question: questionId, answer: q._id, text: newVal})
                .then(console.log)
              }}>
              <span>{q.text}</span>
            </EditableItem>
            <button onClick={()=>removeAnswer({question: questionId, answer: q._id})}>Remove</button>
          </div>
        </li>)}
      </ol>
      <h2>Preview</h2>
      <Question text={question.text} answers={(question.answers || [])}></Question>
  </div>
}

export default QuestionDetails;
