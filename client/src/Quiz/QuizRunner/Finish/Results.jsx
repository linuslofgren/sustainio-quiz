import React from 'react'
import { useQuery } from 'urql'
import './Results.css'

const Results = ({questionnaire, answers}) => {

  const correctAnswers = questionnaire.fullQuestions.flatMap(q => q.answers.filter(a => a.correct).map(a => a._id))
  // let answers = answers.map(a => a.answer)
  let answeredQuestions = answers.reduce((acc, cur) => {acc[cur.question] = cur.answer; return acc}, {})
  let correct = Object.keys(answeredQuestions).map(q => correctAnswers.includes(answeredQuestions[q])).filter(a => a)
  //answers.filter(a => correctAnswers.includes(a))
  return <div className="UserResults-results-container">
    <h1>{questionnaire.name}</h1>
    <h1>{correct.length}/{questionnaire.fullQuestions.length} correct</h1>
    {questionnaire.fullQuestions.map(q => <div key={q._id}>
      {q.text}
      <div className="UserResults-answers-container">
        {q.answers.map(a => {
          let correct = a.correct
          let picked = answeredQuestions[q._id] === a._id
          let hasCorrect = q.answers.some(a => a.correct)
          return <div  key={a._id} className={`UserResults-answers-item ${
              !hasCorrect ? '' :
              (correct && picked) ?
              " UserResults-answers-item-right "
              : correct
                ? " UserResults-answers-item-correct-indication "
                : picked
                  ? " UserResults-answers-item-wrong " : ""
            }`}>{a.text}</div>
        })}
      </div>
    </div>)}
  </div>
}

export default Results
