const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Series = require('../models/series')
const User = require('../models/user')
const Task = require('../models/task')

const api = supertest(app)

describe('Series', () => {

  let token = null

  beforeAll(async () => {
    await Task.deleteMany({})
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
    await Series.deleteMany({})
  })

  test('can be fetched', async () => {
    const first = new Series({
      name: 'sudari',
      color: 'keltainen',
      task: [],
    })
    const second = new Series({
      name: 'seikkailija',
      color: 'oranssi',
      task: [],
    })

    await first.save()
    await second.save()

    const result = await api
      .get('/api/series')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(result.body[0].name).toBe('sudari')
    expect(result.body[1].color).toBe('oranssi')
  })

  test('can be added', async () => {
    const group = new Series({
      name: 'Sudenpentu',
      color: 'sininen',
      task: [],
    })

    await api
      .post('/api/series')
      .send(group)
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)

    const series = await Series.find({})

    expect(series[0].name).toBe('Sudenpentu')
    expect(series[0].color).toBe('sininen')
  })

  test('can be deleted', async () => {
    await api
      .post('/api/series')
      .send({ name: 'Siniset', color: 'RED' })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)
    const seriess = await Series.find({})
    expect(seriess[0].name).toBe('Siniset')
    expect(seriess.length).toBe(1)

    const newTask = new Task({
      name: 'series delete test',
      assignmentText: 'test the deletion of pointer from task',
      supervisorInstructions: 'check that the tests pass',
      gradingScale: '5 or 0',
      assignmentTextMD: 'test the deletion of pointer from task',
      supervisorInstructionsMD: 'check that the tests pass',
      gradingScaleMD: '5 or 0',
      creatorName: 'Test Steve',
      creatorEmail: 'Test.Steve@testing.test',
      series: [seriess[0].id],
      category: '5e6929121d689649d5d229ce',
      language: '5e6929121d689649d5d229cf',
      rule: '5e6929121d689649d5d229cg',
      pending: false,
    })

    await newTask.save()
    const tasks = await Task.find({})
    expect(tasks[0].series.length).toBe(1)
    expect(tasks.length).toBe(1)
    const seriesWithTaskPointer = await Series.findById(seriess[0].id)
    seriesWithTaskPointer.task = [tasks[0].id]
    await seriesWithTaskPointer.save()

    await api
      .delete(`/api/series/${seriess[0].id}`)
      .set('authorization', `bearer ${token}`)
      .expect(204)

    const seriessAD = await Series.find({})
    expect(seriessAD.length).toBe(0)
    const tasksAD = await Task.find({})
    expect(tasksAD[0].series.length).toBe(0)
  })

  test('can be modified', async () => {
    await api
      .post('/api/series')
      .send({ name: 'Siniset', color: 'RED' })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)
    const seriess = await Series.find({})
    expect(seriess[0].name).toBe('Siniset')

    await api
      .put(`/api/series/${seriess[0].id}`)
      .send({ name: 'Punainen', color: 'BLUE' })
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-type', /application\/json/)
    const seriesAM = await Series.find({})
    expect(seriesAM[0].name).toBe('Punainen')
    expect(seriesAM[0].color).toBe('BLUE')
  })
})

afterAll(async () => {
  await User.deleteMany({})
  mongoose.connection.close()
})
