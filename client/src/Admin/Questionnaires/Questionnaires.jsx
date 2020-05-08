import React from 'react';
import {Link} from 'react-router-dom'
import QuestionnaireCard from './QuestionnaireCard/QuestionnaireCard'

const Questionnaires = ({questionnaires}) => {
  return <div className="admin-questions-items-container">
      <h1 className="admin-questioncards-title">
        Questionnaires
        <span className="admin-questioncards-new-q">New Questionnaires</span>
      </h1>
      <div className="admin-questioncards-container">
        {questionnaires.map(q => <Link to={'questionnaires/'+q._id}><QuestionnaireCard
          key={q._id}
          name={q.name}
          questions={q.questions.length}
          responses={q.responses.length}/>
      </Link>
      )}
      </div>

  </div>
}

export default Questionnaires;
