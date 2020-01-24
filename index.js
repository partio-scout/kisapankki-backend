require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Competition = require('./models/competition')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


app.get('/', (req, res) => {
    res.send('<h1>Hello PartioPeople!</h1>')
  })

app.get('/api/competitions', (request, response) => {
  Competition.find({}).then(competitions => {
    response.json(competitions)
  })
})

app.post('/api/competitions', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const competition = new Competition({
    content: body.content,
  })

  competition.save().then(savedNote => {
    response.json(savedNote.toJSON())
  })
})