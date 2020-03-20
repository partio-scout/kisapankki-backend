const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Category = require('../models/category')
const User = require('../models/user')

const api = supertest(app)

describe('Categories', () => {
  let token = null

  beforeAll(async () => {
    const newAdmin = {
      name: 'testAdminN',
      username: 'testAdminUN',
      email: 'testEmailN',
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
  })

  test('can be fetched', async () => {
    const first = new Category({
      name: 'Ensiapu',
      task: [],
    })
    const second = new Category({
      name: 'Partiotaidot',
      task: [],
    })

    await first.save()
    await second.save()

    const result = await api
      .get('/api/category')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(result.body[0].name).toBe('Ensiapu')
    expect(result.body[1].name).toBe('Partiotaidot')
  })

  test('can be added', async () => {
    await api
      .post('/api/category')
      .send({ category: 'Kädentaidot' })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)

    const categories = await Category.find({})

    expect(categories[0].name).toBe('Kädentaidot')
  })

  test('can be deleted', async () => {
    await api
      .post('/api/category')
      .send({ category: 'Ensiapu' })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)
    const categories = await Category.find({})
    expect(categories[0].name).toBe('Ensiapu')
    expect(categories.length).toBe(1)

    await api
      .delete(`/api/category/${categories[0].id}`)
      .set('authorization', `bearer ${token}`)
      .expect(204)

    const categoriesAD = await Category.find({})
    expect(categoriesAD.length).toBe(0)
  })

  test('can be modified', async () => {
    await api
      .post('/api/category')
      .send({ category: 'Ensiapu' })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)
    const categories = await Category.find({})
    expect(categories[0].name).toBe('Ensiapu')

    await api
      .put(`/api/category/${categories[0].id}`)
      .send({ name: 'Suunnistus' })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)
    const categoriesAM = await Category.find({})
    expect(categoriesAM[0].name).toBe('Suunnistus')
    expect(categoriesAM.length).toBe(1)
  })
})

afterAll(async () => {
  await User.deleteMany({})
  mongoose.connection.close()
})
