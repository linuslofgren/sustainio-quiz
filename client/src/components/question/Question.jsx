import React, {useState} from 'react'
import Answers from './answers/Answers'
import './Question.css'

const Question = ({text, answers, index, total, progress}) => {
  let [sel, setSel] = useState()

  let canProgress = sel!==undefined

  return <div className="question-container">
    <h1 className="question-title">
      <span>{text}</span>
      {index && total ? <span className="question-sequence-info">{index}/{total}</span> : null}
    </h1>
    <Answers answers={(answers || [])} selection={sel} setSelection={setSel}/>
    <button className={"question-next " + (canProgress ? 'question-next-active': '')} onClick={()=>{
        if(canProgress) {
          progress(answers[sel])
        }
      }}>Next</button>
  </div>
}

export default Question
