import React from 'react'
import TextAnswer from './TextAnswer'
import './Answers.css'

const Answers = ({answers, selection, setSelection}) => {

  return <div className="answers-container">{
    answers.map((answer, i) => <TextAnswer key={answer._id} onClick={()=>setSelection(i)}  selected={i===selection} text={answer.text}/>)
  }</div>
}

export default Answers
