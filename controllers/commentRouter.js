const commentRouter = require('express').Router()
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')

commentRouter.get('/', async (req, res, next) => {
  try {
    const comments = await Comment.find({})
    res.json(comments.map((comment) => comment.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

commentRouter.get('/pending', async (req, res, next) => {
  try {
    const comments = await Comment.find({ pending: true })
    res.json(comments.map((comment) => comment.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

commentRouter.post('/', async (req, res, next) => {
  const { body } = req
  const comment = new Comment({
    content: body.content,
    nickName: body.nickName,
    created: body.created,
    pending: true,
    task: [],
  })
  try {
    const savedComment = await comment.save()
    res.json(savedComment.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = commentRouter
