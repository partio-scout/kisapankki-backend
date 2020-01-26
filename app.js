const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const ageGroupRouter = require('./controllers/ageGroupRouter')
const config = require('./utils/config')
const logger = require('./utils/logger')

mongoose.set('useFindAndModify', false)

const app = express()
logger.info('Connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(()=>{
    logger.info('Connection successful')
  })
  .catch((error)=>{
    logger.error('Error in connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(bodyParser.json())

app.use('/api/ageGroup', ageGroupRouter)

app.get('/', (req,res) =>{
  res.send('<h1>Hello world!</h1>')
})

module.exports = app
