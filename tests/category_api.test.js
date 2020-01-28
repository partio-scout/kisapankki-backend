const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Category = require('../models/category')
const api = supertest(app)

beforeEach(async () => {
    await Category.deleteMany({})
})

describe('Categories', () => {
    test('can be added and fetched', async () => {
        const first = new Category({
            name: 'Ensiapu',
            task: null
        })
        const second = new Category({
            name: 'Partiotaidot',
            task: null
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
})

afterAll(() => {
    mongoose.connection.close()
})