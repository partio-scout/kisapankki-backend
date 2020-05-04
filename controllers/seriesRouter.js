const seriesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const { getTokenFrom } = require('../utils/routerHelp')
const Series = require('../models/series')
const Task = require('../models/task')

// Fetch all series, populate pointers
seriesRouter.get('/', async (req, res, next) => {
  try {
    const series = await Series.find({})
      .populate('task')
      .exec()
    res.json(series.map((group) => group.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

// Add new series, requires valid token
seriesRouter.post('/', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      const { body } = req
      const group = new Series({
        name: body.name,
        color: body.color,
        task: [],
      })
      try {
        const savedSeries = await group.save()
        res.json(savedSeries.toJSON())
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

// Delete series and remove all pointers to it, requires valid token
seriesRouter.delete('/:id', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const { id } = req.params
        const delSer = await Series.findById(id)
        if (delSer) {
          const tasksWithPointer = await Task.find({ _id: { $in: delSer.task } })
          tasksWithPointer.forEach(async (task) => {
            task.series = task.series.filter((s) => String(s) !== String(id))
            await task.save()
          })
          await delSer.remove()
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

// Update name and color of series 
seriesRouter.put('/:id', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const { body } = req
        const updSer = await Series.findById(req.params.id)
        if (updSer) {
          updSer.name = body.name
          updSer.color = body.color
          const updatedSeries = await updSer.save()
          res.json(updatedSeries.toJSON())
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

module.exports = seriesRouter
