import React, {useState} from 'react'
import './Responses.css'

const Responses = ({questionnaire}) => {
  let [copied, setCopied] = useState(false)
  // console.log(questionnaire)
  let responses = questionnaire.responses || []
  let questions = questionnaire.fullQuestions || []
  const fmt = (str) => new Date(str).toLocaleDateString() + ' ' + new Date(str).toLocaleTimeString()
  const answersFor = (answerId) => responses.flatMap(r => r.answers).filter(a => a.answer === answerId)

  const copiedShow = () => {
    setCopied(true)
    setTimeout(()=>{setCopied(false)}, 4000)
  }
  return <div className="admin-questions-items-container">
    <h1 className="admin-questioncards-title" >Responses</h1>
    <button onClick={()=>{
        let data = document.querySelector('table').outerHTML
        if(navigator.clipboard) {
          navigator.clipboard.writeText(data)
            .then(copiedShow)
        } else {
          let textArea = document.createElement("textarea")
          // textArea.style.display = "none"
          textArea.value = data
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          document.execCommand("copy")
          document.body.removeChild(textArea)
          copiedShow()
        }
      }}>Copy data</button>
    {copied ? <span> Data copied! Use <code>ctrl + V</code> to paste into Excel</span> : null}
    <table>
      <thead>
        <tr><th/>{questions.map(q => <th key={q._id} colSpan={q.answers.length}>{q.text}</th>)}</tr>
        <tr><th/>{questions.flatMap(q => q.answers).map(a => <th key={a._id}>[{a.correct ? 'Correct' : 'Wrong'}] {a.text}</th>)}</tr>
      </thead>
      <tbody>
        {responses.map(response => <tr key={response._id}>
          <td>{fmt(response.time)}</td>
          {questions.flatMap(q => q.answers).map(a => <td key={a._id}>{response.answers.find(resp_a => resp_a.answer===a._id) ? 'X' : ''}</td>)}
        </tr>)}
      </tbody>
    </table>
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
  </div>
}

export default Responses
