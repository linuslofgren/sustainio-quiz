import React, {useState} from 'react'
import Answers from './answers/Answers'
import './Question.css'

const Question = ({text, answers, index, total}) => {
  let [sel, setSel] = useState()
  return <div className="question-container">
    <h1 className="question-title">
      <span>{text}</span>
      {index && total ? <span className="question-sequence-info">{index}/{total}</span> : null}
    </h1>
    <Answers answers={answers} selection={sel} setSelection={setSel}/>
    <button className={"question-next " + (sel!==undefined ? 'question-next-active': '')}>Next</button>
  </div>
}

export default Question
