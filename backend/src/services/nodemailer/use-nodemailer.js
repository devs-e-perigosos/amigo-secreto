import nodemailer from 'nodemailer'

const SERVICE = 'gmail'
const USER = 'devseperigosos@gmail.com'
const PASS = 'e@Ya#6TDM6XJ$6Yn'
const SUBJECT = 'Seu amigo secreto!'
const START_MESSAGE = 'Shhhhhh!, seu amigo secreto é: '
const MIDDLE_MESSAGE = ', que possui o email: '

const transporter = nodemailer.createTransport({
  service: SERVICE,
  auth: {
    user: USER,
    pass: PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

export function sendMail(emailReceiver, drawnName, drawnEmail) {
  const mailOptions = {
    from: USER,
    to: emailReceiver,
    subject: SUBJECT,
    text: createMessage(drawnName, drawnEmail),
  }
  transporter.sendMail(mailOptions)
}

function createMessage(drawnName, drawnEmail) {
  return `${START_MESSAGE}${drawnName}${MIDDLE_MESSAGE}${drawnEmail}`
}
