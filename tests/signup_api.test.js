const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

describe('Users', () => {
  test('are found', async () => {
    const userOne = new User({
      name: 'test1',
      username: 'userOne',
      password: 'testWord'
    })

    const userTwo = new User({
      name: 'test2',
      username: 'userTwo',
      password: 'testWord'
    })

    await userOne.save()
    await userTwo.save()

    const result = await api
      .get('/api/signup')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body[0].username).toBe('userOne')
    expect(result.body[1].username).toBe('userTwo')
  })
})

afterAll(() => {
  mongoose.connection.close()
})