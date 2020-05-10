import React from 'react';
import { useQuery, useMutation } from 'urql'
import Questionnaires from './Questionnaires'

const QuestionnairesList = () => {
  const [res, executeQuery] = useQuery({
    query: `
      query {
        questionnaires {
          _id
          name
          questions
          expiryDate
          code
          linkUri
          responses {
            _id
          }
        }
      }
    `
  })
  const [addQuestionnaireResult, addQuestionnaire] = useMutation(`
      mutation ($name: String) {
        createQuestionnaire (name: $name) {
          _id
        }
      }
    `)
  let questionnaires = []
  if(res.data) {
    questionnaires = res.data.questionnaires
  }
  return (
    <Questionnaires questionnaires={questionnaires} addQuestionnaire={()=>{addQuestionnaire({name: "New questionnaire"})}}/>
  );
}

export default QuestionnairesList;
