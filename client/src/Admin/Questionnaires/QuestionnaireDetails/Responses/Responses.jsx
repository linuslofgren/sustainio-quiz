import React from 'react'

const Responses = ({questionnaire}) => {
  console.log(questionnaire)
  let responses = questionnaire.responses || []
  let questions = questionnaire.fullQuestions || []
  const fmt = (str) => new Date(str).toLocaleDateString() + ' ' + new Date(str).toLocaleTimeString()
  const answersFor = (answerId) => responses.flatMap(r => r.answers).filter(a => a.answer === answerId).length
  return <div className="admin-questions-items-container">
    <h1 className="admin-questioncards-title" >Responses</h1>
    <ul>
      {responses.map(response => <li key={response._id}>
        {fmt(response.time)} - {response.answers.length} qs
      </li>)}
    </ul>
    <ol>
      {questions.map(q => <li key={q._id}>
        {q.text}
        <ul>
          {q.answers.map(a => <li key={a._id}>
            {answersFor(a._id)} - {a.text}
          </li>)}
        </ul>
      </li>)}
    </ol>
  </div>
}

export default Responses
