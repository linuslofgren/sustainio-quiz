import React from 'react';
import { useQuery, useMutation } from 'urql'
import Questions from './Questions'

const QuestionsProvider = ({code}) => {
  const [res, executeQuery] = useQuery({
    query: `
      query {
        questions {
          _id
          text
        }
      }
    `
  })
  const [addQuestionResult, addQuestion] = useMutation(`
      mutation ($text: String) {
        createQuestion (text: $text) {
          _id
        }
      }
    `)
  let questions = []
  if(res.data) {
    questions = res.data.questions
  }
  return (
    <Questions questions={questions} addQuestion={()=>{addQuestion({text: "Auto q"})}}/>
  );
}

export default QuestionsProvider;
