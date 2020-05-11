import React from 'react';
import { useQuery } from 'urql'
import './QuestionSelection.css'

const QuestionSelection = ({addQuestion, addedQuestions, hide}) => {
  const [res, executeQuery] = useQuery({
    query: `
      query {
        questions {
          _id
          text
          tags
        }
      }
    `
  })
  let questions = []
  if(res.data) {
    questions = res.data.questions
  }
  const added = (id) => addedQuestions.includes(id)
  const tags = [...new Set(questions.flatMap(q => q.tags || []))]
  return (
  <div className="QuestionSelection-container">
    <h3 className="QuestionSelection-title">Add question<span className="QuestionSelection-close" onClick={hide}>Close</span></h3>
    {/*<input />
    <h3>Collections</h3>
      <ul className="QuestionSelection-list">
        {tags.map(t =>
          <li className="QuestionSelection-item" key={t}>
            {t}
          </li>
        )}
      </ul>
    <h3>Questions</h3>*/}
    <ul className="QuestionSelection-list">
      {questions.map(q =>
        <li className="QuestionSelection-item" key={q._id} onClick={()=>addQuestion(q._id)}>
          {q.text}
          {added(q._id) ?
            <span className="QuestionSelection-text-added">Added</span>
          :
            <button className="QuestionSelection-button-add">Add</button>
          }

        </li>
      )}
    </ul>
  </div>
  );
}

export default QuestionSelection;
