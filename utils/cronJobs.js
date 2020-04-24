const { CronJob } = require('cron')
const nodemailer = require('nodemailer')
const config = require('../utils/config')
const logger = require('./logger')
const Task = require('../models/task')
const User = require('../models/user')

const mailJob = new CronJob('00 00 17 */2 * *', async () => {
  try {
    const pendingTasks = await Task.find({ pending: true })
    const usersToNotify = await User.find({ allowNotifications: true })
    const emailList = usersToNotify.map((user) => user.email)
    logger.info('Pending tasks:', pendingTasks.length)
    if (pendingTasks.length > 0) {
      logger.info('Sending email to admins')
      logger.info('Sending notification to following addresses:', emailList)
      let transporter
      let mailOptions
      if (config.APPLICATION_STAGE === 'DEV') {
        transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASSWORD,
          },
        })

        mailOptions = {
          from: 'Kisatehtäväpankki <partioprojekti@gmail.com>',
          to: emailList,
          subject: 'Hyväksymättömiä tehtäviä kisatehtäväpankissa',
          html: `<p>Hei, ${pendingTasks.length} tehtävää odottaa hyväksyntää kisatehtäväpankissa</p>`,
          text: `Hei, ${pendingTasks.length} tehtävää odottaa hyväksyntää kisatehtäväpankissa`,
        }
      }
      if (config.APPLICATION_STAGE === 'PROD') {
        const sgTransport = require('nodemailer-sendgrid-transport')
        transporter = nodemailer.createTransport(sgTransport({
          auth: {
            api_key: config.SENDGRID_APIKEY,
          },
        }))

        mailOptions = {
          from: 'Kisatehtäväpankki <partioprojekti@gmail.com>',
          to: emailList,
          replyTo: config.EMAIL_USER,
          subject: 'Hyväksymättömiä tehtäviä kisatehtäväpankissa',
          html: `<p>Hei, ${pendingTasks.length} tehtävää odottaa hyväksyntää kisatehtäväpankissa</p>`,
          text: `Hei, ${pendingTasks.length} tehtävää odottaa hyväksyntää kisatehtäväpankissa`,
        }
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error('Error:', error)
        } else {
          logger.info(info)
        }
      })
    }
  } catch (exception) {
    console.log(exception)
  }
}, null, true, 'Europe/Helsinki')

const pingJob = new CronJob('00 */5 * * * *', async () => {
  const time = new Date()
  logger.info('Ping pong! It is', time.toUTCString())
  const http = require('http')
  http.get('http://kisapankki-staging.herokuapp.com')
}, null, true, 'Europe/Helsinki')

module.exports = { pingJob, mailJob }