const ruleRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const { getTokenFrom } = require('../utils/routerHelp')
const Rule = require('../models/rule')
const Task = require('../models/task')

ruleRouter.get('/', async (req, res, next) => {
  try {
    const rules = await Rule.find({})
      .populate('task')
      .populate('acceptedCategories')
      .exec()
    res.json(rules.map((rule) => rule.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

ruleRouter.post('/', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      const { body } = req

      const rule = new Rule({
        name: body.rules,
        task: [],
        acceptedCategories: body.acceptedCategories,
      })

      try {
        const savedRule = await rule.save()
        res.json(savedRule.toJSON())
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

ruleRouter.delete('/:id', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const { id } = req.params
        const delRules = await Rule.findById(id)
        if (delRules) {
          const tasksWithPointer = await Task.find({ _id: { $in: delRules.task } })
          tasksWithPointer.forEach(async (t) => {
            t.rules = null
            t.update({ new: true })
          })
          await delRules.remove()
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

ruleRouter.put('/:id', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const { body } = req
        const updRules = await Rule.findById(req.params.id)
        if (updRules) {
          updRules.name = body.name
          updRules.acceptedCategories = body.acceptedCategories
          const updatedRules = await updRules.save()
          res.json(updatedRules.toJSON())
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

module.exports = ruleRouter
