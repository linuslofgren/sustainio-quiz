import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'urql'
import Question from '../../components/question/Question'
import '../../App.css';

const Quiz = ({questionnaire}) => {
  let [qIdx, setQIdx] = useState(0)
  let [answerId, setAnswerId] = useState()
  const [createAnswerResult, createAnswer] = useMutation(`
      mutation ($questionnaire: String) {
        addUserAnswerResult(questionnaire: $questionnaire) {
          _id
        }
      }
    `)
  const [addAnswerResult, addAnswer] = useMutation(`
      mutation ($answerId: String, $userAnswer: UserAnswerInput) {
        addUserAnswer(userAnswerResult: $answerId, userAnswer: $userAnswer) {
          _id
        }
      }
    `)
  useEffect(()=>{
    createAnswer({questionnaire: questionnaire._id})
    .then(res => setAnswerId(res.data.addUserAnswerResult._id))
  }, [questionnaire._id])
  let questions = questionnaire.fullQuestions || []
  return (
    <div className="App">
      <h1>{questionnaire.name} - {answerId}</h1>
      {questions.map((q, i) => {
        if(i === qIdx) {
          return <Question key={q._id} index={i+1} total={questions.length} text={q.text} answers={q.answers} progress={(answer)=>{
              addAnswer({answerId: answerId, userAnswer: { answer: answer._id, question: q._id }})
              setQIdx(i => i+1)
            }}></Question>
        } else {
          return null
        }
      })}
      {qIdx ? <span onClick={()=>{setQIdx(i => i - 1)}}>Back</span> : null}
    </div>
  );
}

export default Quiz;
