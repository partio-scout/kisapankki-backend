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

    const taskOne = new Task({
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
    const taskTwo = new Task({
      name: 'second test',
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
    await taskOne.save()
    await taskTwo.save()
  })


  beforeEach(async () => {
    await Comment.deleteMany({})
  })

  test('returns only taskrelated comments', async () => {
    const savedTasks = await Task.find({})

    const firstComment = new Comment({
      content: 'sisältö',
      nickname: 'testinimi',
      pending: false,
      task: savedTasks[0].id,
    })
    const secondComment = new Comment({
      content: 'toinen sisältö',
      nickname: 'testinimi',
      pending: false,
      task: savedTasks[1].id,
    })

    await firstComment.save()
    await secondComment.save()

    const result = await api
      .get(`/api/comment/${savedTasks[0].id}`)
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(result.body[0].content).toBe('sisältö')
    expect(result.body[0].pending).toBe(false)

    const result2 = await api
      .get(`/api/comment/${savedTasks[1].id}`)
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(result2.body[0].content).toBe('toinen sisältö')
    expect(result2.body[0].pending).toBe(false)
  })

  test('new comment can be added by admin', async () => {
    const savedTasks = await Task.find({})

    const newComment = {
      content: 'kommentin sisältö',
      nickname: 'testinimi',
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
    expect(result.body[0].nickname).toBe('testinimi')
    expect(result.body[0].content).toBe('kommentin sisältö')
    expect(result.body[0].pending).toBe(false)
  })

  test('new comment can be added without signing in', async () => {
    const savedTasks = await Task.find({})

    const newComment = {
      content: 'kommentin sisältö',
      nickname: 'testinimi',
      task: savedTasks[0].id,
    }
    await api
      .post('/api/comment')
      .send(newComment)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const result = await api
      .get('/api/comment/pending')
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(result.body[0].pending).toBe(true)
    expect(result.body[0].content).toBe('kommentin sisältö')
  })

  test('can be deleted', async () => {
    const savedTasks = await Task.find({})

    const newComment = new Comment({
      content: 'sisältö',
      nickname: 'testinimi',
      pending: true,
      task: savedTasks[0].id,
    })

    const savedComment = await newComment.save()

    const res1 = await api
      .get('/api/comment')
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res1.body[0].content).toBe('sisältö')
    expect(res1.body.length).toBe(1)

    await api
      .delete(`/api/comment/${savedComment.id}`)
      .set('authorization', `bearer ${token}`)
      .expect(204)

    const res2 = await api
      .get('/api/comment')
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res2.body.length).toBe(0)
  })

  test('pending status can be changed from pending to accepted', async () => {
    const savedTasks = await Task.find({})

    const pendingComment = new Comment({
      content: 'pending',
      nickname: 'testinimi',
      pending: true,
      task: savedTasks[0].id,
    })

    const savedComment = await pendingComment.save()

    const pendComment = await api
      .get('/api/comment/pending')
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(pendComment.body[0].pending).toBe(true)
    expect(pendComment.body[0].content).toBe('pending')

    await api
      .put(`/api/comment/${savedComment.id}/accept`)
      .set('authorization', `bearer ${token}`)
      .expect(200)

    const acceptedComment = await api
      .get(`/api/comment/${savedTasks[0].id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(acceptedComment.body[0].pending).toBe(false)
  })

  test('can be searched by pending status', async () => {
    const savedTasks = await Task.find({})

    const firstComment = new Comment({
      content: 'miks aina on pahaa ruokaa',
      nickname: 'testiname',
      pending: false,
      task: savedTasks[0].id,
    })

    const secondComment = new Comment({
      content: 'toinen kommentti',
      nickname: 'testinimi',
      pending: true,
      task: savedTasks[0].id,
    })
    await firstComment.save()
    await secondComment.save()

    const pendingComments = await api
      .get('/api/comment/pending')
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(pendingComments.body.length).toBe(1)
    expect(pendingComments.body[0].content).toBe('toinen kommentti')
  })
})

afterAll(async () => {
  await Task.deleteMany({})
  await User.deleteMany({})
  mongoose.connection.close()
})
