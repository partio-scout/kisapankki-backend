const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Rule = require('../models/rule')

const api = supertest(app)

beforeEach(async () => {
  await Rule.deleteMany({})
})

describe('Rules', () => {
  test('are found', async () => {
    const ruleOne = new Rule({
      rules: 'jokamies',
      task:null,
    })

    const ruleTwo = new Rule({
      rules: 'SM-kisat',
      task:null,
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
})

afterAll(() => {
  mongoose.connection.close()
})