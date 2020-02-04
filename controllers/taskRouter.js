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

const updatePointerList = async (taskId, target) => {
  if (target) {
    target.task = target.task.concat(taskId)
    await target.save()
  }
}

const removoFromPointerList = async (taskId, target) => {
  if (target) {
    target.task = target.task.filter((id) => id != taskId)
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

taskRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id
  try {
    const task = await Task.findById(id)
    .populate('ageGroup')
    .populate('category')
    .populate('language')
    .populate('rules')
    .exec()
    res.json(task.toJSON())
  } catch (exception) {
    next(exception)
  }
})

taskRouter.post('/:id', async (req, res, next) => {
  const id = req.params.id
  const body = req.body
  try {
    const task = await Task.findById(id)
    task.name = body.name
    task.assignmentText = body.assignmentText
    task.supervisorInstructions = body.supervisorInstructions
    task.gradingScale = body.gradingScale
    if (task.ageGroup != body.ageGroup) {
      currentAG = await AgeGroup.findById(task.ageGroup)
      newAG = await AgeGroup.findById(body.ageGroup)
      updatePointerList(task.id, newAG)
      removoFromPointerList(task.id, currentAG)
    }
    if (task.category != body.category) {
      currentCat = await Category.findById(task.category)
      newCat = await Category.findById(body.category)
      updatePointerList(task.id, newCat)
      removoFromPointerList(task.id, currentCat)
    }
    if (task.rules != body.rules) {
      currentRule = await Rule.findById(task.rules)
      newRule = await Rule.findById(body.rules)
      updatePointerList(task.id, newRule)
      removoFromPointerList(task.id, currentRule)
    }
    if (task.language != body.language) {
      currentLang = await Language.findById(task.language)
      newLang = await Language.findById(body.language)
      updatePointerList(task.id, newLang)
      removoFromPointerList(task.id, currentLang)
    }

    const updTask = await task.save()
    res.json(updTask.toJSON())
  } catch (exception) {
    next(exception)
  }
})

taskRouter.post('/', async (req, res, next) => {
  const body = req.body
  let pen = true
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      pen = false
    }
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
    updatePointerList(savedTask.id, cat)
    updatePointerList(savedTask.id, lang)
    updatePointerList(savedTask.id, rule)
    updatePointerList(savedTask.id, ageG)

    res.json(savedTask.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = taskRouter