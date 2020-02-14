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
            category: 'Ensiapu',
            task: []
        })
        const second = new Category({
            category: 'Partiotaidot',
            task: []
        })

        await first.save()
        await second.save()

        const result = await api
            .get('/api/category')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(result.body[0].category).toBe('Ensiapu')
        expect(result.body[1].category).toBe('Partiotaidot')
    })

    test('can be added', async () => {
        await Category.deleteMany({})

        const category = {
            category: 'Kädentaidot',
            task: []
        }

        await api
            .post('/api/category')
            .send(category)
            .expect(200)
            .expect('Content-type', /application\/json/)

        const categories = await Category.find({})

        expect(categories[0].category).toBe('Kädentaidot')
    })
})

afterAll(() => {
    mongoose.connection.close()
})