const categoryRouter = require('express').Router()
const Category = require('../models/category')

categoryRouter.get('/', async (req, res, next) => {
    try {
        const categories = await Category.find({})
        .populate('task')
        .exec()
        res.json(categories.map((category) => category.toJSON()))
    } catch (exception) {
        next(exception)
    }
})

categoryRouter.post('/', async (req, res, next) => {
    const body = req.body
    const category = new Category({
        name: body.name,
        task: null
    })
    try {
        const savedCategory = await category.save()
        res.json(savedCategory.toJSON())
    } catch (exception) {
        next(exception)
    }
})
module.exports = categoryRouter
