const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Rule = require('../models/rule')

const api = supertest(app)

beforeEach(async () => {
  await Rule.deleteMany({})
})

describe('Rules', () => {
  test('can be fetched', async () => {
    const ruleOne = new Rule({
      name: 'jokamies',
      task: [],
    })

    const ruleTwo = new Rule({
      name: 'SM-kisat',
      task: [],
    })

    await ruleOne.save()
    await ruleTwo.save()

    const result = await api
      .get('/api/rule')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body[0].name).toBe('jokamies')
    expect(result.body[1].name).toBe('SM-kisat')
  })

  test('can be added', async () => {
    await Rule.deleteMany({})

    await api
      .post('/api/rule')
      .send({ rules: 'Viralliset' })
      .expect(200)
      .expect('Content-type', /application\/json/)

    const rules = await Rule.find({})

    expect(rules[0].name).toBe('Viralliset')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
