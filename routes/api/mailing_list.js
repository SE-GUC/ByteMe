const  express = require('express')

const router = express.Router()

const mongoose = require('mongoose')



const Mailing_list = require('../../models/Mailing_list')

const validator = require('../../validations/mailing_listvalidations')










//get mails

router.get('/',async (req,res)=> {
 let data = "" ;

const mailing_list = await Mailing_list.find()

mailing_list.forEach((value) => {

data += `<a>${value.email}</a><br>`

}) 

res.send(data ||'welcome to our list') ;

})






// it posts the whole mails

router.post('/',async (req,res) => {

try {

const isValidated = validator.createValidation(req.body)

if (isValidated.error) return 
res.status(400).send({
error: isValidated.error.details[0].message })

const newMailinglist = await Mailing_list.create(req.body)

res.json({msg:'Mailing was created successfully',data: newMailinglist})

}

catch(error) {

// We will be handling the error later

console.log(error)

} 

})










// delete the whole council

router.delete('/:id',async (req,res)=> {

try {

const id = req.params.id

const deletedMail = await Mailing_list.findByIdAndRemove(id)

res.json({msg:'Mail was deleted successfully',data: deletedMail})

}

catch(error) {

// We will be handling the error later

console.log(error)

} 

})



module.exports =router ;