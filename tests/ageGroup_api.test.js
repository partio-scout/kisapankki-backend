const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const AgeGroup = require('../models/ageGroup')
const api = supertest(app)

beforeEach(async () => {
    await AgeGroup.deleteMany({})
})

describe('Age groups', () => {
    test('can be added and fetched', async () => {
        const first = new AgeGroup({
            name: 'sudari',
            maxAge: 10,
            minAge: 7,
            color: 'keltainen',
            task: null
        })
        const second = new AgeGroup({
            name: 'seikkailija',
            maxAge: 13,
            minAge: 10,
            color: 'oranssi',
            task: null
        })

        await first.save()
        await second.save()

        const result = await api
        .get('/api/ageGroup')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        expect(result.body[0].name).toBe('sudari')
        expect(result.body[1].color).toBe('oranssi')
    })
})

afterAll(() => {
    mongoose.connection.close()
})