const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Page = require('../../models/Page')
const User = require('../../models/User')
const validator = require('../../validations/pageValidations')


 // get the main page 
router.get('/', async (req,res) => {
    
  let data = "" ; 
    const page = await Page.find()
    page.forEach((value) => {
      const id = value.id ; 
      const name = value.name ; 
      data += `<a href="/api/page/${id}">${name}</a><br>`
    })
    res.send(data) ;
     
})




// get certain council or page 
router.get('/:id',async (request, response) => {
  
  var data = "" 
  const id = request.params.id
  const page = await Page.find({"_id" :id})
  
  page.forEach((value) => {
    
    data = `Description: ${value.description}<br><a href="/api/page/${id}/events">Events</a><br><a href="/api/page/${id}/members">Members</a>`;
    
  })    
  response.send(data || 'No student matches the requested id');
   

}) ;

// get events for certain council or office 
router.get('/:id/events', async (req,res) => {
  try {
   const id = req.params.id;
   const page = await Page.find({"_id" : id})
   page.forEach((value) => {
       data = `Event: ${(value.events)}`;
   })
   res.send(data || 'No feedbacks');
  }
  catch(error) {
      // We will be handling the error later
      console.log(error)
  }  
})


//get members of certain council 
router.get('/:id/members', async (req,res) => {
  try {
   const id = req.params.id;
   const page = await Page.find({"_id" : id})
   page.forEach((value) => {
       data= `Members: ${(value.members).toString()}`;
   })
   res.send(data || 'No feedbacks');
  }
  catch(error) {
      // We will be handling the error later
      console.log(error)
  }  
})



// it posts the whole council 
router.post('/', async (req,res) => {
     try {
     const isValidated = validator.createValidation(req.body)
     if (isValidated.error) return res.send(`<h1>error hah</h1>`) // res.status(400).send({ error: isValidated.error.details[0].message })
     const newPage = await Page.create(req.body)
     res.json({msg:'Page was created successfully', data: newPage})
    }
    catch(error) {
       console.log(error)
    }  
 })

 // add events to the council 
 router.post('/:id/events', async (req,res) => {
  try {
   const isValidated = validator.addEventValidation(req.body)
   if (isValidated.error) return res.send(`<h1>error hah</h1>`) // res.status(400).send({ error: isValidated.error.details[0].message })
   const id = req.params.id
   Page.update({"_id": id},{$push:{"events": [ req.body ] }}).exec()
   res.json({msg:'Events was updated successfully'})
  }
  catch(error) {
      // We will be handling the error later
      console.log(error)
  }  
})

// add members to the council 
router.post('/:id/members', async (req,res) => {
  try {
  
    const guc_id = req.body.guc_id
    const user = await User.findOne({"guc_id":guc_id})
    if(!user) return res.status(400).json({error: 'A member with this id does not exists'})

  
   const isValidated = validator.addMemberValidation(req.body)
   if (isValidated.error) return res.send(`<h1>error hah</h1>`) // res.status(400).send({ error: isValidated.error.details[0].message })

  
   const id = req.params.id
   Page.update({"_id": id},{$push:{"members": [ req.body ] }}).exec()
   res.json({msg:'Members was updated successfully'})
  }
  catch(error) {
      // We will be handling the error later
      console.log(error)
  }  
})

router.put('/:id/members/:id1', async (req,res) => {
  
  const id = req.params.id
  const id1=req.params.id1
  Page.update({"_id": id},{$pull:{"members":{"_id":id1}}}).exec()

  const guc_id = req.body.guc_id
    const user = await User.findOne({"guc_id":guc_id})
    if(!user) return res.status(400).json({error: 'A member with this id does not exists'})

  
   const isValidated = validator.addMemberValidation(req.body)
   if (isValidated.error) return res.send(`<h1>error hah</h1>`)
  Page.update({"_id": id},{$push:{"members": [ req.body ] }}).exec()
  res.json({msg:'Members was updated successfully'})

})

// update the whole council
 router.put('/:id', async (req,res) => {
  try {
   const id = req.params.id
   const page= await Page.find({id})
   if(!page) return res.status(404).send({error: 'Page does not exist'})
   const isValidated = validator.updateValidation(req.body)
   if (isValidated.error) return res.status(400).send({ error: isValidated.error.details[0].message })
   const updatedPage = await Page.updateOne(req.body)
   res.json({msg: 'Page updated successfully'})
  }
  catch(error) {
      // We will be handling the error later
      console.log(error)
  }  
})


// delete the whole council 
router.delete('/:id', async (req,res) => {
  try {
   const id = req.params.id
   const deletedPage = await Page.findByIdAndRemove(id)
   res.json({msg:'Page was deleted successfully', data: deletedPage})
  }
  catch(error) {
      // We will be handling the error later
      console.log(error)
  }  
})


 // delete members from the council
router.delete('/:id/members/:id1', async (req,res) => {
  try {
   const id = req.params.id
   const id1=req.params.id1
   Page.update({"_id": id},{$pull:{"members":{"_id":id1}}}).exec()
   res.json({msg:'Members was deleted successfully'})
  }
  catch(error) {
      // We will be handling the error later
      console.log(error)
  }  
})


// delete events from the council
router.delete('/:id/events/:id1', async (req,res) => {
  try {
   const id = req.params.id
   const id1=req.params.id1
   Page.update({"_id": id},{$pull:{"events":{"_id":id1}}}).exec()
   res.json({msg:'Events was deleted successfully'})
  }
  catch(error) {
      // We will be handling the error later
      console.log(error)
  }  
})

 
  module.exports = router ; 








 