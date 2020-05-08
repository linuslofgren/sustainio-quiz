import React from 'react';
import { useQuery } from 'urql'
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
  let questionnaires = []
  if(res.data) {
    questionnaires = res.data.questionnaires
  }
  return (
    <Questionnaires questionnaires={questionnaires}/>
  );
}

export default QuestionnairesList;
