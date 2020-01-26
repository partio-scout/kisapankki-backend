const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

let user

beforeEach(async () => {
  await User.deleteMany({})
  user = new User({
    name: 'testikäyttäjä',
    username: 'käyttäjänimi',
    password: 'salasana'
  })
  await user.save()
})

describe('Login', () => {
  test('is successful with correct password', async () => {

    const testUser = {
      name: 'testikäyttäjä',
      username: 'käyttäjänimi',
      password: 'salasana'
    }

    const result = await api
      .post('/api/login')
      .send(testUser)
      .expect(200)
  })
})

afterAll(() => {
  mongoose.connection.close()
})