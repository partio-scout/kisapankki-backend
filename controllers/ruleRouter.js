const ruleRouter = require('express').Router()
const Rule = require('../models/rule')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const getTokenFrom = (req) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7)
  }
  return null
}

ruleRouter.get('/', async (req, res, next) => {
  try {
    const rules = await Rule.find({})
      .populate('task')
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
        const id = req.params.id
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
