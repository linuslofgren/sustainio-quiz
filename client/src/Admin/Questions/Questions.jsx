import React from 'react';
import { Link } from 'react-router-dom'
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
          <Link to={'questions/'+q._id} key={q._id}><QuestionCard text={q.text}/></Link>
        )}
      </div>
    </div>
}

export default Questions;
