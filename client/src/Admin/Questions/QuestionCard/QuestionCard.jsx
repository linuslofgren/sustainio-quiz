import React from 'react'
import './QuestionCard.css'

const QuestionCard = ({text}) => {
  let truncatedText = text//.slice(0,20)
  return <div className="questioncard-container">
    <p className="questioncard-text">{truncatedText + (truncatedText.length !== text.length ? '...' : '')}</p>
  </div>
}

export default QuestionCard
