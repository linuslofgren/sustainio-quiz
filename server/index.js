var mongo = require('mongodb')
var express = require('express')
var cors = require('cors')
var graphqlHTTP = require('express-graphql')
var { buildSchema } = require('graphql')

var db = {questionnaires: [
  {
    _id: "ididididid",
    expiryDate: "Now",
    code: "5689",
    linkUri: "aska%2wr/6q3"
  }
]}

var schema = buildSchema(`
  type Query {
    questions: [Question]
    question(_id: String): Question
    questionnaires: [Questionnaire]
    questionnaire(_id: String): Questionnaire
    questionnaireByCode(code: String): Questionnaire
    questionnaireByLinkUri(uri: String): Questionnaire
  }
  type Questionnaire {
    _id: String
    expiryDate: String
    code: String
    linkUri: String
    name: String
    questions: [String]
    fullQuestions: [Question]
    responses: [UserAnswerResult]
  }
  type Question {
    _id: String
    text: String
    answers: [Answer]
  }
  type Answer {
    _id: String
    text: String
  }
  type UserAnswerResult {
    _id: String
    time: String
    answers: [UserAnswer]
  }
  type UserAnswer {
    _id: String
    answer: String
    question: String
  }
  input AnswerInput {
    text: String
  }
  input UserAnswerInput {
    answer: String
    question: String
  }

  type QuestionnaireOps {
    expireDate(input: String): Questionnaire
    code(input: String): Questionnaire
    name(input: String): Questionnaire
  }

  type QuestionOps {
    text(input: String): Question
    Answer(answer: String): AnswerOps
  }

  type AnswerOps {
    text(input: String): Answer
  }

  type Mutation {
    createQuestion(text: String): Question
    createQuestionnaire(name: String): Questionnaire
    addQuestion(question: String, questionnaire: String): Questionnaire
    addAnswer(answer: AnswerInput, question: String): Question
    addUserAnswerResult(questionnaire: String): UserAnswerResult
    addUserAnswer(userAnswerResult: String, userAnswer: UserAnswerInput): UserAnswerResult
    Question(_id: String): QuestionOps
    Questionnaire(_id: String): QuestionnaireOps
  }
`)

// Answer count:
// db.questionnaires.aggregate({$unwind: "$responses"}, {$unwind: "$responses.answers"}, {$group: {_id: "$responses.answers.answer", count: {$sum: 1}}}).pretty()

const start = async () => {

  var url = "mongodb://localhost:27017"
  var dbname = "test"

  const mongodb = await mongo.MongoClient.connect(url, { useUnifiedTopology: true })

  const Questionnaires = mongodb.db(dbname).collection('questionnaires')
  const Questions = mongodb.db(dbname).collection('questions')

  var root = {
    questions: async () => {
      return await Questions.find({}).toArray()
    },
    question: async ({ _id }) => {
      return await Questions.findOne({_id: mongo.ObjectId(_id)})
    },
    createQuestion: async ({text}) => {
      var question = {text: text}
      await Questions.insertOne(question)
      return question
    },
    questionnaires: async () => {
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
      return await Questionnaires.aggregate([
        {
          $match: {code: code}
        },
        {
          $lookup: { from: "questions", localField: "questions", foreignField: "_id", as: "fullQuestions" }
        }
      ]).next()
    },
    questionnaireByLinkUri: async ({ uri }) => {
      return await Questionnaires.findOne({linkUri: uri})
    },
    createQuestionnaire: async ({name}) => {
      var questionnaire = {name: name, code: "1234", questions: [], responses: []}
      await Questionnaires.insertOne(questionnaire)
      return questionnaire
    },
    addQuestion: async ({question, questionnaire}) => {
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
    addAnswer: async ({answer, question}) => {
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
          $push: { "responses.$.answers": {...userAnswer} }
        }
      )
      const res = (await Questionnaires.findOne( { "responses._id": mongo.ObjectId(userAnswerResult) }, {"responses.$.answers": 1} ))
      return res.responses[0]
    },
    Question: async ({_id}) => ({
      text: async ({input}) => {
        await Questions.updateOne({"_id": mongo.ObjectId(_id)}, {"$set": {"text": input}})
        return await Questions.findOne({_id: mongo.ObjectId(_id)})
      },
      Answer: async ({answer}) => ({
        text: async ({input}) => {
          Questions.updateOne({"answers._id": mongo.ObjectId(answer)}, {"$set": {"answers.$.text": input}})
          return (await Questions.findOne({"answers._id": mongo.ObjectId(answer)}, {"answers.$._id": 1})).answers[0]
        }
      })
    }),
    Questionnaire: async ({_id}) => ({
      expiryDate: ()=>{},
      code: ()=>{},
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
      }
    })
  }

  var app = express()
  app.use(cors())
  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  }))

  app.listen(4000, () => {
    console.log("Running on port 4000")
  })

}

start()
