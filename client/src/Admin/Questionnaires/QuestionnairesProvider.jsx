import React from 'react';
import { useQuery } from 'urql'
import Questionnaires from './Questionnaires'

const QuestionnairesProvider = ({code}) => {
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

export default QuestionnairesProvider;
