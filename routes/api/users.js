const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()

const User = require('../../models/User')
const validator = require('../../validations/userValidations')

router.get('/', (req,res) => res.json({data: 'Users working'}))

router.get('/:email', async (req,res) => {
    try{
        const email = req.params.email
        const user = await User.findOne({email})
        if(!user) return res.status(404).send({error: 'No user with this email'})
        const isValidated = validator.updateValidation(req.body)
        if(isValidated.error) return res.status(400).send({error: isValidated.error.details[0].message})
        res.json({data: user})
    }catch(error){
        console.log(error)
    }
})

router.put('/:email',async (req,res)=>{
    try{
        const email = req.params.email
        const user = await User.findOne({email})
        if(!user) return res.status(404).send({error: 'No user with this email'})
        const isValidated = validator.updateValidation(req.body)
        if(isValidated.error) return res.status(400).send({error: isValidated.error.details[0].message})
        const updatedUser = await User.updateOne(req.body)
        res.json({msg: 'User updated successfully!'})
    }catch(error){
        console.log(error)
    }
})

router.delete('/:email/:password', async (req,res) => {
    try {
        const email = req.params.email
        const password = req.params.password
        const hashedPassword = bcrypt.hashSync(password,'very secure salt')
        const userWithEmail = await User.findOne({email})
        if(userWithEmail['password'] == hashedPassword){
            const deletedUser = await User.findByIdAndRemove({email})
        }

        res.json({msg:'Book was deleted successfully', data: deletedUser})
    }
    catch(error) {
        // We will be handling the error later
        console.log(error)
    }  
})

router.post('/register', async (req,res) => {
    const isValidated = validator.createValidation(req.body)
    if (isValidated.error) return res.status(400).send(
        { error: isValidated.error.details[0].message })

    const {email, first_name, last_name, birth_date, password,
         guc_id, picture_ref, is_admin, is_private, mun_role} = req.body

    const user = await User.findOne({email})
    if(user) return res.status(400).json({error: 'An account with this email already exists'})
    
    const hashedPassword = bcrypt.hashSync(password,'very secure salt')
    const newUser = new User({
            email,
            first_name,
            last_name,
            birth_date,
            password: hashedPassword,
            guc_id,
            picture_ref,
            is_admin,
            is_private,
            mun_role,
        })
    newUser
    .save()
    .then(user => res.json({data: user}))
    .catch(err => res.json({error: 'Can not create user'}))
})

module.exports = router