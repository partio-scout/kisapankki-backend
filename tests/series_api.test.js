const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Series = require('../models/series')
const api = supertest(app)

beforeEach(async () => {
    await Series.deleteMany({})
})

describe('Series', () => {
    test('can be fetched', async () => {
        const first = new Series({
            name: 'sudari',
            color: 'keltainen',
            task: []
        })
        const second = new Series({
            name: 'seikkailija',
            color: 'oranssi',
            task: []
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
        await Series.deleteMany({})

        const group = new Series({
            name: 'Sudenpentu',
            color: 'sininen',
            task: []
        })

        await api
            .post('/api/series')
            .send(group)
            .expect(200)
            .expect('Content-type', /application\/json/)

        const series = await Series.find({})

        expect(series[0].name).toBe('Sudenpentu')
        expect(series[0].color).toBe('sininen')

    })
})

afterAll(() => {
    mongoose.connection.close()
})