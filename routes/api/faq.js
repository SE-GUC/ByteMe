const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const FAQ = require('../../models/FAQ')
const validator = require('../../validations/faqValidations')


const User = require('../../models/User')

// get the main page 
router.get('/', async (req, res) => {

  let data = "";
  const faq = await FAQ.find()
  faq.forEach((value) => {
    const id = value.id;
    const Question = value.Question;
    data += `<a href="/api/faq/${id}">${Question}</a><br>`
  })
  res.send(data);

})

// get certain Q&A
router.get('/:id', async (request, response) => {

  var data = ""
  const id = request.params.id
  const faq = await FAQ.find({ "_id": id })

  faq.forEach((value) => {

    data = `Q: ${value.Question}<br>A: ${value.Answer}<br>`;

  })
  response.send(data || 'No FAQs');


});


// it posts the whole Q&A
router.post('/', async (req, res) => {
  try {
    if (!req.session.user_id) return res.status(403).send({ "error": "You are not logged in" })

    const userOne = await User.findById(req.session.user_id)

    if (!userOne.is_admin) return res.status(403).send({ error: 'Only admins can add FAQ' })
    const isValidated = validator.createValidation(req.body)
    if (isValidated.error) return res.send(`<h1>error hah</h1>`) // res.status(400).send({ error: isValidated.error.details[0].message })
    const newFAQ = await FAQ.create(req.body)
    res.json({ msg: 'FAQ was created successfully', data: newFAQ })
  }
  catch (error) {
    console.log(error)
  }
})





// update the whole Q&A
router.put('/:id', async (req, res) => {
  try {
    if (!req.session.user_id) return res.status(403).send({ "error": "You are not logged in" })

    const userOne = await User.findById(req.session.user_id)

    if (!userOne.is_admin) return res.status(403).send({ error: 'Only admins can update FAQs' })
    const id = req.params.id
    const faq = await FAQ.find({ id })
    if (!faq) return res.status(404).send({ error: 'FAQ does not exist' })
    const isValidated = validator.updateValidation(req.body)
    if (isValidated.error) return res.status(400).send({ error: isValidated.error.details[0].message })
    const updatedFAQ = await FAQ.updateOne(req.body)
    res.json({ msg: 'FAQ updated successfully' })
  }
  catch (error) {
    // We will be handling the error later
    console.log(error)
  }
})


// delete the whole Q&A 
router.delete('/:id', async (req, res) => {
  try {
    if (!req.session.user_id) return res.status(403).send({ "error": "You are not logged in" })

    const userOne = await User.findById(req.session.user_id)

    if (!userOne.is_admin) return res.status(403).send({ error: 'Only admins can delete FAQs' })
    const id = req.params.id
    const deletedFAQ = await FAQ.findByIdAndRemove(id)
    res.json({ msg: 'FAQ was deleted successfully', data: deletedFAQ })
  }
  catch (error) {
    // We will be handling the error later
    console.log(error)
  }
})



module.exports = router; 