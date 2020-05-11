import React from 'react'
import { useQuery } from 'urql'
import './Results.css'

const Results = ({questionnaire, answers}) => {

  const correctAnswers = questionnaire.fullQuestions.flatMap(q => q.answers.filter(a => a.correct).map(a => a._id))
  // let answers = answers.map(a => a.answer)
  let correct = answers.filter(a => correctAnswers.includes(a))
  return <React.Fragment>
    <h1>{correct.length}/{answers.length} correct</h1>
    {questionnaire.fullQuestions.map(q => <div key={q._id}>
      {q.text}
      <div className="UserResults-answers-container">
        {q.answers.map(a => {
          let correct = a.correct
          let picked = answers.includes(a._id)
          return <div  key={a._id} className={`UserResults-answers-item ${
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
  </React.Fragment>
}

export default Results
