const seriesRouter = require('express').Router()
const Series = require('../models/series')

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

seriesRouter.post('/', async (req, res, next) => {
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
})

module.exports = seriesRouter
