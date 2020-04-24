const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const { getTokenFrom } = require('../utils/routerHelp')
const User = require('../models/user')

userRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({})
    res.json(users.map((user) => user.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

userRouter.post('/', async (req, res, next) => {
  const { body } = req

  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  if (!body.name || !body.username || !body.password || !body.email) {
    return res.status(400).json({ error: 'name, username, email, password missing' })
  }

  const saltRounds = 10
  const password = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    email: body.email,
    allowNotifications: body.allowNotifications,
    password,
  })

  try {
    const savedUser = await user.save()
    res.json(savedUser.toJSON())
  } catch (exception) {
    next(exception)
  }
})

userRouter.post('/adminkey', async (req, res, next) => {
  const { body } = req
  if (body.adminKey === process.env.ADMIN_KEY) {
    const saltRounds = 10
    const password = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
      username: body.username,
      name: body.name,
      email: body.email,
      allowNotifications: body.allowNotifications,
      password,
    })
    try {
      const savedUser = await user.save()
      res.json(savedUser.toJSON())
    } catch (exception) {
      next(exception)
    }
  } else {
    return res.status(401).json({ error: 'adminKey missing or invalid' })
  }
})

userRouter.put('/', async (req, res, next) => {
  const { body } = req

  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return res.status(401).json({ error: 'user not found' })
  }

  let { name } = user
  let { username } = user
  let { password } = user
  let { email } = user
  let { allowNotifications } = user

  if (body.name) {
    if (body.name.length < 3) {
      return res.status(400).json({ error: 'too short name' })
    }
    name = body.name
  }

  if (body.username) {
    if (body.username.length < 3) {
      return res.status(400).json({ error: 'too short username' })
    }
    const foundUser = await User.findOne({ username: body.username })
    if (foundUser && foundUser.username !== user.username) {
      return res.status(400).json({ error: 'username already exists' })
    }
    username = body.username
  }

  if (body.email) {
    if (body.email.length < 3) {
      return res.status(400).json({ error: 'too short email' })
    }
    const foundUser = await User.findOne({ email: body.email })
    if (foundUser && foundUser.email !== user.email) {
      return res.status(400).json({ error: 'email already been in use' })
    }
    email = body.email
  }

  allowNotifications = body.allowNotifications

  if (body.oldPassword) {
    const passwordCorrect = await bcrypt.compare(body.oldPassword, user.password)

    if (!user || !passwordCorrect) {
      return res.status(401).json({ error: 'incorrect password' })
    }
  }

  if (body.newPassword) {
    if (body.newPassword.length < 3) {
      return res.status(400).json({ error: 'too short password' })
    }
    const saltRounds = 10
    password = await bcrypt.hash(body.newPassword, saltRounds)
  }

  const updatedUser = {
    name,
    username,
    email,
    password,
    allowNotifications,
  }

  User.findByIdAndUpdate(user.id, updatedUser, { new: true })
    .then(() => {
      res.json({
        token,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        allowNotifications: updatedUser.allowNotifications,
      })
    })
    .catch((error) => next(error))
})

module.exports = userRouter
