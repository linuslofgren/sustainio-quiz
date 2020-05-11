import React from 'react'
import { useQuery } from 'urql'
import Results from './Results'

const ResultsProvider = ({questionnaire, answerId}) => {

  const [res, executeQuery] = useQuery({
    query: `
      query ($answerId: String) {
        userAnswerResult(userAnswerResult: $answerId) {
          _id
          answers {
            answer
            question
          }
      }
    }
    `,
    variables: { answerId: answerId }
  })

  const correctAnswers = questionnaire.fullQuestions.flatMap(q => q.answers.filter(a => a.correct).map(a => a._id))
  if(res.data && res.data.userAnswerResult) {
    let answers = res.data.userAnswerResult.answers.map(a => a.answer)
    let correct = answers.filter(a => correctAnswers.includes(a))
    return <Results questionnaire={questionnaire} answers={answers}/>
  } else {
    return <h1>10/10 {JSON.stringify(correctAnswers)}</h1>
  }
}

export default ResultsProvider
