import React from 'react'

const Responses = ({questionnaire}) => {
  console.log(questionnaire)
  let responses = questionnaire.responses || []
  let questions = questionnaire.fullQuestions || []
  const fmt = (str) => new Date(str).toLocaleDateString() + ' ' + new Date(str).toLocaleTimeString()
  const answersFor = (answerId) => responses.flatMap(r => r.answers).filter(a => a.answer === answerId)
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
            {answersFor(a._id).length} - {a.text}
          </li>)}
        </ul>
      </li>)}
    </ol>
    <table>
      <thead>
        <tr><th/>{questions.map(q => <th key={q._id} colSpan={q.answers.length}>{q.text}</th>)}</tr>
        <tr><th/>{questions.flatMap(q => q.answers).map(a => <th key={a._id}>[{a.correct ? 'C' : 'W'}] {a.text}</th>)}</tr>
      </thead>
      <tbody>
        {responses.map(response => <tr key={response._id}>
          <td>{fmt(response.time)}</td>
          {questions.flatMap(q => q.answers).map(a => <td key={a._id}>{response.answers.find(resp_a => resp_a.answer===a._id) ? 'X' : ''}</td>)}
        </tr>)}
      </tbody>
    </table>
  </div>
}

export default Responses
