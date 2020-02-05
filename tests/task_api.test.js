const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Task = require('../models/task')
const Category = require('../models/category')
const AgeGroup = require('../models/ageGroup')
const Language = require('../models/language')
const Rule = require('../models/rule')
const api = supertest(app)

beforeEach(async () => {
  await Task.deleteMany({})
  await Category.deleteMany({})
  await AgeGroup.deleteMany({})
  await Language.deleteMany({})
  await Rule.deleteMany({})
})

describe('Tasks', () => {
  test('can be added without pointers to language, age grp, category or rules', async () => {
    const newTask = new Task({
      name: 'test-task',
      assignmentText: 'test that the model works',
      supervisorInstructions: 'check that the tests pass',
      gradingScale: '5 or 0',
      creatorName: 'Test Steve',
      creatorEmail: 'Test.Steve@testing.test',
      pending: true
    })
    await newTask.save()
    const result = await api
      .get('/api/task')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(result.body[0].name).toBe('test-task')
    expect(result.body[0].pending).toBe(true)
  })

  test('can be linked to language, age grp, category and rules', async () => {
    const cat = new Category({
      category: 'testC'
    })
    const rules = new Rule({
      rules: 'testR'
    })
    const lang = new Language({
      language: 'testL'
    })
    const ageG = new AgeGroup({
      name: 'testAG',
      maxAge: 2,
      minAge: 1,
      color: 'testC'
    })

    const savedC = await cat.save()
    const savedR = await rules.save()
    const savedL = await lang.save()
    const savedAG = await ageG.save()

    const newTask = new Task({
      name: 'test',
      assignmentText: 'test the linking/populating of pointers',
      supervisorInstructions: 'check that the tests pass',
      gradingScale: '5 or 0',
      creatorName: 'Test Steve',
      creatorEmail: 'Test.Steve@testing.test',
      pending: true,
      ageGroup: savedAG.id,
      category: savedC.id,
      language: savedL.id,
      rules: savedR.id
    })

    await newTask.save()
    const result = await api
      .get('/api/task')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(result.body[0].name).toBe('test')
    expect(result.body[0].ageGroup.name).toBe('testAG')
    expect(result.body[0].category.category).toBe('testC')
  })

  test('can be added through taskRouter', async () => {
    const cat = new Category({
      category: 'testC'
    })
    const rules = new Rule({
      rules: 'testR'
    })
    const lang = new Language({
      language: 'testL'
    })
    const ageG = new AgeGroup({
      name: 'testAG',
      maxAge: 2,
      minAge: 1,
      color: 'testC'
    })
    const savedC = await cat.save()
    const savedR = await rules.save()
    const savedL = await lang.save()
    const savedAG = await ageG.save()

    newTask = {
      name: 'router test',
      assignmentText: 'test the adding through posting',
      supervisorInstructions: 'check that the tests pass',
      gradingScale: '5 or 0',
      creatorName: 'Test Steve',
      creatorEmail: 'Test.Steve@testing.test',
      ageGroup: savedAG.id,
      category: savedC.id,
      language: savedL.id,
      rule: savedR.id
    }

    await api
      .post('/api/task')
      .send(newTask)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const result = await api
      .get('/api/task')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(result.body[0].name).toBe('router test')
    expect(result.body[0].ageGroup.color).toBe('testC')
  })
})

afterAll(() => {
  mongoose.connection.close()
})

