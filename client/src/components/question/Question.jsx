import React, {useState} from 'react'
import Answers from './answers/Answers'
import './Question.css'

const Question = ({text, answers}) => {
  let [sel, setSel] = useState()
  return <div className="question-container">
    <h1 className="question-title">{text}</h1>
    <Answers answers={answers} selection={sel} setSelection={setSel}/>
    <button className={"question-next " + (sel!==undefined ? 'question-next-active': '')}>Next</button>
  </div>
}

export default Question
