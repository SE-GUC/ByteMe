const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Announcements = require('../../models/Announcements')
const validator = require('../../validations/announcementsValidations')


// get the main page 
router.get('/', async (req, res) => {

  let data = "";
  const announcements = await Announcements.find()
  announcements.forEach((value) => {
    const id = value.id;
    const date = value.date;
    data += `<a href="/api/announcements/${id}">${date}</a><br>`
  })
  res.send(data);

})

// get certain Announcement 
router.get('/:id', async (request, response) => {

  var data = ""
  const id = request.params.id
  const announcements = await Announcements.find({ "_id": id })

  announcements.forEach((value) => {

    data = `Date : ${value.date}<br>Info : ${value.info}<br>`;

  })
  response.send(data || 'No Announcements');


});






// it posts the whole Announcements
router.post('/', async (req, res) => {
  try {
    const isValidated = validator.createValidation(req.body)
    if (isValidated.error) return res.send(`<h1>error hah</h1>`) // res.status(400).send({ error: isValidated.error.details[0].message })
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
    const id = req.params.id
    const announcements = await Announcements.find({ id })
    if (!announcements) return res.status(404).send({ error: 'Announcement does not exist' })
    const isValidated = validator.updateValidation(req.body)
    if (isValidated.error) return res.status(400).send({ error: isValidated.error.details[0].message })
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








