const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Announcements = require('../../models/Announcements')
const validator = require('../../validations/announcementsValidations')

const User = require('../../models/User')

// get the main page 
router.get('/', async (req, res) => {

  let data = "";
  const announcements = await Announcements.find()
  res.json({ data: announcements })

})

// get certain Announcement 
router.get('/:id', async (request, response) => {

  var data = ""
  const id = request.params.id
  const announcements = await Announcements.find({ "_id": id })
  res.json({ data: announcements })
  


});






// it posts the whole Announcements
router.post('/', async (req, res) => {
  try {
    if (!req.session.user_id) return res.json({ msg: 'You are not logged in' })

    const userOne = await User.findById(req.session.user_id)

    if (!userOne.is_admin) return res.json({ msg: 'Only admins can post' })
    const isValidated = validator.createValidation(req.body)
    if (isValidated.error) return res.json({ msg: 'Validations are not met' }) // res.status(400).send({ error: isValidated.error.details[0].message })
    const newAnnouncements = await Announcements.create(req.body)
    res.json({ msg: 'Announcement was created successfully', data: newAnnouncements })
  }
  catch (error) {
    console.log(error)
  }
})



// update the whole council
router.put('/:id', async (req, res) => {
  try {
    if (!req.session.user_id) return  res.json({ msg: 'You are not logged in' })

    const userOne = await User.findById(req.session.user_id)

    if (!userOne.is_admin) return  res.json({ msg: 'Only admins can update' })
    const id = req.params.id
    const announcements = await Announcements.find({ id })
    if (!announcements) return  res.json({ msg: 'Announcement doesnot exist' })
    const isValidated = validator.updateValidation(req.body)
    if (isValidated.error) return  res.json({ msg: 'Validations are not met' })
    const updateAnnouncements = await Announcements.updateOne(req.body)
    res.json({ msg: 'Announcement updated successfully' })
  }
  catch (error) {
    // We will be handling the error later
    console.log(error)
  }
})


// delete the whole Announcement 
router.delete('/:id', async (req, res) => {
  try {
    if (!req.session.user_id) return  res.json({ msg: 'You are not logged in' })

    const userOne = await User.findById(req.session.user_id)

    if (!userOne.is_admin) return  res.json({ msg: 'Only admins can delete' })
    const id = req.params.id
    const deletedAnnouncements = await Announcements.findByIdAndRemove(id)
    res.json({ msg: 'Announcement was deleted successfully', data: deletedAnnouncements })
  }
  catch (error) {
    // We will be handling the error later
    console.log(error)
  }
})

module.exports = router;
