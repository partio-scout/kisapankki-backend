const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

const getTokenFrom = (req) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7)
  }
  return null
}

userRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({})
    res.json(users.map((user) => user.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

userRouter.post('/', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      const body = req.body

      const saltRounds = 10
      const password = await bcrypt.hash(body.password, saltRounds)

      const user = new User({
        username: body.username,
        name: body.name,
        password,
      })

      try {
        const savedUser = await user.save()
        res.json(savedUser.toJSON())
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

userRouter.post('/adminkey', async (req, res, next) => {
  const body = req.body
  if (body.adminKey == process.env.ADMIN_KEY) {
    const saltRounds = 10
    const password = await bcrypt.hash(body.password, saltRounds)
    const newAdmin = new User({
      username: body.username,
      name: body.name,
      password
    })
    try {
      const savedAdmin = await newAdmin.save()
      res.json(savedAdmin.toJSON())
    } catch (exception) {
      next(exception)
    }
  }
})

module.exports = userRouter