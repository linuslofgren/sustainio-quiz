var mongo = require('mongodb')

const protect = (req) => {
  // console.log(req)
  if(!req.isAuthenticated()) {
    throw Error("Not authenticated")
  }
}

const validQuestionnaire = (questionnaire) => {
  if(!questionnaire) {
    return false
  }
  if(questionnaire.expiryDate) {
    let now = new Date()
    if(now > questionnaire.expiryDate) {
      return false
    }
  }
  return true
}

var root = (db) => {

  const Questionnaires = db.collection('questionnaires')
  const Questions = db.collection('questions')

  return {
    questions: async () => {
      return await Questions.find({}).toArray()
    },
    question: async ({ _id }) => {
      return await Questions.findOne({_id: mongo.ObjectId(_id)})
    },
    createQuestion: async ({text}, req) => {
      protect(req)
      var question = {text: text}
      await Questions.insertOne(question)
      return question
    },
    questionnaires: async (args, req) => {
      protect(req);
      return await Questionnaires.aggregate([
        {
          $lookup: { from: "questions", localField: "questions", foreignField: "_id", as: "fullQuestions" }
        }
      ]).toArray()
    },
    questionnaire: async ({ _id }) => {
      return await Questionnaires.aggregate([
        {
          $match: {_id: mongo.ObjectId(_id)}
        },
        {
          $lookup: { from: "questions", localField: "questions", foreignField: "_id", as: "fullQuestions" }
        }
      ]).next()
    },
    questionnaireByCode: async ({ code }) => {
      console.log(code)
      const questionnaire = await Questionnaires.aggregate([
        {
          $match: {code: code}
        },
        {
          $lookup: { from: "questions", localField: "questions", foreignField: "_id", as: "fullQuestions" }
        }
      ]).next()
      if(!validQuestionnaire(questionnaire)){
        return null
      }
      return questionnaire
    },
    questionnaireByLinkUri: async ({ uri }) => {
      const questionnaire = await Questionnaires.aggregate([
        {
          $match: {linkUri: uri}
        },
        {
          $lookup: { from: "questions", localField: "questions", foreignField: "_id", as: "fullQuestions" }
        }
      ]).next()
      if(!validQuestionnaire(questionnaire)){
        return null
      }
      return questionnaire
    },
    createQuestionnaire: async ({name}, args) => {
      protect(args);
      var questionnaire = {name: name, code: "1234", questions: [], responses: []}
      await Questionnaires.insertOne(questionnaire)
      return questionnaire
    },
    addQuestion: async ({question, questionnaire}, req) => {
      protect(req);
      await Questionnaires.updateOne(
        {
          _id: mongo.ObjectId(questionnaire)
        },
        {
          $push: { questions: mongo.ObjectId(question) }
        }
      )
      return await Questionnaires.findOne(mongo.ObjectId(questionnaire))
    },
    addAnswer: async ({answer, question}, req) => {
      protect(req);
      await Questions.updateOne(
        {
          _id: mongo.ObjectId(question)
        },
        {
          $push: { answers: {...answer, _id: new mongo.ObjectID()} }
        }
      )
      return await Questions.findOne(mongo.ObjectId(question))
    },
    addUserAnswerResult: async ({questionnaire}) => {
      const id = new mongo.ObjectID()
      const response = {time: new Date().toISOString(), _id: id, answers: []}
      await Questionnaires.updateOne(
        {
          _id: mongo.ObjectId(questionnaire)
        },
        {
          $push: { responses: response }
        }
      )
      return response
    },
    addUserAnswer: async ({userAnswerResult, userAnswer}) => {
      await Questionnaires.updateOne(
        { "responses._id": mongo.ObjectId(userAnswerResult) },
        {
          $pull: { "responses.$.answers": {question: userAnswer.question} }
        }
      )
      await Questionnaires.updateOne(
        { "responses._id": mongo.ObjectId(userAnswerResult) },
        {
          $push: { "responses.$.answers": {...userAnswer} }
        }
      )
      const res = (await Questionnaires.findOne(
        {
          "responses._id": mongo.ObjectId(userAnswerResult)
        },
        {
          projection: {"responses.$": true}
        }
      ))
      return res.responses[0]
    },
    userAnswerResult: async ({userAnswerResult}) => {
      const res = (await Questionnaires.findOne(
        {
          "responses._id": mongo.ObjectId(userAnswerResult)
        },
        {
          projection: {"responses.$": true}
        }
      ))
      return res.responses[0]
    },
    Question: async ({_id}, req) => {
      protect(req);
      return {
        text: async ({input}) => {
          await Questions.updateOne({"_id": mongo.ObjectId(_id)}, {"$set": {"text": input}})
          return await Questions.findOne({_id: mongo.ObjectId(_id)})
        },
        tags: async ({input}) => {
          await Questions.updateOne({"_id": mongo.ObjectId(_id)}, {"$set": {"tags": input}})
          return await Questions.findOne({_id: mongo.ObjectId(_id)})
        },
        Answer: async ({answer}) => ({
          text: async ({input}) => {
            Questions.updateOne({"answers._id": mongo.ObjectId(answer)}, {"$set": {"answers.$.text": input}})
            return (await Questions.findOne({"answers._id": mongo.ObjectId(answer)}, {"answers.$._id": 1})).answers[0]
          },
          correct: async ({correct}) => {
            Questions.updateOne({"answers._id": mongo.ObjectId(answer)}, {"$set": {"answers.$.correct": correct}})
            return (await Questions.findOne({"answers._id": mongo.ObjectId(answer)}, {"answers.$._id": 1})).answers[0]
          },
          remove: async () => {
            await Questions.updateOne(
              {
                _id: mongo.ObjectId(_id)
              },
              {
                $pull: { answers: { _id: mongo.ObjectID(answer) } }
              }
            )
            return await Questions.findOne(mongo.ObjectId(_id))
          }
        })
      }
    },
    Questionnaire: async ({_id}, req) => {
      protect(req);
      const questionnaire = _id
      return {
        linkUri: async ({input})=>{
          if(input === "") {
            await Questionnaires.updateOne({"_id": mongo.ObjectId(_id)}, {"$unset": {"linkUri": input}})
          } else {
            await Questionnaires.updateOne({"_id": mongo.ObjectId(_id)}, {"$set": {"linkUri": input}})
          }
          return await Questionnaires.findOne({"_id": mongo.ObjectId(_id)})
        },
        expiryDate: async ({input})=>{
          console.log(typeof input)
          console.log(input)
          let requestedDate = new Date(input)
          if(!isNaN(requestedDate)) {
            console.log("Updating date...")
            await Questionnaires.updateOne({"_id": mongo.ObjectId(_id)}, {"$set": {"expiryDate": requestedDate}})
          } else {
            console.log(requestedDate)
            console.log(!isNaN(requestedDate))
          }
          return await Questionnaires.findOne({"_id": mongo.ObjectId(_id)})
        },
        code: async ()=>{

          let code = Math.floor(Math.random()*10000) + ""

          await Questionnaires.updateOne({"_id": mongo.ObjectId(_id)}, {"$set": {"code": code}})
          return await Questionnaires.findOne({"_id": mongo.ObjectId(_id)})
        },
        name: async ({input})=> {
          await Questionnaires.updateOne({"_id": mongo.ObjectId(_id)}, {"$set": {"name": input}})
          return await Questionnaires.aggregate([
            {
              $match: {_id: mongo.ObjectId(_id)}
            },
            {
              $lookup: { from: "questions", localField: "questions", foreignField: "_id", as: "fullQuestions" }
            }
          ]).next()
        },
        finishFeedback: async ({show})=> {
          await Questionnaires.updateOne({"_id": mongo.ObjectId(_id)}, {"$set": {"finishFeedback": show}})
          return await Questionnaires.aggregate([
            {
              $match: {_id: mongo.ObjectId(_id)}
            },
            {
              $lookup: { from: "questions", localField: "questions", foreignField: "_id", as: "fullQuestions" }
            }
          ]).next()
        },
        Question: (parent) => {
          const question = parent._id
          return {
            remove: async () => {
              await Questionnaires.updateOne(
                {
                  _id: mongo.ObjectId(questionnaire)
                },
                {
                  $pull: { questions: mongo.ObjectId(question) }
                }
              )
              return await Questionnaires.findOne(mongo.ObjectId(questionnaire))
            }
          }
        }
      }
    }
  }
}

module.exports = root
