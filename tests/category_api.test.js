const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Category = require('../models/category')
const api = supertest(app)

beforeEach(async () => {
    await Category.deleteMany({})
})

describe('Categories', () => {
    test('can be fetched', async () => {
        const first = new Category({
            name: 'Ensiapu',
            task: []
        })
        const second = new Category({
            name: 'Partiotaidot',
            task: []
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
        await Category.deleteMany({})

        await api
            .post('/api/category')
            .send({ category: 'Kädentaidot' })
            .expect(200)
            .expect('Content-type', /application\/json/)

        const categories = await Category.find({})

        expect(categories[0].name).toBe('Kädentaidot')
    })
})

afterAll(() => {
    mongoose.connection.close()
})