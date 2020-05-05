import React from 'react';
import './Questions.css'

import QuestionCard from './QuestionCard/QuestionCard'

const Questions = () => {
  return <div className="admin-questions-container">
    <input placeholder="Seach for question, answer or questionnaire" className="admin-questions-search-input"/>
    <div className="admin-questions-items-container">
      <h1 className="admin-questioncards-title">Questions <span className="admin-questioncards-new-q">New Question</span></h1>
      <div className="admin-questioncards-container">
        {Array.from({length: 10}).map((_, i) =>
          <QuestionCard key={i} text={"What are the main gases responsible for the Greenhouse Effect?"}/>
        )}

      </div>
    </div>
  </div>
}

export default Questions;
