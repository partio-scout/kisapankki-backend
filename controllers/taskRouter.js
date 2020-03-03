const taskRouter = require('express').Router()
const Task = require('../models/task')
const Category = require('../models/category')
const Language = require('../models/language')
const Series = require('../models/series')
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

const removeFromPointerList = async (taskId, target) => {
  if (target) {
    target.task = target.task.filter((id) => id != taskId)
    await target.save()
  }
}

taskRouter.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find({ pending: false })
      .populate('series', 'name color')
      .populate('category', 'name')
      .populate('language', 'name')
      .populate('rules', 'name')
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
          .populate('series', 'name color')
          .populate('category', 'name')
          .populate('language', 'name')
          .populate('rules', 'name')
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
    let series = null

    if (body.category !== '') {
      const foundCategory = await Category.findById(body.category)
      if (foundCategory) {
        cat = foundCategory
      }
    }
    if (body.language !== '') {
      const foundLanguage = await Language.findById(body.language)
      if (foundLanguage) {
        lang = foundLanguage
      }
    }
    if (body.rule !== '') {
      const foundRule = await Rule.findById(body.rule)
      if (foundRule) {
        rule = foundRule
      }
    }
    if (body.series !== []) {
      const foundSeries = await Series.find({ _id: { $in: body.series } })
      if (foundSeries) {
        series = foundSeries
      }
    }

    const task = new Task({
      name: body.name,
      assignmentText: body.assignmentText,
      assignmentTextMD: body.assignmentTextMD,
      supervisorInstructions: body.supervisorInstructions,
      supervisorInstructionsMD: body.supervisorInstructionsMD,
      gradingScale: body.gradingScale,
      gradingScaleMD: body.gradingScaleMD,
      creatorName: body.creatorName,
      creatorEmail: body.creatorEmail,
      pending: pen,
      series: series.map(s => s.id),
      category: cat.id,
      language: lang.id,
      rules: rule.id
    })

    const savedTask = await task.save()
    updatePointerList(savedTask.id, cat)
    updatePointerList(savedTask.id, lang)
    updatePointerList(savedTask.id, rule)
    series.forEach(function (s) {
      updatePointerList(savedTask.id, s)
    })

    res.json(savedTask.toJSON())
  } catch (exception) {
    next(exception)
  }
})

taskRouter.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('series', 'name color')
      .populate('category', 'name')
      .populate('language', 'name')
      .populate('rules', 'name')
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

taskRouter.post('/search', async (req, res, next) => {
  const search = req.body.search
  try {
    const searchResult = await Task.find({ $or: [{ "name": { $regex: search, $options: 'i' } }, { "assignmentText": { $regex: search, $options: 'i' } }] })
      .populate('series', 'name color')
      .populate('category', 'name')
      .populate('language', 'name')
      .populate('rules', 'name')
      .exec()
    const matching = searchResult.map(result => result.toJSON())
    res.json(matching.filter(task => task.pending == false))
  } catch (exception) {
    next(exception)
  }
})

taskRouter.post('/:id', async (req, res, next) => {
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
        task.assignmentTextMD = body.assignmentTextMD
        task.supervisorInstructions = body.supervisorInstructions
        task.supervisorInstructionsMD = body.supervisorInstructionsMD
        task.gradingScale = body.gradingScale
        task.gradingScaleMD = body.gradingScaleMD
        task.creatorName = body.creatorName
        task.creatorEmail = body.creatorEmail
        if (task.series.toString() !== body.series.toString()) {
          currentSer = await Series.find({ _id: { $in: task.series } })
          newSer = await Series.find({ _id: { $in: task.series } })
          newSer.forEach(function (s) {
            updatePointerList(task.id, s)
          })
          currentSer.forEach(function (s) {
            removeFromPointerList(task.id, s)
          })
          task.series = body.series
        }
        if (task.category !== body.category) {
          currentCat = await Category.findById(task.category)
          newCat = await Category.findById(body.category)
          updatePointerList(task.id, newCat)
          removeFromPointerList(task.id, currentCat)
          task.category = body.category
        }
        if (task.rules !== body.rule) {
          currentRule = await Rule.findById(task.rules)
          newRule = await Rule.findById(body.rule)
          updatePointerList(task.id, newRule)
          removeFromPointerList(task.id, currentRule)
          task.rules = body.rule
        }
        if (task.language !== body.language) {
          currentLang = await Language.findById(task.language)
          newLang = await Language.findById(body.language)
          updatePointerList(task.id, newLang)
          removeFromPointerList(task.id, currentLang)
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
          const series = await Series.find({ _id: { $in: task.series } })
          const cat = await Category.findById(task.category)
          const rules = await Rule.findById(task.rules)
          const lang = await Language.findById(task.language)
          series.forEach(function (s) {
            updatePointerList(task.id, s)
          })
          removeFromPointerList(task.id, cat)
          removeFromPointerList(task.id, rules)
          removeFromPointerList(task.id, lang)
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

module.exports = taskRouter