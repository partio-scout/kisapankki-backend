// const supertest = require('supertest')
// const mongoose = require('mongoose')
// const app = require('../app')
// const Task = require('../models/task')
// const Category = require('../models/category')
// const Series = require('../models/series')
// const Language = require('../models/language')
// const Rule = require('../models/rule')
// const User = require('..models/user')


// const api = supertest(app)

// describe('Comment', () => {
//   let token = null

//   beforeAll(async () => {
//     const newAdmin = {
//       name: 'testAdminN',
//       username: 'testAdminUN',
//       email: 'testEmailN',
//       allowNotifications: true,
//       password: 'testAdminPW',
//       adminKey: process.env.ADMIN_KEY,
//     }
//     await api
//       .post('/api/user/adminkey')
//       .send(newAdmin)
//       .expect(200)
//       .expect('Content-Type', /application\/json/)

//     const loggedInAdmin = await api
//       .post('/api/login')
//       .send(newAdmin)
//       .expect(200)
//     token = loggedInAdmin.body.token
//   })


// test('new comment can be added', async () => {
//   const cat = new Category({
//     name: 'testC',
//   })
//   const rules = new Rule({
//     name: 'testR',
//   })
//   const lang = new Language({
//     name: 'testL',
//   })
//   const series = new Series({
//     name: 'testS',
//     color: 'testColor',
//   })

//   const savedC = await cat.save()
//   const savedR = await rules.save()
//   const savedL = await lang.save()
//   const savedS = await series.save()

//   const task = new Task({
//     name: 'comment test',
//     assignmentText: 'testTask fot comment',
//     assignmentTextMD: 'test',
//     supervisorInstructions: 'testInstructions',
//     supervisorInstructionsMD: 'check',
//     gradingScale: '5 or 0',
//     gradingScaleMD: '5 or 0',
//     creatorName: 'Test Co',
//     creatorEmail: 'Test.comment@comment',
//     series: [savedS.id],
//     category: savedC.id,
//     language: savedL.id,
//     rule: savedR.id,
//     files: [],
//     views: 4,
//   })


//   const savedT = await task.save()


//   newComment = {
//     nickname: 'testiname',
//     content: 'miks aina on pahaa ruokaa',
//     pending: true,
//     task: [savedT.id],
//   }

//   await api
//     .post('/api/comment')
//     .send(newComment)
//     .set('authorization', `bearer ${token}`)
//     .expect(200)
//     .expect('Content-Type', /application\/json/)

//   const result = await api
//     .get('/api/comment')
//     .set('authorization', `bearer ${token}`)
//     .expect(200)
//     .expect('Content-Type', /application\/json/)
//   expect(result.body[0].name).toBe('router test')
//   expect(result.body[0].series[0].color).toBe('testColor')
//   expect(result.body[0].assignmentTextMD).toBe('test the adding through posting in Markdown')
//   expect(result.body[0].ratingsAVG).toBe(0)
//   expect(result.body[0].ratings.length).toBe(5)
// })

// afterAll(async () => {
//   mongoose.connection.close()
// })
