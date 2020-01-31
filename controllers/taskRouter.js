const taskRouter = require('express').Router()
const Task = require('../models/task')
const Category = require('../models/category')
const Language = require('../models/language')
const AgeGroup = require('../models/ageGroup')
const Rule = require('../models/rule')
const jwt = require('jsonwebtoken')

const getTokenFrom = (req) => {
    const auth = req.get('authorization')
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
        return auth.substring(7)
    }
    return null
}

const updateAndSave = async (taskId, target) => {
    if (target) {
        target.task = target.task.concat(taskId)
        await target.save()
    }
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
    try {
        const cat = await Category.findById(body.category)
        const lang = await Language.findById(body.language)
        const rule = await Rule.findById(body.rules)
        const ageG = await AgeGroup.findById(body.ageGroup)
        const task = new Task({
            name: body.name,
            assignmentText: body.assignmentText,
            supervisorInstructions: body.supervisorInstructions,
            gradingScale: body.gradingScale,
            creatorName: body.creatorName,
            creatorEmail: body.creatorEmail,
            pending: pen,
            ageGroup: ageG.id,
            category: cat.id,
            language: lang.id,
            rules: rule.id
        })
    
        const savedTask = await task.save()
        updateAndSave(savedTask.id, cat)
        updateAndSave(savedTask.id, lang)
        updateAndSave(savedTask.id, rule)
        updateAndSave(savedTask.id, ageG)

        res.json(savedTask.toJSON())
    } catch (exception) {
        next(exception)
    }
})

module.exports = taskRouter