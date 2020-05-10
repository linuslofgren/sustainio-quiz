import React from 'react';
import {Link} from 'react-router-dom'
import QuestionnaireCard from './QuestionnaireCard/QuestionnaireCard'

const Questionnaires = ({questionnaires, addQuestionnaire}) => {
  return <div className="admin-questions-items-container">
      <h1 className="admin-questioncards-title">
        Questionnaires
        <span className="admin-questioncards-new-q" onClick={addQuestionnaire}>New Questionnaire</span>
      </h1>
      <div className="admin-questioncards-container">
        {questionnaires.map(q => <Link to={'questionnaires/'+q._id} key={q._id}><QuestionnaireCard
          name={q.name}
          questions={q.questions.length}
          responses={q.responses.length}/>
      </Link>
      )}
      </div>

  </div>
}

export default Questionnaires;
