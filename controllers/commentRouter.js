const commentRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const { getTokenFrom } = require('../utils/routerHelp')
const Comment = require('../models/comment')

commentRouter.get('/', async (req, res, next) => {
  try {
    const comments = await Comment.find({})
    res.json(comments.map((comment) => comment.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

commentRouter.get('/pending', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const comments = await Comment.find({ pending: true })
        res.json(comments.map((comment) => comment.toJSON()))
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

commentRouter.get('/:id', async (req, res, next) => {
  try {
    const comments = await Comment.find({ task: req.params.id, pending: false })
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
        await Comment.findByIdAndRemove(req.params.id)
        res.status(204).end()
      } catch (exception) {
        next(exception)
      }
    } else {
      res.status(404).end()
    }
  } else {
    res.status(401).end()
  }
})

commentRouter.put('/:id/accept', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const comment = await Comment.findById(req.params.id)
        comment.pending = false
        const updComment = await comment.save()
        res.json(updComment.toJSON())
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
