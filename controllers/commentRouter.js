const commentRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Comment = require('../models/comment')

const getTokenFrom = (req) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7)
  }
  return null
}

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
  let pen = true
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      pen = false
    }
  }
  const comment = new Comment({
    content: body.content,
    nickname: body.nickname,
    created: body.created,
    pending: pen,
    task: body.task,
  })
  try {
    const savedComment = await comment.save()
    res.json(savedComment.toJSON())
  } catch (exception) {
    next(exception)
  }
})

commentRouter.delete('/:id', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const comment = await Comment.findByIdAndRemove(req.params.id)
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

module.exports = commentRouter
