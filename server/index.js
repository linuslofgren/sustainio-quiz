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
    userAnswersResults: [UserAnswerResult]
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
    answer: Answer
    question: Question
  }
  input AnswerInput {
    text: String
  }
  input UserAnswerInput {
    answer: String
    question: String
  }

  type Mutation {
    createQuestion(text: String): Question
    createQuestionnaire(name: String): Questionnaire
    addQuestion(question: String, questionnaire: String): Questionnaire
    addAnswer(answer: AnswerInput, question: String): Question
    addUserAnswerResult(questionnaire: String): UserAnswerResult
    addUserAnswer(userAnswerResult: String, userAnswer: UserAnswerInput): UserAnswerResult
  }
`)



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
    createQuestion: async ({text}) => {
      var question = {text: text}
      await Questions.insertOne(question)
      return question
    },
    questionnaires: async () => {
      return await Questionnaires.find({}).toArray()
    },
    questionnaire: async ({ _id }) => {
      return await Questionnaires.findOne(mongo.ObjectId(_id))
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
    }
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
