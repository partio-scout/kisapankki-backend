const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  let password = 'password'
  saltRounds = 10

  password = await bcrypt.hash(password, saltRounds)
  user = new User({
    name: 'name',
    username: 'username',
    password: password,
  })

  await user.save()
})

describe('Login', () => {
  test('is successful with correct password', async () => {

    const testUser = {
      username: 'username',
      password: 'password'
    }

    await api
      .post('/api/login')
      .send(testUser)
      .expect(200)
  })
})

describe('Login', () => {
  test('is not successful with incorrect password', async () => {

    const testUser = {
      username: 'username',
      password: 'passphrase'
    }

    await api
      .post('/api/login')
      .send(testUser)
      .expect(401)
  })
})

describe('Login', () => {
  test('is not successful with not existing user', async () => {

    const testUser = {
      username: 'userword',
      password: 'passphrase'
    }

    await api
      .post('/api/login')
      .send(testUser)
      .expect(401)
  })
})

afterAll(() => {
  mongoose.connection.close()
})