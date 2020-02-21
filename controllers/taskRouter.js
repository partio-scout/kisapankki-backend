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
    const tasks = await Task.find({ pending: false })
      .populate('ageGroup', 'name maxAge minAge color')
      .populate('category', 'category')
      .populate('language', 'language')
      .populate('rules', 'rules')
      .exec()
    res.json(tasks.map((task) => task.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

taskRouter.get('/pending', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const pendingTasks = await Task.find({ pending: true })
          .populate('ageGroup', 'name maxAge minAge color')
          .populate('category', 'category')
          .populate('language', 'language')
          .populate('rules', 'rules')
          .exec()
        res.json(pendingTasks.map((task) => task.toJSON()))
      } catch (exception) {
        next(exception)
      }
    } else {
      res.status(401).end()
    }
  } else {
    res.status(401).end()
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
      cat = foundCategory
    }
    if (body.language !== '') {
      const foundLanguage = await Language.findById(body.language)
      lang = foundLanguage
    }
    if (body.rule !== '') {
      const foundRule = await Rule.findById(body.rule)
      rule = foundRule
    }
    if (body.ageGroup !== '') {
      const foundAgeGroup = await AgeGroup.findById(body.ageGroup)
      ageG = foundAgeGroup
    }

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
    updatePointerList(savedTask.id, cat)
    updatePointerList(savedTask.id, lang)
    updatePointerList(savedTask.id, rule)
    updatePointerList(savedTask.id, ageG)

    res.json(savedTask.toJSON())
  } catch (exception) {
    next(exception)
  }
})

taskRouter.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('ageGroup', 'name maxAge minAge color')
      .populate('category', 'category')
      .populate('language', 'language')
      .populate('rules', 'rules')
      .exec()
    if (task) {
      res.json(task.toJSON())
    } else {
      res.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

taskRouter.put('/:id', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {

      const id = req.params.id
      const body = req.body
      try {
        const task = await Task.findById(id)
        task.name = body.name
        task.assignmentText = body.assignmentText
        task.supervisorInstructions = body.supervisorInstructions
        task.gradingScale = body.gradingScale
        task.creatorName = body.creatorName
        task.creatorEmail = body.creatorEmail
        if (task.ageGroup != body.ageGroup) {
          currentAG = await AgeGroup.findById(task.ageGroup)
          newAG = await AgeGroup.findById(body.ageGroup)
          updatePointerList(task.id, newAG)
          removoFromPointerList(task.id, currentAG)
          task.ageGroup = body.ageGroup
        }
        if (task.category != body.category) {
          currentCat = await Category.findById(task.category)
          newCat = await Category.findById(body.category)
          updatePointerList(task.id, newCat)
          removoFromPointerList(task.id, currentCat)
          task.category = body.category
        }
        if (task.rules != body.rule) {
          currentRule = await Rule.findById(task.rules)
          newRule = await Rule.findById(body.rule)
          updatePointerList(task.id, newRule)
          removoFromPointerList(task.id, currentRule)
          task.rules = body.rule
        }
        if (task.language != body.language) {
          currentLang = await Language.findById(task.language)
          newLang = await Language.findById(body.language)
          updatePointerList(task.id, newLang)
          removoFromPointerList(task.id, currentLang)
          task.language = body.language
        }

        const updTask = await task.save()
        res.json(updTask.toJSON())
      } catch (exception) {
        next(exception)
      }
    } else {
      res.status(401).end()
    }
  } else {
    res.status(401).end()
  }
})

taskRouter.delete('/:id', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const task = await Task.findById(req.params.id)
        if (task) {
          const ageG = await AgeGroup.findById(task.ageGroup)
          const cat = await Category.findById(task.category)
          const rules = await Rule.findById(task.rules)
          const lang = await Language.findById(task.language)
          removoFromPointerList(task.id, ageG)
          removoFromPointerList(task.id, cat)
          removoFromPointerList(task.id, rules)
          removoFromPointerList(task.id, lang)
          await Task.findByIdAndRemove(req.params.id)
          res.status(204).end()
        } else {
          res.status(404).end()
        }
      } catch (exception) {
        next(exception)
      }
    } else {
      res.status(401).end()
    }
  } else {
    res.status(401).end()
  }
})

taskRouter.put('/:id/accept', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const task = await Task.findById(req.params.id)
        task.pending = false
        const updTask = await task.save()
        res.json(updTask.toJSON())
      } catch (exception) {
        next(exception)
      }
    } else {
      res.status(401).end()
    }
  } else {
    res.status(401).end()
  }
})

taskRouter.post('/search', async (req, res, next) => {
  const search = req.body.search
  try {
    const searchResult = await Task.find({ "name": { $regex: search, $options: 'i' } })
    res.json(searchResult.map(result => result.toJSON()))
  } catch (exception) {
    next(exception)
  }



})

module.exports = taskRouter