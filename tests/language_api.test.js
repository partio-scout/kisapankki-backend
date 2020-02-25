const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Language = require('../models/language')

const api = supertest(app)

beforeEach(async () => {
  await Language.deleteMany({})
})

describe('Languages', () => {
  test('can be fetched', async () => {
    const finnish = new Language({
      name: 'Suomi',
      task: [],
    })

    const swedish = new Language({
      name: 'Svenska',
      task: [],
    })

    await finnish.save()
    await swedish.save()

    const result = await api
      .get('/api/language')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body[0].name).toBe('Suomi')
    expect(result.body[1].name).toBe('Svenska')
  })

  test('can be added', async () => {
    await Language.deleteMany({})

    await api
      .post('/api/language')
      .send({ language: 'Siansaksa' })
      .expect(200)
      .expect('Content-type', /application\/json/)

    const languages = await Language.find({})

    expect(languages[0].name).toBe('Siansaksa')
  })
})

afterAll(() => {
  mongoose.connection.close()
})