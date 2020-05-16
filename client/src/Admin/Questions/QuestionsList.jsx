import React, {useMemo} from 'react';
import { useQuery, useMutation } from 'urql'
import Questions from './Questions'

const QuestionsList = ({code}) => {
  const context = useMemo(()=>({additionalTypenames: ['Question']}), [])
  const [res, executeQuery] = useQuery({
    query: `
      query {
        questions {
          _id
          text
        }
      }
    `,
    context
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

export default QuestionsList;
