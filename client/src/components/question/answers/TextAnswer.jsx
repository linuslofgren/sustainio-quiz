import React from 'react'
import './Answers.css'
import './TextAnswer.css'
const TextAnswer = ({text, selected, ...props}) => {
  return <div className={"answer " + (selected ? 'answer-selected' : '')} {...props}>
    <div className={'answer-selection-box '}/>
    <span>{text}</span>
  </div>
}

export default TextAnswer
