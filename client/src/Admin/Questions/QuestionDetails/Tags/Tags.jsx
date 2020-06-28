import React from 'react'
import { useMutation } from 'urql'
import Tag from '../../../../components/tag/Tag'

const Tags = () => {
  const [addTagResult, addTag] = useMutation(`
      mutation ($answer: AnswerInput, $question: String) {
        addAnswer (answer: $answer, question: $question) {
          _id
        }
      }
    `)
  return <><p>Tags</p><Tag></Tag></>
}

export default Tags
