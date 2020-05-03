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
    questions: [Question]
    userAnswersResults: [UserAnswerResult]
  }
  type Question {
    _id: String
    text: String
    answers: [Answer]
  }
  type Answer {
    _id: String
    question: Question
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

  type Mutation {
    createQuestion(text: String): Question
    createQuestionnaire(name: String): Questionnaire
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
      return await Questionnaires.findOne({code: code})
    },
    questionnaireByLinkUri: async ({ uri }) => {
      return await Questionnaires.findOne({linkUri: uri})
    },
    createQuestionnaire: async ({name}) => {
      var questionnaire = {name: name, code: "1234"}
      await Questionnaires.insertOne(questionnaire)
      return questionnaire
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
