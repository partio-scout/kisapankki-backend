const taskRouter = require('express').Router()
const Task = require('../models/task')

taskRouter.get('/', async (req, res, next) => {
    try {
        const tasks = await Task.find({})
        res.json(tasks.map((task) => task.toJSON()))
    } catch (exception) {
        next(exception)
    }
})

taskRouter.post('/', async (req, res, next) => {
    const body = req.body
    const task = new Task({
        name: body.name,
        assignmentText: body.assignmentText,
        supervisorInstructions: body.supervisorInstructions,
        gradingScale: body.gradingScale,
        creatorName: body.creatorName,
        creatorEmail: body.creatorEmail,
        pending: true,
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