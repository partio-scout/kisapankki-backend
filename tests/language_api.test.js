const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Language = require('../models/language')

const api = supertest(app)

beforeEach(async () => {
  await Language.deleteMany({})
})

describe('Languages', () => {
  test('are found', async () => {
    const finnish = new Language({
      language: 'Suomi',
      task: null,
    })

    const swedish = new Language({
      language: 'Svenska',
      task: null,
    })

    await finnish.save()
    await swedish.save()

    const result = await api
      .get('/api/language')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body[0].language).toBe('Suomi')
    expect(result.body[1].language).toBe('Svenska')
  })
})

afterAll(() => {
  mongoose.connection.close()
})