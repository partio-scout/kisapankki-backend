const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Rule = require('../models/rule')
const User = require('../models/user')
const Category = require('../models/category')

const api = supertest(app)

describe('Rules', () => {

  let token = null

  beforeAll(async () => {
    const newAdmin = {
      name: 'testAdminN',
      username: 'testAdminUN',
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
    await Category.deleteMany({})
    await Rule.deleteMany({})
  })

  test('can be fetched', async () => {
    const ruleOne = new Rule({
      name: 'jokamies',
      task: [],
      acceptedCategories: []
    })

    const ruleTwo = new Rule({
      name: 'SM-kisat',
      task: [],
      acceptedCategories: []
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
    const newCat = new Category({
      name: 'initial category',
      task: []
    })

    const savedCat = await newCat.save()

    await api
      .post('/api/rule')
      .send({ rules: 'Viralliset', acceptedCategories: [ savedCat.id ] })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)

    const rules = await Rule.find({})

    expect(rules[0].name).toBe('Viralliset')
    expect(rules[0].acceptedCategories.length).toBe(1)
  })

  test('can be deleted', async () => {
    await api
      .post('/api/rule')
      .send({ rules: 'Modernit', acceptedCategories: [] })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)

    const rules = await Rule.find({})
    expect(rules[0].name).toBe('Modernit')
    expect(rules.length).toBe(1)

    await api
      .delete(`/api/rule/${rules[0].id}`)
      .set('authorization', `bearer ${token}`)
      .expect(204)

    const rulesAD = await Rule.find({})
    expect(rulesAD.length).toBe(0)
  })

  test('can be modified', async () => {
    const newCat1 = new Category({
      name: 'first new category',
      task: []
    })

    const savedCat1 = await newCat1.save()

    await api
      .post('/api/rule')
      .send({ rules: 'Paikalliset', acceptedCategories: [ savedCat1.id ] })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)
    const rules = await Rule.find({})
    expect(rules[0].name).toBe('Paikalliset')
    expect(rules.length).toBe(1)

    const newCat2 = new Category({
      name: 'second new category',
      task: [],
    })

    const savedCat2 = await newCat2.save()

    await api
      .put(`/api/rule/${rules[0].id}`)
      .send({ name: 'Kansainväliset', acceptedCategories: [ savedCat1.id, savedCat2.id ] })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)
    const rulesAM = await Rule.find({})
    expect(rulesAM[0].name).toBe('Kansainväliset')
    expect(rulesAM.length).toBe(1)
    expect(rulesAM[0].acceptedCategories.length).toBe(2)
  })
})

afterAll(async () => {
  await User.deleteMany({})
  mongoose.connection.close()
})
