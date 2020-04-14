const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Task = require('../models/task')
const User = require('../models/user')
const Comment = require('../models/comment')


const api = supertest(app)

describe('Comment', () => {
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

    const task = new Task({
      name: 'comment test',
      assignmentText: 'testTask for comment',
      assignmentTextMD: 'test',
      supervisorInstructions: 'testInstructions',
      supervisorInstructionsMD: 'check',
      gradingScale: '5 or 0',
      gradingScaleMD: '5 or 0',
      creatorName: 'Test Co',
      creatorEmail: 'Test.comment@comment',
      series: null,
      category: null,
      language: null,
      rule: null,
      files: [],
      views: 4,
      pending: false,
    })
    await task.save()
  })

  beforeEach(async () => {
    await Comment.deleteMany({})
  })


  test('new comment can be added', async () => {
    const savedTasks = await Task.find({})

    newComment = {
      content: 'miks aina on pahaa ruokaa',
      nickname: 'testiname',
      task: savedTasks[0].id,
    }
    await api
      .post('/api/comment')
      .send(newComment)
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const result = await api
      .get(`/api/comment/${savedTasks[0].id}`)
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(result.body[0].nickname).toBe('testiname')
    expect(result.body[0].content).toBe('miks aina on pahaa ruokaa')
    expect(result.body[0].pending).toBe(false)
  })

})

afterAll(async () => {
  await Task.deleteMany({})
  await User.deleteMany({})
  mongoose.connection.close()
})
