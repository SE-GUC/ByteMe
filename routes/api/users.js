const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()

const User = require('../../models/User')
const validator = require('../../validations/userValidations')

router.get('/', (req, res) => res.json({ data: 'Users working' }))

router.get('/:gucid', async (req, res) => {
    try {
        const guc_id = req.params.gucid
        const user = await User.findOne({ guc_id })
        if (!user) return res.status(404).send({ error: 'No user with this guc id' })
        res.json({ data: user })
    } catch (error) {
        console.log(error)
    }
})

router.put('/giveAdmin', async (req, res) => {
    try {
        const isValidated = validator.giveAdminValidation(req.body)
        if (isValidated.error) return res.status(400).send(
            { error: isValidated.error.details[0].message })

        const userWithEmail = await User.findOne({ email: req.body.email })

        if (!userWithEmail) return res.status(404).send({ error: 'No user with this email' })

        const dbHash = userWithEmail["password"]

        bcrypt.compare(req.body.password, dbHash, async (err, match) => {
            if (match) {
                const userTwo = await User.findOne({ guc_id: req.body.guc_id })

                if (!userWithEmail.is_admin) return res.status(403).send({ error: 'This user can\'t assign the admin role' })

                if (!userTwo) return res.status(404).send({ error: 'No user with this guc id' })
                if (userTwo.is_admin) return res.status(403).send({ error: 'User is also an admin' })

                await User.updateOne({ guc_id: req.body.guc_id }, { is_admin: true}, { upsert: false })
                const updatedUser = await User.findOne({ guc_id: req.body.guc_id })
                return res.json({ "message": "updated!", "user": updatedUser })
            } else {
                return res.status(403).json({ "error": "wrong password" })
            }
        });
    }
    catch (error) {
        // We will be handling the error later
        console.log(error)
    }
})

router.put('/munRole', async (req, res) => {
    try {
        const isValidated = validator.giveMunRoleValidation(req.body)
        if (isValidated.error) return res.status(400).send(
            { error: isValidated.error.details[0].message })

        const userWithEmail = await User.findOne({ email: req.body.email })

        if (!userWithEmail) return res.status(404).send({ error: 'No user with this email' })

        const dbHash = userWithEmail["password"]

        bcrypt.compare(req.body.password, dbHash, async (err, match) => {
            if (match) {
                const userTwo = await User.findOne({ guc_id: req.body.guc_id })

                if (!userWithEmail.mun_role || userWithEmail.mun_role < req.body.mun_role || req.body.mun_role < 0) return res.status(403).send({ error: 'This user can\'t assign this role' })

                if (!userTwo) return res.status(404).send({ error: 'No user with this guc id' })
                if (userTwo.mun_role && userWithEmail.mun_role > req.body.mun_role) return res.status(403).send({ error: 'That user has a higher role' })

                await User.updateOne({ guc_id: req.body.guc_id }, { mun_role: req.body.mun_role }, { upsert: false })
                const updatedUser = await User.findOne({ guc_id: req.body.guc_id })
                return res.json({ "message": "updated!", "user": updatedUser })
            } else {
                return res.status(403).json({ "error": "wrong password" })
            }
        });
    }
    catch (error) {
        // We will be handling the error later
        console.log(error)
    }
})

router.put('/', async (req, res) => {
    try {
        const isValidated = validator.updateValidation(req.body)
        if (isValidated.error) return res.status(400).send(
            { error: isValidated.error.details[0].message })

        const email = req.body.old_email
        const newemail = req.body.new_email
        const password = req.body.old_password

        const userWithEmail = await User.findOne({ email })
        if (!userWithEmail) return res.status(404).send({ error: 'No user with this email' })

        if (newemail) {
            const user = await User.findOne({ newemail })
            if (user) return res.status(400).json({ error: 'An account with the requested email already exists' })
        }

        const dbHash = userWithEmail["password"]

        let finalemail = email

        bcrypt.compare(password, dbHash, async (err, match) => {
            if (match) {
                const updatedUser = req.body

                if (updatedUser.new_email) {
                    updatedUser.email = updatedUser.new_email
                    finalemail = updatedUser.new_email
                }

                delete updatedUser.new_email
                delete updatedUser.old_email

                if (updatedUser.new_password) {
                    const salt = bcrypt.genSaltSync(10)
                    const hashedPassword = bcrypt.hashSync(updatedUser.new_password, salt)
                    updatedUser.password = hashedPassword
                }

                delete updatedUser.new_password
                delete updatedUser.old_password

                User.updateOne({ email: email }, updatedUser, { upsert: false })

                const userAfterUpdate = await User.findOne({ "email": finalemail })
                console.log(finalemail)

                return res.json({
                    "message": "user updated!",
                    "updated user": userAfterUpdate
                })
            } else {
                return res.status(403).json({ "error": "wrong password" })
            }
        });
    }
    catch (error) {
        // We will be handling the error later
        console.log(error)
    }
})


router.delete('/', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const userWithEmail = await User.findOne({ email })

        if (!userWithEmail) return res.status(404).send({ error: 'No user with this email' })

        const dbHash = userWithEmail["password"]

        bcrypt.compare(password, dbHash, async (err, match) => {
            if (match) {
                const deletedUser = await User.findOneAndRemove(email)
                return res.json({
                    "message": "user deleted!",
                    "deleted user": userWithEmail
                })
            } else {
                return res.status(403).json({ "error": "wrong password" })
            }
        });
    }
    catch (error) {
        // We will be handling the error later
        console.log(error)
    }
})

router.post('/register', async (req, res) => {
    const isValidated = validator.createValidation(req.body)
    if (isValidated.error) return res.status(400).send(
        { error: isValidated.error.details[0].message })

    const { email, first_name, last_name, birth_date, password,
        guc_id, picture_ref, is_admin, is_private, mun_role } = req.body

    var user = await User.findOne({ email })
    if (user) return res.status(400).json({ error: 'An account with this email already exists' })
    user = await User.findOne({ guc_id })
    if (user) return res.status(400).json({ error: 'An account with this guc id already exists' })

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
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
        .then(user => res.json({ data: user }))
        .catch(err => res.json({ error: 'Can not create user' }))
})

module.exports = router