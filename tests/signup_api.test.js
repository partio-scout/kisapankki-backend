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

  test('Can create a new user with new username', async () => {
    await User.deleteMany({})

    const user = {
      name: 'Testuser',
      username: 'New username',
      password: 'password'
    }

    await api
      .post('/api/signup')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const users = await User.find({})

    expect(users[0].name).toBe('Testuser')
  })

  test('Cannot create new user with taken username', async () => {
    await User.deleteMany({})

    const user = new User({
      name: 'Testuser',
      username: 'New username',
      password: 'password'
    })

    const newUser = {
      name: 'Other user',
      username: 'New username',
      password: 'password'
    }

    await user.save()

    await api
      .post('/api/signup')
      .send(newUser)
      .expect(400)

    const users = await User.find({})

    expect(users.length).toBe(1)

  })

})

afterAll(() => {
  mongoose.connection.close()
})