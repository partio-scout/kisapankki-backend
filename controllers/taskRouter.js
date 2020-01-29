const taskRouter = require('express').Router()
const Task = require('../models/task')
const jwt = require('jsonwebtoken')

const getTokenFrom = (req) => {
    const auth = req.get('authorization')
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
        return auth.substring(7)
    }
    return null
}

taskRouter.get('/', async (req, res, next) => {
    try {
        const tasks = await Task.find({})
        .populate('ageGroup')
        .populate('category')
        .populate('language')
        .populate('rules')
        .exec()
        res.json(tasks.map((task) => task.toJSON()))
    } catch (exception) {
        next(exception)
    }
})

taskRouter.post('/', async (req, res, next) => {
    const body = req.body
    const pen = true
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
        pen = false
    }
    const task = new Task({
        name: body.name,
        assignmentText: body.assignmentText,
        supervisorInstructions: body.supervisorInstructions,
        gradingScale: body.gradingScale,
        creatorName: body.creatorName,
        creatorEmail: body.creatorEmail,
        pending: pen,
        ageGroup: body.ageGroup,
        category: body.category,
        language: body.language,
        rules: body.rules
    })
    try {
        const savedTask = await task.save()
        res.json(savedTask.toJSON())
    } catch (exception) {
        next(exception)
    }
})

module.exports = taskRouter