import React from 'react';

const Questionnaires = ({questionnaires}) => {
  return <div className="admin-questions-items-container">
      <h1 className="admin-questioncards-title">
        Questionnaires
        <span className="admin-questioncards-new-q">New Questionnaires</span>
      </h1>
      <div className="admin-questioncards-container">
        {questionnaires.map(q => <div key={q._id}>
          <p>expiryDate: {q.expiryDate}</p>
          <p>code: {q.code}</p>
          <p>linkUri: {q.linkUri}</p>
          <p>name: {q.name}</p>
          <p>({q.questions.length} questions)</p>
        </div>)}
      </div>

  </div>
}

export default Questionnaires;
