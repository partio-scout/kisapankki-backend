const categoryRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const { getTokenFrom } = require('../utils/routerHelp')
const Category = require('../models/category')
const Task = require('../models/task')
const Rule = require('../models/rule')

categoryRouter.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({})
      .populate('task')
      .exec()
    res.json(categories.map((category) => category.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

categoryRouter.post('/', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      const { body } = req
      const category = new Category({
        name: body.category,
        task: [],
      })
      try {
        const savedCategory = await category.save()
        res.json(savedCategory.toJSON())
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

categoryRouter.delete('/:id', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const delCat = await Category.findById(req.params.id)
        if (delCat) {
          const tasksWithPointers = await Task.find({ _id: { $in: delCat.task } })
          tasksWithPointers.forEach(async (task) => {
            task.category = null
            await task.save()
          })
          const rules = await Rule.find({})
          rules.forEach(async (rule) => {
            rule.acceptedCategories = rule.acceptedCategories.filter((cat) => cat != req.params.id)
            await rule.save()
          })
          await delCat.remove()
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

categoryRouter.put('/:id', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const { body } = req
        const updCat = await Category.findById(req.params.id)
        if (updCat) {
          updCat.name = body.name
          const updatedCategory = await updCat.save()
          res.json(updatedCategory.toJSON())
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
module.exports = categoryRouter
