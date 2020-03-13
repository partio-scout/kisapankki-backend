const nodemailer = require('nodemailer')
const config = require('./config')

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.EMAIl_USER,
    pass: config.EMAIL_PASSWORD
  }
})

const mailOptions = {
  from: `${config.EMAIl_USER}`,
  to: 'arttu.janhunen@gmail.com',
  subject: 'Uusi tehtävä',
  html: '<p>Hei, uusi tehtävä odottaa hyväksyntää kisapankissa</p>'
}

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error)
  } else {
    console.log(info)
  }
})