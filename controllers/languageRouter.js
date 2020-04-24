const languageRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const { getTokenFrom } = require('../utils/routerHelp')
const Language = require('../models/language')
const Task = require('../models/task')

languageRouter.get('/', async (req, res, next) => {
  try {
    const languages = await Language.find({})
      .populate('task')
      .exec()
    res.json(languages.map((language) => language.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

languageRouter.post('/', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      const { body } = req

      const language = new Language({
        name: body.language,
        task: [],
      })

      try {
        const savedLanguage = await language.save()
        res.json(savedLanguage.toJSON())
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

languageRouter.delete('/:id', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const delLang = await Language.findById(req.params.id)
        if (delLang) {
          const tasksWithPointers = await Task.find({ _id: { $in: delLang.task } })
          tasksWithPointers.forEach(async (task) => {
            task.language = null
            await task.save()
          })
          await delLang.remove()
          res.status(204).end()
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

languageRouter.put('/:id', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const { body } = req
        const updLang = await Language.findById(req.params.id)
        if (updLang) {
          updLang.name = body.name
          const updatedLanguage = await updLang.save()
          res.json(updatedLanguage.toJSON())
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

module.exports = languageRouter
