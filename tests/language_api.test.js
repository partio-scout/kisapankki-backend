const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Language = require('../models/language')
const User = require('../models/user')

const api = supertest(app)

describe('Languages', () => {
  let token = null

  beforeAll(async () => {
    const newAdmin = {
      name: 'testAdminN',
      username: 'testAdminUN',
      email: 'testEmailN',
      allowNotifications: true,
      password: 'testAdminPW',
      adminKey: process.env.ADMIN_KEY,
    }
    await api
      .post('/api/user/adminkey')
      .send(newAdmin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const loggedInAdmin = await api
      .post('/api/login')
      .send(newAdmin)
      .expect(200)
    token = loggedInAdmin.body.token
  })

  beforeEach(async () => {
    await Language.deleteMany({})
  })

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
    await api
      .post('/api/language')
      .send({ language: 'Siansaksa' })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)

    const languages = await Language.find({})

    expect(languages[0].name).toBe('Siansaksa')
  })

  test('can be deleted', async () => {
    await api
      .post('/api/language')
      .send({ language: 'Saksa' })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)
    const languages = await Language.find({})
    expect(languages[0].name).toBe('Saksa')
    expect(languages.length).toBe(1)

    await api
      .delete(`/api/language/${languages[0].id}`)
      .set('authorization', `bearer ${token}`)
      .expect(204)

    const languagesAD = await Language.find({})
    expect(languagesAD.length).toBe(0)
  })

  test('can be modified', async () => {
    await api
      .post('/api/language')
      .send({ language: 'Espanja' })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)
    const languages = await Language.find({})
    expect(languages[0].name).toBe('Espanja')

    await api
      .put(`/api/language/${languages[0].id}`)
      .send({ name: 'Ranska' })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)
    const languagesAM = await Language.find({})
    expect(languagesAM[0].name).toBe('Ranska')
    expect(languagesAM.length).toBe(1)
    
  })
})

afterAll(async () => {
  await User.deleteMany({})
  mongoose.connection.close()
})
