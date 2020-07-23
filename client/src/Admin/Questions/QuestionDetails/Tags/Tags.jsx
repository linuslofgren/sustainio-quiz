import React from 'react'
import { useMutation } from 'urql'
import Tag from '../../../../components/tag/Tag'

const Tags = ({questionId, tags}) => {
  const [addTagResult, addTag] = useMutation(`
    mutation ($question: String, $tags: [String]) {
      Question(_id: $question) {
        text(input: $tags) {
          _id
        }
      }
    }
  `)
  return <><p>Tags</p><Tag></Tag><button>Add</button></>
}

export default Tags
