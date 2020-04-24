const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  let password = 'password'
  const saltRounds = 10

  password = await bcrypt.hash(password, saltRounds)
  const user = new User({
    name: 'name',
    username: 'username',
    email: 'email@email.com',
    allowNotifications: true,
    password,
  })

  await user.save()
})

describe('Login', () => {
  test('is successful with correct password', async () => {
    const testUser = {
      username: 'username',
      password: 'password',
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
      password: 'passphrase',
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
      password: 'passphrase',
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
