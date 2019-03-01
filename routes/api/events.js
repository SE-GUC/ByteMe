const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Event = require('../../models/Event')
const validator = require('../../validations/eventValidations')

router.get('/', async (req,res) => {
    
    const events = await Event.find()
    res.json({data: events})
})

router.get('/:id', async (req,res) => {
    try {
     const id = req.params.id;
     const event = await Event.find({"_id" : id})
     if(!event) return res.status(404).send({error: 'Event does not exist'})
 
     res.json({msg: 'Event data',data:event})
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 })

router.get('/:id/viewfeedback', async (req,res) => {
    try {
     const id = req.params.id;
     const event = await Event.find({"_id" : id})
     event.forEach((value) => {
         data= `Feedback: ${value.feedback}`;
     })
     res.send(data || 'No feedbacks');
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 })


 router.get('/:id/viewphotos', async (req,res) => {
    try {
     const id = req.params.id;
     const event = await Event.find({"_id" : id})
     event.forEach((value) => {
         data= `Feedback: ${value.photos}`;
     })
     res.send(data || 'No photos');
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 })

// Create an event
router.post('/addevent', async (req,res) => {
    try {
     const isValidated = validator.createValidation(req.body)
     if (isValidated.error) return res.status(400).send({ error: isValidated.error.details[0].message })
     const newEvent= await Event.create(req.body)
     res.json({msg:'Event was created successfully', data: newEvent})
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 })

 router.post('/:id/addfeedback', async (req,res) => {
    try {
     const id = req.params.id;
     const isValidated = validator.createFeedbackValidation(req.body)
     if (isValidated.error) return res.status(400).send({ error: isValidated.error.details[0].message })   
    const f =Event.update({"_id": id},{$push:{"feedback": [req.body]}}).exec()
     res.json({msg:'Feedback was created successfully' , data:f})
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 })

 router.post('/:id/addphoto', async (req,res) => {
    try {
     const id = req.params.id;
     const isValidated = validator.photoValidation(req.body)
   if (isValidated.error) return res.status(400).send({ error: isValidated.error.details[0].message })
   const e=  Event.update({"_id": id},{$push:{"photos": [req.body]}}).exec()
     res.json({msg: 'Photo added successfully',data :e })
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 })


 // Update a book
router.put('/:id', async (req,res) => {
    try {
     const id = req.params.id;
     const event = await Event.find({"_id" : id})
     if(!event) return res.status(404).send({error: 'Event does not exist'})
     const isValidated = validator.updateValidation(req.body)
     if (isValidated.error) return res.status(400).send({ error: isValidated.error.details[0].message })
     const updatedEvent = await Event.updateOne(req.body)
     res.json({msg: 'Event updated successfully',data:updatedEvent })
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 })



 router.delete('/:id', async (req,res) => {
    try {
     const id = req.params.id
     const deletedEvent = await Event.findByIdAndRemove(id)
     res.json({msg:'Event was deleted successfully', data: deletedEvent})
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 }) 
 router.delete('/:id/:id1/deletefeedback', async (req,res) => {
    try {
     const id = req.params.id
     const id1=req.params.id1
     Event.update({"_id": id},{$pull:{"feedback":{"_id":id1}}}).exec()
     res.json({msg:'Feedback was deleted successfully'})
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 }) 
 router.delete('/:id/:id1/deletephoto', async (req,res) => {
    try {
     const id = req.params.id
     const id1=req.params.id1
     Event.update({"_id": id},{$pull:{"photos":{"_id":id1}}}).exec()
     res.json({msg:'Photo was deleted successfully'})
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
 }) 
 module.exports = router;
 