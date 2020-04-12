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
const fs = require('fs');
const { mdToPdf } = require('md-to-pdf')
const multer = require('multer')
const inMemoryStorage = multer.memoryStorage()
const uploadStrategy = multer({ storage: inMemoryStorage }).single('logo')
var archiver = require('archiver')

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

const createContentForPDF = (printedTask, logo, contestInfo) => {
  let sarjat = ''
  printedTask.series.map((s) => sarjat += s.name + ' ')
  let competitionInfo = 
      `<br/>
      <br/>
      ${contestInfo.name}<br/>
      ${contestInfo.date}<br/>
      ${contestInfo.place}<br/>
      ${contestInfo.type}<br/>`
  let joinedText =
    `<style>
    .col2 {
      columns: 2 100px;
      -webkit-columns: 2 100px;
      -moz-columns: 2 100px;
    }
  </style> \n`
  joinedText +=
    `<style>
    .col1 {
      columns: 1 50px;
      -webkit-columns: 1 50px;
      -moz-columns: 1 50px;
    }
  </style> \n`
  joinedText += `<div class="col2" markdown="1">
  <div class="col1" style="text-align: left;" markdown="1">${competitionInfo}</div>`
  if (logo) {
    joinedText += `<div class="col1" style="text-align: right;"><img height="110" width="110" alt="logo" src="data:image/png;base64,${logo.buffer.toString('base64')}"></div></div>`
  } else {
    joinedText += `<div class="col1" style="text-align: right;"><img height="95" width="200" alt="logo" src="../images/partio_logo_rgb_musta.png"></div></div>`
  }
  joinedText += `\n`
  joinedText += `\n`
  joinedText += `# ${printedTask.name}\n`
  joinedText += `**Sarjat:** ${sarjat}\n**Säännöt:** ${printedTask.rules.name} **Kategoria:** ${printedTask.category.name}\n`
  joinedText += '# Tehtävänanto\n' + printedTask.assignmentTextMD
  joinedText += '# Arvostelu\n' + printedTask.gradingScaleMD
  joinedText += '<div class="page-break"></div>'
  joinedText += `\n`
  joinedText += `\n`
  let supervText = '# Rastimiehen ohjeet\n' + printedTask.supervisorInstructionsMD
  joinedText += supervText

  return joinedText
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
        res.json({ ratingsAVG: updTask.ratingsAVG, ratingsAmount: updTask.ratingsAmount })

      }
    }
  } catch (exception) {
    next(exception)
  }
})

taskRouter.post('/:id/pdf', uploadStrategy, async (req, res, next) => {
  try {
    const id = req.params.id
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

const zipMaterials = async (archive, pdfNameList) => {
  pdfNameList.forEach(pdfName => {
    archive.file(pdfName, { name: pdfName })
  })
  return archive
}

taskRouter.post('/pdf', uploadStrategy, async (req, res, next) => {
  try {
    const idList = JSON.parse(req.body.competition).tasks
    const contestInfo = JSON.parse(req.body.competition)
    const logo = req.file
    let filesReady = false
    const archive = archiver("zip")
    res.attachment(`Rastit.zip`)
    archive.pipe(res)
    console.log('id list: ' + idList)
    const taskList = await Task.find({ _id: { $in: idList } })
      .populate('series', 'name')
      .populate('category', 'name')
      .populate('rules', 'name')
      .exec()
    const pdfNameList = taskList.map(task => `${task.name}.pdf`)
    for (let i = 0; i < taskList.length; i++) {
      const mdContent = createContentForPDF(taskList[i], logo, contestInfo)
      const pdf = await mdToPdf({ content: mdContent })
      fs.writeFileSync(`${taskList[i].name}.pdf`, pdf.content)
      if (i == taskList.length - 1) {
        filesReady = true
      }
    }
    console.log('PDF name list: ' + pdfNameList)
    const zippedPDFs = await zipMaterials(archive, pdfNameList)
    while (true) {
      if (filesReady) {
        zippedPDFs.finalize()
        setTimeout(() => { pdfNameList.map(pdf => {
          fs.unlink(pdf, (err) => {
            if (err) throw err
          })
        }) }, 2000)
        break
      } else {
        setTimeout(() => { console.log('creating files...') }, 500)
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
        let transporter
        let mailOptions
        if (config.APPLICATION_STAGE === 'DEV') {
          transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: config.EMAIL_USER,
              pass: config.EMAIL_PASSWORD
            }
          })

          mailOptions = {
            from: `"Kisatehtäväpankki" <${config.EMAIl_USER}>`,
            to: emailList,
            subject: 'Hyväksymättömiä tehtäviä kisatehtäväpankissa',
            html: `<p>Hei, ${pendingTasks.length} tehtävää odottaa hyväksyntää kisatehtäväpankissa</p>`,
            text: `Hei, ${pendingTasks.length} tehtävää odottaa hyväksyntää kisatehtäväpankissa`
          }
        }
        if (config.APPLICATION_STAGE === 'PROD') {
          const sgTransport = require('nodemailer-sendgrid-transport')
          transporter = nodemailer.createTransport(sgTransport({
            auth: {
              api_key: config.SENDGRID_APIKEY
            }
          }))

          mailOptions = {
            from: `"Kisatehtäväpankki" <${config.EMAIl_USER}>`,
            to: emailList,
            replyTo: config.EMAIL_USER,
            subject: 'Hyväksymättömiä tehtäviä kisatehtäväpankissa',
            html: `<p>Hei, ${pendingTasks.length} tehtävää odottaa hyväksyntää kisatehtäväpankissa</p>`,
            text: `Hei, ${pendingTasks.length} tehtävää odottaa hyväksyntää kisatehtäväpankissa`
          }
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
