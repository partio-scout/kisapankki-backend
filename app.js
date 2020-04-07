const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const CronJob = require('cron').CronJob

const seriesRouter = require('./controllers/seriesRouter')
const userRouter = require('./controllers/userRouter')
const ruleRouter = require('./controllers/ruleRouter')
const languageRouter = require('./controllers/languageRouter')
const loginRouter = require('./controllers/loginRouter')
const categoryRouter = require('./controllers/categoryRouter')
const taskRouter = require('./controllers/taskRouter')
const fileRouter = require('./controllers/fileRouter')
const commentRouter = require('./controllers/commentRouter')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const app = express()
mongoose.set('useFindAndModify', false)

if (config.APPLICATION_STAGE === 'DEV') {

  logger.info('Connecting to', config.MONGODB_URI)

  mongoose
    .connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(() => {
      logger.info('Connection successful')
    })
    .catch((error) => {
      logger.error('Error in connection to MongoDB:', error.message)
    })
}

if (config.APPLICATION_STAGE === 'PROD') {
  logger.info('Connecting to', config.COSMOS_DB_URI)

  mongoose
    .connect(config.COSMOS_DB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(() => logger.info('Connection to CosmosDB successful'))
    .catch((error) => logger.error('Error in connection to COSMOSDB: ', error.message));
}



app.use(cors())
app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use('/api/user', userRouter)
app.use('/api/rule', ruleRouter)
app.use('/api/language', languageRouter)
app.use('/api/login', loginRouter)
app.use('/api/series', seriesRouter)
app.use('/api/category', categoryRouter)
app.use('/api/task', taskRouter)
app.use('/api/file', fileRouter)
app.use('/api/comment', commentRouter)

app.use(express.static('build'))

app.get('*', (req, res) => {
  res.sendfile('./build/index.html')
})

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>')
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

if (config.NODE_ENV !== 'test') {
  let job = new CronJob('00 */5 * * * *', async (req, res, next) => {
    const time = new Date()
    console.log('Ping! It is', time.toUTCString())
    let http = require('http')
    http.get('http://kisapankki-staging.herokuapp.com')
  }, null, true, 'Europe/Helsinki');
  job.start()
}


module.exports = app
