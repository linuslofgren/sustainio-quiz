var mongo = require('mongodb')
var express = require('express')
var cors = require('cors')
var graphqlHTTP = require('express-graphql')
var { buildSchema } = require('graphql')
var fs = require('fs')
var path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcrypt')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const bodyParser = require('body-parser');

var schemaStr = fs.readFileSync('schema.graphql', 'utf8')

var schema = buildSchema(schemaStr)

const root = require('./graphRoot.js')

// Answer count:
// db.questionnaires.aggregate({$unwind: "$responses"}, {$unwind: "$responses.answers"}, {$group: {_id: "$responses.answers.answer", count: {$sum: 1}}}).pretty()

const buildPath = process.env.BUILD_PATH || '../client/build'
const dbPath = process.env.DB_PATH || "mongodb://mongo-db:27017"

const start = async () => {

  var url = dbPath
  var dbname = "test"

  const mongodb = await mongo.MongoClient.connect(url, { useUnifiedTopology: true })

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    done(null, {username: "a", id: "abc"})
  })

  passport.use(new LocalStrategy((user, pass, done) => {
    console.log('AUTH')
    console.log(user, pass)
    if(user === "admin" && pass === process.env.DEFAULT_PASS) {
      return done(null, {username: 'a', id: "abc"})
    } else {
      return done(null, false, {message: 'Bad auth'})
    }
  }))

  var app = express()
  app.use(cors())
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())

  app.use(session({
    secret: 'sustainio-secret-one',
    store: new MongoStore({client: mongodb, dbName: dbname})
  }))

  const protect = (req, res, next)=>{
    console.log(req.user)
    if (req.isAuthenticated()) { return next() }
    res.redirect('/login')
  }

  app.use(passport.initialize())
  app.use(passport.session())
  app.use((req, res, next)=>{next()})
  app.use('/graphql', protect, graphqlHTTP({
    schema: schema,
    rootValue: root(mongodb.db(dbname)),
    graphiql: true
  }))

  app.use(express.static(buildPath))

  app.use('/admin', protect)

  app.post('/login', passport.authenticate('local', {successRedirect: '/admin', failureRedirect: '/login?fail'}))
  app.get('/logout', (req, res) => {req.logout(); res.redirect('/')})
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(buildPath + '/index.html'))
  })

  app.listen(4000, () => {
    console.log("Running on port 4000")
  })

}

start()
