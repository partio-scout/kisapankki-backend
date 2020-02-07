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
      rules: 'jokamies',
      task: [],
    })

    const ruleTwo = new Rule({
      rules: 'SM-kisat',
      task: [],
    })

    await ruleOne.save()
    await ruleTwo.save()

    const result = await api
      .get('/api/rule')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body[0].rules).toBe('jokamies')
    expect(result.body[1].rules).toBe('SM-kisat')
  })

  test('can be added', async () => {
    await Rule.deleteMany({})

    const rule = {
      rules: 'Viralliset',
      task: []
    }

    await api
      .post('/api/rule')
      .send(rule)
      .expect(200)
      .expect('Content-type', /application\/json/)

    const rules = await Rule.find({})

    expect(rules[0].rules).toBe('Viralliset')
  })
})

afterAll(() => {
  mongoose.connection.close()
})