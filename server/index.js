var mongo = require('mongodb')
var express = require('express')
var cors = require('cors')
var graphqlHTTP = require('express-graphql')
var { buildSchema } = require('graphql')
var fs = require('fs')
var path = require('path')

var schemaStr = fs.readFileSync('schema.graphql', 'utf8')

var schema = buildSchema(schemaStr)

const root = require('./graphRoot.js')

// Answer count:
// db.questionnaires.aggregate({$unwind: "$responses"}, {$unwind: "$responses.answers"}, {$group: {_id: "$responses.answers.answer", count: {$sum: 1}}}).pretty()

const buildPath = process.env.BUILD_PATH || '../client/build'

const start = async () => {

  var url = "mongodb://host.docker.internal:27017"
  var dbname = "test"

  const mongodb = await mongo.MongoClient.connect(url, { useUnifiedTopology: true })

  var app = express()
  app.use(cors())
  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root(mongodb.db(dbname)),
    graphiql: true
  }))

  app.use(express.static(buildPath))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(buildPath + '/index.html'))
  })

  app.listen(4000, () => {
    console.log("Running on port 4000")
  })

}

start()
