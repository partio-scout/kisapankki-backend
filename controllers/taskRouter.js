const taskRouter = require('express').Router()
const nodemailer = require('nodemailer')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const CronJob = require('cron').CronJob
const Task = require('../models/task')
const Category = require('../models/category')
const Language = require('../models/language')
const Series = require('../models/series')
const Rule = require('../models/rule')
const User = require('../models/user')

const getTokenFrom = (req) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7)
  }
  return null
}

const updatePointerList = async (taskId, target) => {
  if (target) {
    if (target.task == null || target.task.length == 0) {
      target.task = [taskId]
    } else {
      target.task = target.task.concat(taskId)
    }
    await target.save()
  }
}

const removeFromPointerList = async (taskId, target) => {
  if (target) {
    target.task = target.task.filter((id) => id != taskId)
    await target.save()
  }
}

taskRouter.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find({ pending: false })
      .populate('series', 'name color')
      .populate('category', 'name')
      .populate('language', 'name')
      .populate('rules', 'name')
      .exec()
    res.json(tasks.map((task) => task.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

taskRouter.get('/pending', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const pendingTasks = await Task.find({ pending: true })
          .populate('series', 'name color')
          .populate('category', 'name')
          .populate('language', 'name')
          .populate('rules', 'name')
          .exec()
        res.json(pendingTasks.map((task) => task.toJSON()))
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

taskRouter.post('/', async (req, res, next) => {
  const { body } = req
  let pen = true
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      pen = false
    }
  }
  try {
    let cat = null
    let lang = null
    let rule = null
    let series = null

    if (body.category !== '') {
      const foundCategory = await Category.findById(body.category)
      if (foundCategory) {
        cat = foundCategory
      }
    }
    if (body.language !== '') {
      const foundLanguage = await Language.findById(body.language)
      if (foundLanguage) {
        lang = foundLanguage
      }
    }
    if (body.rule !== '') {
      const foundRule = await Rule.findById(body.rule)
      if (foundRule) {
        rule = foundRule
      }
    }
    if (body.series !== []) {
      const foundSeries = await Series.find({ _id: { $in: body.series } })
      if (foundSeries) {
        series = foundSeries
      }
    }

    const task = new Task({
      name: body.name,
      assignmentText: body.assignmentText,
      assignmentTextMD: body.assignmentTextMD,
      supervisorInstructions: body.supervisorInstructions,
      supervisorInstructionsMD: body.supervisorInstructionsMD,
      gradingScale: body.gradingScale,
      gradingScaleMD: body.gradingScaleMD,
      creatorName: body.creatorName,
      creatorEmail: body.creatorEmail,
      pending: pen,
      series: series.map((s) => s.id),
      category: cat.id,
      language: lang.id,
      rules: rule.id,
      files: body.files,
      views: 0,
      ratings: [0, 0, 0, 0, 0],
      ratingsAVG: 0
    })

    const savedTask = await task.save()
    updatePointerList(savedTask.id, cat)
    updatePointerList(savedTask.id, lang)
    updatePointerList(savedTask.id, rule)
    series.forEach((s) => {
      updatePointerList(savedTask.id, s)
    })

    res.json(savedTask.toJSON())
  } catch (exception) {
    next(exception)
  }
})

taskRouter.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('series', 'name color')
      .populate('category', 'name')
      .populate('language', 'name')
      .populate('rules', 'name')
      .exec()
    if (task) {
      res.json(task.toJSON())
    } else {
      res.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

taskRouter.put('/:id', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      const { id } = req.params
      const { body } = req
      try {
        const task = await Task.findById(id)
        task.name = body.name
        task.assignmentText = body.assignmentText
        task.assignmentTextMD = body.assignmentTextMD
        task.supervisorInstructions = body.supervisorInstructions
        task.supervisorInstructionsMD = body.supervisorInstructionsMD
        task.gradingScale = body.gradingScale
        task.gradingScaleMD = body.gradingScaleMD
        task.creatorName = body.creatorName
        task.creatorEmail = body.creatorEmail
        task.files = body.files
        if (task.series.toString() !== body.series.toString()) {
          currentSer = await Series.find({ _id: { $in: task.series } })
          newSer = await Series.find({ _id: { $in: task.series } })
          newSer.forEach((s) => {
            updatePointerList(task.id, s)
          })
          currentSer.forEach((s) => {
            removeFromPointerList(task.id, s)
          })
          task.series = body.series
        }
        if (task.category != body.category) {
          currentCat = await Category.findById(task.category)
          newCat = await Category.findById(body.category)
          updatePointerList(task.id, newCat)
          removeFromPointerList(task.id, currentCat)
          task.category = body.category
        }
        if (task.rules != body.rule) {
          currentRule = await Rule.findById(task.rules)
          newRule = await Rule.findById(body.rule)
          updatePointerList(task.id, newRule)
          removeFromPointerList(task.id, currentRule)
          task.rules = body.rule
        }
        if (task.language != body.language) {
          currentLang = await Language.findById(task.language)
          newLang = await Language.findById(body.language)
          updatePointerList(task.id, newLang)
          removeFromPointerList(task.id, currentLang)
          task.language = body.language
        }

        const updTask = await task.save()
        res.json(updTask.toJSON())
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

taskRouter.delete('/:id', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const task = await Task.findById(req.params.id)
        if (task) {
          const series = await Series.find({ _id: { $in: task.series } })
          const cat = await Category.findById(task.category)
          const rules = await Rule.findById(task.rules)
          const lang = await Language.findById(task.language)
          series.forEach((s) => {
            updatePointerList(task.id, s)
          })
          removeFromPointerList(task.id, cat)
          removeFromPointerList(task.id, rules)
          removeFromPointerList(task.id, lang)
          await Task.findByIdAndRemove(req.params.id)
          res.status(204).end()
        } else {
          res.status(404).end()
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

taskRouter.put('/:id/accept', async (req, res, next) => {
  if (req.get('authorization')) {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (token && decodedToken.id) {
      try {
        const task = await Task.findById(req.params.id)
        task.pending = false
        task.views = 0
        const updTask = await task.save()
        res.json(updTask.toJSON())
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

taskRouter.post('/search', async (req, res, next) => {
  const { search } = req.body
  try {
    const searchResult = await Task.find({ $or: [{ name: { $regex: search, $options: 'i' } }, { assignmentTextMD: { $regex: search, $options: 'i' } }] })
      .populate('series', 'name color')
      .populate('category', 'name')
      .populate('language', 'name')
      .populate('rules', 'name')
      .exec()
    const matching = searchResult.map((result) => result.toJSON())
    res.json(matching.filter((task) => task.pending == false))
  } catch (exception) {
    next(exception)
  }
})

taskRouter.post('/:id/views', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
    task.views = task.views + 1
    const updTask = await task.save()
    res.json(updTask.toJSON())
  } catch (exception) {
    next(exception)
  }
})

taskRouter.post('/:id/rate', async (req, res, next) => {
  try {
    const rating = req.body.rating
    const id = req.params.id
    if (rating > 0 && rating < 6) {
      const ratedTask = await Task.findById(id)
      if (ratedTask) {
        ratedTask.ratings[rating - 1] = ratedTask.ratings[rating - 1] + 1
        let ratingsSUM = 0
        let ratingAMOUNT = ratedTask.ratings.reduce((a, b) => a + b, 0)
        ratedTask.ratings.forEach((r, i) => {
          ratingsSUM = ratingsSUM + (r * (i + 1))
        })
        ratedTask.ratingsAVG = ratingsSUM / ratingAMOUNT
        ratedTask.ratingsAmount = ratingAMOUNT
        ratedTask.markModified('ratings')
        const updTask = await ratedTask.save()
        res.status(200).end()
      }
    }
  } catch (exception) {
    next(exception)
  }
})

if (config.NODE_ENV !== 'test') {
  let job = new CronJob('00 00 17 */2 * *', async () => {
    console.log('Sending email to admins')
    try {
      const pendingTasks = await Task.find({ pending: true })
      const usersToNotify = await User.find({ allowNotifications: true })
      const emailList = usersToNotify.map(user => user.email)
      console.log('Pending tasks:', pendingTasks.length)
      if (pendingTasks.length > 0) {
        console.log('Sending notification to following addresses:', emailList)
        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASSWORD
          }
        })

        let mailOptions = {
          from: `"Kisatehtäväpankki" <${config.EMAIl_USER}>`,
          to: emailList,
          subject: 'Hyväksymättömiä tehtäviä kisatehtäväpankissa',
          html: `<p>Hei, ${pendingTasks.length} tehtävää odottaa hyväksyntää kisatehtäväpankissa</p>`,
          text: `Hei, ${pendingTasks.length} tehtävää odottaa hyväksyntää kisatehtäväpankissa`
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error)
          } else {
            console.log(info)
          }
        })
      }
    } catch (exception) {
      console.log(exception)
    }

  }, null, true, 'Europe/Helsinki');
  job.start()
}


module.exports = taskRouter
