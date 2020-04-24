const taskRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const fs = require('fs')
const multer = require('multer')
const archiver = require('archiver')
const { mdToPdf } = require('../md-to-pdf')
const { downloadBlobs } = require('../utils/blob')
const { zipMaterials } = require('../utils/zip')
const { createContentForPDF } = require('../utils/pdf')
const { getTokenFrom } = require('../utils/routerHelp')
const logger = require('../utils/logger')
const Task = require('../models/task')
const Category = require('../models/category')
const Language = require('../models/language')
const Series = require('../models/series')
const Rule = require('../models/rule')
const Comment = require('../models/comment')

const inMemoryStorage = multer.memoryStorage()
const uploadStrategy = multer({ storage: inMemoryStorage }).single('logo')

const updatePointerList = async (taskId, target) => {
  if (target) {
    if (target.task == null || target.task.length === 0) {
      target.task = [taskId]
    } else {
      target.task = target.task.concat(taskId)
    }
    await target.save()
  }
}

const removeFromPointerList = async (taskId, target) => {
  if (target) {
    target.task = target.task.filter((id) => String(id) !== String(taskId))
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
      ratingsAVG: 0,
      ratingsAmount: 0,
    })

    const savedTask = await task.save().then(t =>
      t.populate('series', 'name color')
      .populate('category', 'name')
      .populate('language', 'name')
      .populate('rules', 'name')
      .execPopulate())
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
          const currentSer = await Series.find({ _id: { $in: task.series } })
          const newSer = await Series.find({ _id: { $in: task.series } })
          newSer.forEach((s) => {
            updatePointerList(task.id, s)
          })
          currentSer.forEach((s) => {
            removeFromPointerList(task.id, s)
          })
          task.series = body.series
        }
        if (String(task.category) !== String(body.category)) {
          const currentCat = await Category.findById(task.category)
          const newCat = await Category.findById(body.category)
          updatePointerList(task.id, newCat)
          removeFromPointerList(task.id, currentCat)
          task.category = body.category
        }
        if (String(task.rules) !== String(body.rule)) {
          const currentRule = await Rule.findById(task.rules)
          const newRule = await Rule.findById(body.rule)
          updatePointerList(task.id, newRule)
          removeFromPointerList(task.id, currentRule)
          task.rules = body.rule
        }
        if (String(task.language) !== String(body.language)) {
          const currentLang = await Language.findById(task.language)
          const newLang = await Language.findById(body.language)
          updatePointerList(task.id, newLang)
          removeFromPointerList(task.id, currentLang)
          task.language = body.language
        }

        const updTask = await task.save().then((t) => t.populate('series', 'name color')
          .populate('category', 'name')
          .populate('language', 'name')
          .populate('rules', 'name')
          .execPopulate())
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
          const comments = await Comment.find({ task: task.id })
          comments.forEach( async (comment) => {
            await Comment.findByIdAndRemove(comment.id)
          })


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
    res.json(matching.filter((task) => task.pending === false))
  } catch (exception) {
    next(exception)
  }
})

taskRouter.post('/:id/views', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
    task.views += 1
    const updTask = await task.save()
    res.json(updTask.toJSON())
  } catch (exception) {
    next(exception)
  }
})

taskRouter.post('/:id/rate', async (req, res, next) => {
  try {
    const { rating } = req.body
    const { id } = req.params
    if (rating > 0 && rating < 6) {
      const ratedTask = await Task.findById(id)
      if (ratedTask) {
        ratedTask.ratings[rating - 1] = ratedTask.ratings[rating - 1] + 1
        let ratingsSUM = 0
        const ratingAMOUNT = ratedTask.ratings.reduce((a, b) => a + b, 0)
        ratedTask.ratings.forEach((r, i) => {
          ratingsSUM += (r * (i + 1))
        })
        ratedTask.ratingsAVG = ratingsSUM / ratingAMOUNT
        ratedTask.ratingsAmount = ratingAMOUNT
        ratedTask.markModified('ratings')
        const updTask = await ratedTask.save()
        res.json({ ratingsAVG: updTask.ratingsAVG, ratingsAmount: updTask.ratingsAmount })
      }
    }
  } catch (exception) {
    next(exception)
  }
})

taskRouter.post('/:id/pdf', uploadStrategy, async (req, res, next) => {
  try {
    const { id } = req.params
    const printedTask = await Task.findById(id)
      .populate('series', 'name')
      .populate('category', 'name')
      .populate('rules', 'name')
      .exec()
    const contestInfo = JSON.parse(req.body.competition)
    const logo = req.file
    res.attachment(`${printedTask.name}.pdf`)
    const mdContent = createContentForPDF(printedTask, logo, contestInfo)
    const pdf = await mdToPdf({ content: mdContent })
    fs.writeFileSync(`${printedTask.name}.pdf`, pdf.content)
    const file = fs.createReadStream(`${printedTask.name}.pdf`)
    file.on('end', () => {
      fs.unlink(`${printedTask.name}.pdf`, (err) => {
        if (err) throw err
      })
    })
    file.pipe(res)
  } catch (exception) {
    next(exception)
  }
})

taskRouter.post('/pdf', uploadStrategy, async (req, res, next) => {
  try {
    const idList = JSON.parse(req.body.competition).tasks
    const contestInfo = JSON.parse(req.body.competition)
    const logo = req.file
    let filesReady = false
    const archive = archiver('zip')
    res.attachment('Rastit.zip')
    archive.pipe(res)
    const taskList = await Task.find({ _id: { $in: idList } })
      .populate('series', 'name')
      .populate('category', 'name')
      .populate('rules', 'name')
      .exec()
    const pdfNameList = taskList.map((task) => `${task.name}.pdf`)
    let fileNameList = []
    taskList.map((task) => { fileNameList = fileNameList.concat(task.files) })
    let taskJSON = []
    taskList.map((task) => {
      const newTaskJSON = {
        folderName: task.name,
        pdfName: `${task.name}.pdf`,
        files: task.files,
      }
      taskJSON = taskJSON.concat(newTaskJSON)
    })
    await downloadBlobs(fileNameList)
    for (let i = 0; i < taskList.length; i++) {
      const mdContent = createContentForPDF(taskList[i], logo, contestInfo)
      const pdf = await mdToPdf({ content: mdContent })
      fs.writeFileSync(`${taskList[i].name}.pdf`, pdf.content)
      if (i === taskList.length - 1) {
        filesReady = true
      }
    }

    const zippedPDFs = await zipMaterials(archive, taskJSON)
    while (true) {
      if (filesReady) {
        zippedPDFs.finalize()
        setTimeout(() => {
          pdfNameList.map((pdf) => {
            fs.unlink(pdf, (err) => {
              if (err) throw err
            })
          })
          fileNameList.map((file) => {
            fs.unlink(file, (err) => {
              if (err) throw err
            })
          })
        }, 2000)
        break
      } else {
        setTimeout(() => { logger.info('creating files...') }, 500)
      }
    }
  } catch (exception) {
    next(exception)
  }
})

module.exports = taskRouter
