const ruleRouter = require('express').Router()
const Rule = require('../models/rule')

ruleRouter.get('/', async (req, res, next) => {
  try {
    const rules = await Rule.find({})
    res.json(rules.map((rule) => rule.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

ruleRouter.post('/', async (req, res, next) => {
  const body = req.body

  const rule = new Rule({
    rules: body.rules,
    task: null,
  })

  try {
    const savedRule = await rule.save()
    res.json(savedRule.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = ruleRouter