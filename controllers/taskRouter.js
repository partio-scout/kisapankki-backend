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
    let pen = true
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
        pen = false
    }
    try {
        let cat = null
        let lang = null
        let rule = null
        let ageG = null

        if (body.category !== '') {
            const foundCategory = await Category.findById(body.category)
            cat = foundCategory.id
        }
        if (body.language !== '') {
            const foundLanguage = await Language.findById(body.language)
            lang = foundLanguage.id
        }
        if (body.rule !== '') {
            const foundRule = await Rule.findById(body.rule)
            rule = foundRule.id
        }
        if (body.ageGroup !== '') {
            const foundAgeGroup = await AgeGroup.findById(body.ageGroup)
            ageG = foundAgeGroup.id
        }

        const task = new Task({
            name: body.name,
            assignmentText: body.assignmentText,
            supervisorInstructions: body.supervisorInstructions,
            gradingScale: body.gradingScale,
            creatorName: body.creatorName,
            creatorEmail: body.creatorEmail,
            pending: pen,
            ageGroup: ageG,
            category: cat,
            language: lang,
            rules: rule
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