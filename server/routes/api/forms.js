const express = require('express')
const router = express.Router()
const emailer = require('../../emailer1')
router.post('/', async (req, res) => {
  try {
    const emailData = {
      from: req.body.email,
      subject: `Inquiry from  ${req.body.fname}  ${req.body.lname}`,
      text: req.body.message
    }
    emailer.sendEmail(emailData)

    res.json({ msg: 'Email was sent successfully' })
    
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
