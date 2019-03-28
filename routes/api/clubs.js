const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
const Club = require('../../models/Club')
const validator = require('../../validations/clubValidations')

const User = require('../../models/User').model

router.get('/', async (req, res) => {

    const clubs = await Club.find()
    res.json({ data: clubs })
})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const club = await Club.find({ "_id": id })
        if (!club) return res.json({ message: 'Club does not exist' })

        res.json({ msg: 'Club data', data: club })
    }
    catch (error) {
        // We will be handling the error later
        console.log(error)
    }
})


router.post('/addclub',  passport.authenticate('jwt', {session: false}),async (req, res) => {
    try {
       // if (!req.session.user_id) return res.json({ message: "You are not logged in" })

    const userOne = req.user

    if (!userOne.is_admin) return res.json({ message: 'Only admins can add clubs' })
        const isValidated = validator.createValidation(req.body)
        if (isValidated.error) return   res.json({ msg: "validation are not satisfied"});
        const newClub = await Club.create(req.body)
        res.json({ msg: 'Club was created successfully', data: newClub })
    }
    catch (error) {
        // We will be handling the error later
        console.log(error)
    }
})


router.put('/:id',  passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
       // if (!req.session.user_id)  return  res.json({ msg: "not logged in"});

    const userOne = req.user
    if (!userOne.is_admin)  return  res.json({ msg: "admins only"});
        const id = req.params.id;
        const club = await Club.find({ "_id": id })
        if (!club) return res.json({ message: 'Club does not exist' })
        const isValidated = validator.updateValidation(req.body)
        if (isValidated.error) return res.json({ message:  "validations are not satisfied"})
        const updatedClub = await Club.updateOne(req.body)
        res.json({ msg: 'Club updated successfully', data: updatedClub })
    }
    catch (error) {
        // We will be handling the error later
        console.log(error)
    }
})



router.delete('/:id',  passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
       // if (!req.session.user_id)  return  res.json({ msg: "not logged in"});

    const userOne = req.user

    if (!userOne.is_admin)  return  res.json({ msg: "admins only"});
        const id = req.params.id
        const deletedClub = await Club.findByIdAndRemove(id)
        res.json({ msg: 'Club was deleted successfully', data: deletedClub })
    }
    catch (error) {
        // We will be handling the error later
        console.log(error)
    }
})

module.exports = router;
