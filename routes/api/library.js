const
  express = require('express')

const
  router = express.Router()

const
  mongoose = require('mongoose')



const
  Page = require('../../models/Library')

const
  validator = require('../../validations/libraryValidations')



const
  User = require('../../models/User')



// get the main page 

router.get('/',
  async (req,
    res)
    => {



    let
      data = "";

    const
      library = await
        Library.find()

    library.forEach((value)
      => {

      const
        id = value.id;

      const
        name = value.name;

      data +=
        `<a href="/api/library/${id}">${name}</a><br>`

    })

    res.send(data);



  })



// get certain library

router.get('/:id',
  async (request,
    response)
    => {



    var
      data = ""

    const
      id = request.params.id

    const
      library = await
        Library.find({
          "_id":
            id
        })



    library.forEach((value)
      => {



      data =
        `Name: ${value.name}<br>Date :
${value.date}<br>Link : <a href="${value.link}">View
 Academic Paper</a>`;



    })

    response.send(data ||
      'No Academic Papers were found');





  });





// it posts the whole library 

router.post('/',
  async (req,
    res)
    => {

    try {

      if (!req.session.user_id)
        return
      res.status(403).send({
        "error":
          "You are not logged in"
      })



      const
        userOne = await
          User.findById(req.session.user_id)



      if (!userOne.is_admin)
        return
      res.status(403).send({
        error:
          'Only admins can add academic papers'
      })

      const
        isValidated = validator.createValidation(req.body)

      if (isValidated.error)
        return
      res.send(`<h1>error hah</h1>`)
      // res.status(400).send({ error: isValidated.error.details[0].message })

      const
        newLibrary = await
          Library.create(req.body)

      res.json({
        msg:
          'Academic Paper was created successfully',
        data: newLibrary
      })

    }

    catch (error) {

      console.log(error)

    }

  })









// update the whole library

router.put('/:id',
  async (req,
    res)
    => {

    try {

      if (!req.session.user_id)
        return
      res.status(403).send({
        "error":
          "You are not logged in"
      })



      const
        userOne = await
          User.findById(req.session.user_id)



      if (!userOne.is_admin)
        return
      res.status(403).send({
        error:
          'Only admins can update academic papers'
      })

      const
        id = req.params.id

      const
        library = await
          Library.find({
            id
          })

      if (!library)
        return
      res.status(404).send({
        error:
          'Academic paper does not exist'
      })

      const
        isValidated = validator.updateValidation(req.body)

      if (isValidated.error)
        return
      res.status(400).send({
        error:
          isValidated.error.details[0].message
      })

      const
        updatedLibrary = await
          Library.updateOne(req.body)

      res.json({
        msg:
          'Academic Paper updated successfully'
      })

    }

    catch (error) {

      // We will be handling the error later

      console.log(error)

    }

  })





// delete the whole Library

router.delete('/:id',
  async (req,
    res)
    => {

    try {

      if (!req.session.user_id)
        return
      res.status(403).send({
        "error":
          "You are not logged in"
      })



      const
        userOne = await
          User.findById(req.session.user_id)



      if (!userOne.is_admin)
        return
      res.status(403).send({
        error:
          'Only admins can delete academic papers'
      })



      const
        id = req.params.id

      const
        deletedLibrary = await
          Library.findByIdAndRemove(id)

      res.json({
        msg:
          'Academic paper was deleted successfully',
        data: deletedLibrary
      })

    }

    catch (error) {

      // We will be handling the error later

      console.log(error)

    }

  })









module.exports =
  router;


