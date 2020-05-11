import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'urql'
import Question from '../../components/question/Question'
import '../../App.css';
import ResultsProvider from './Finish/ResultsProvider'
import Empty from './Finish/Empty'

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

  let q = questions[qIdx] || null
  return (
    <div className="App">
      <h1>{questionnaire.name}</h1>
      {q ? <Question key={q._id} index={qIdx+1} total={questions.length} text={q.text} answers={q.answers} progress={(answer)=>{
              addAnswer({answerId: answerId, userAnswer: { answer: answer._id, question: q._id }})
              setQIdx(i => i+1)
            }}></Question>
          : questionnaire.finishFeedback ? <ResultsProvider answerId={answerId} questionnaire={questionnaire}/> : <Empty/>
      }
      {qIdx && q ? <span onClick={()=>{setQIdx(i => i - 1)}}>Back</span> : null}
    </div>
  );
}

export default Quiz;
