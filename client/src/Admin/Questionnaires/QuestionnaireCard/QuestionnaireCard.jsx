import React from 'react'
import './QuestionnaireCard.css'

const QuestionnaireCard = ({name, questions, responses}) => {
  return <div className="questionnairecard-container">
    <p className="questionnairecard-text">{name}</p>
    <p className="questionnairecard-sub">
      <span>
        {questions} <span className="questionnairecard-sub-unit">question{questions != 1 ? 's': ''}</span>
      </span>
      <span>
        {responses} <span className="questionnairecard-sub-unit">response{responses != 1 ? 's': ''}</span>
      </span>
    </p>
  </div>
}

export default QuestionnaireCard
