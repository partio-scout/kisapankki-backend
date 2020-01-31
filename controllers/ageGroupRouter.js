const ageGroupRouter = require('express').Router()
const AgeGroup = require('../models/ageGroup')

ageGroupRouter.get('/', async (req, res, next) => {
    try {
        const ageGroups = await AgeGroup.find({})
        .populate('task')
        .exec()
        res.json(ageGroups.map((group) => group.toJSON()))
    } catch (exception) {
        next(exception)
    }
})

ageGroupRouter.post('/', async (req, res, next) => {
    const body = req.body
    const group = new AgeGroup({
        name: body.name,
        maxAge: body.maxAge,
        minAge: body.minAge,
        color: body.color,
        task: null
    })
    try {
        const savedAgeGroup = await group.save()
        res.json(savedAgeGroup.toJSON())
    } catch (exception) {
        next(exception)
    }
})

module.exports = ageGroupRouter