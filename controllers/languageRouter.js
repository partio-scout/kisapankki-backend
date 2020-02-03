const languageRouter = require('express').Router()
const Language = require('../models/language')

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
  const body = req.body

  const language = new Language({
    language: body.language,
    task: []
  })

  try {
    const savedLanguage = await language.save()
    res.json(savedLanguage.toJSON())
  } catch (exception) {
    next(exception)
  }
})
module.exports = languageRouter