const express = require('express')
const router = express.Router()
const Mailing_list = require('../../models/Mailing_list')
const validator = require('../../validations/mailing_listvalidations')
const emailer = require('../../emailer')
router.post('/', async (req, res) => {
  const email = req.body.email

  try {
    const emailData = {
      to: email,
      subject: 'GUCMUN Newsletter',
      text: req.body.message
    }
    emailer.sendEmail(emailData)

    res.json({ msg: 'Email was sent successfully' })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
