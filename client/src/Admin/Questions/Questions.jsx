import React from 'react';
import './Questions.css'

import QuestionCard from './QuestionCard/QuestionCard'

const Questions = ({questions, addQuestion}) => {
  return <div className="admin-questions-items-container">
      <h1 className="admin-questioncards-title">
        Questions
        <span className="admin-questioncards-new-q" onClick={addQuestion}>New Question</span>
      </h1>
      <div className="admin-questioncards-container">
        {questions.map(q =>
          <QuestionCard key={q._id} text={q.text}/>
        )}
      </div>
    </div>
}

export default Questions;
