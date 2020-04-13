const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

let token = null

beforeAll(async () => {
  await User.deleteMany({})

  const saltRounds = 10
  password = await bcrypt.hash('testWord', saltRounds)

  const userOne = new User({
    name: 'test1',
    username: 'userOne',
    email: 'test@email.com',
    allowNotifications: true,
    password,
  })

  const userTwo = new User({
    name: 'test2',
    username: 'userTwo',
    email: 'test@email2.com',
    password,
    allowNotifications: true,
  })

  await userOne.save()
  await userTwo.save()

  const loggedInUser = await api
    .post('/api/login')
    .send({ username: 'userOne', password: 'testWord' })
    .expect(200)

  token = loggedInUser.body.token
})

describe('Users', () => {
  test('are found', async () => {
    const result = await api
      .get('/api/user')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body[0].username).toBe('userOne')
    expect(result.body[1].username).toBe('userTwo')
  })
})

describe('User', () => {
  test('is added', async () => {
    const result = await api
      .post('/api/user')
      .send({
        name: 'test3', username: 'userThree', email: 'test@email3.com', password: 'testWord', allowNotifications: true,
      })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.username).toBe('userThree')
    expect(result.body.allowNotifications).toBe(true)
  })

  test('email is added', async () => {
    const result = await api
      .post('/api/user')
      .send({
        name: 'test4', username: 'userFour', email: 'email@email4.com', password: 'testWord', allowNotifications: true,
      })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.email).toBe('email@email4.com')
  })

  test('is not added if username already exists', async () => {
    await api
      .post('/api/user')
      .send({ username: 'userTwo' })
      .set('authorization', `bearer ${token}`)
      .expect(400)
  })

  test('is edited', async () => {
    const result = await api
      .put('/api/user')
      .send({
        name: 'editedName', username: 'editedUsername', email: 'editedEmail', password: 'newPassword', allowNotifications: false,
      })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.name).toBe('editedName')
    expect(result.body.username).toBe('editedUsername')
    expect(result.body.allowNotifications).toBe(false)
  })

  test('is not edited if username already exists', async () => {
    await api
      .put('/api/user')
      .send({ username: 'userTwo' })
      .set('authorization', `bearer ${token}`)
      .expect(400)
  })
})

afterAll(async () => {
  mongoose.connection.close()
})
