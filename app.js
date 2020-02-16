const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const ageGroupRouter = require('./controllers/ageGroupRouter')
const userRouter = require('./controllers/userRouter')
const ruleRouter = require('./controllers/ruleRouter')
const languageRouter = require('./controllers/languageRouter')
const loginRouter = require('./controllers/loginRouter')
const categoryRouter = require('./controllers/categoryRouter')
const taskRouter = require('./controllers/taskRouter')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

mongoose.set('useFindAndModify', false)

const app = express()
logger.info('Connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    logger.info('Connection successful')
  })
  .catch((error) => {
    logger.error('Error in connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use('/api/user', userRouter)
app.use('/api/rule', ruleRouter)
app.use('/api/language', languageRouter)
app.use('/api/login', loginRouter)
app.use('/api/ageGroup', ageGroupRouter)
app.use('/api/category', categoryRouter)
app.use('/api/task', taskRouter)

app.use(express.static('build'))

app.get('*', (req, res) => {
  res.sendfile('./build/index.html');
})

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>')
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
