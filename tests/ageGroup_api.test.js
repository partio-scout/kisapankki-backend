const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const AgeGroup = require('../models/ageGroup')
const api = supertest(app)

beforeEach(async () => {
    await AgeGroup.deleteMany({})
})

describe('Age groups', () => {
    test('can be fetched', async () => {
        const first = new AgeGroup({
            name: 'sudari',
            maxAge: 10,
            minAge: 7,
            color: 'keltainen',
            task: []
        })
        const second = new AgeGroup({
            name: 'seikkailija',
            maxAge: 13,
            minAge: 10,
            color: 'oranssi',
            task: []
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

    test('can be added', async () => {
        await AgeGroup.deleteMany({})

        const group = new AgeGroup({
            name: 'Sudenpentu',
            maxAge: 15,
            minAge: 10,
            color: 'sininen',
            task: []
        })

        await api
            .post('/api/ageGroup')
            .send(group)
            .expect(200)
            .expect('Content-type', /application\/json/)

        const ageGroups = await AgeGroup.find({})

        expect(ageGroups[0].name).toBe('Sudenpentu')
        expect(ageGroups[0].color).toBe('sininen')

    })
})

afterAll(() => {
    mongoose.connection.close()
})