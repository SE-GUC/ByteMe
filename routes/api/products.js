const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Product = require('../../models/Product')


// get all products
router.get('/', async (req, res) => {

    const products = await Product.find()
    res.json({ data: products })
  })

// get certain product by name
router.get('/:name', async (req, res) => {

  const name = req.params.name
  const product = await Product.find({ "name": name })
  res.json({ data: product })
  })

// it posts the whole Product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body)
    res.json({ msg: 'Product was created successfully', data: newProduct })
  }
  catch (error) {
    console.log(error)
  }
})



// update the whole product by id
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const product = await Product.find({ id })
    if (!product) return res.status(404).send({ error: 'Product does not exist' })
    const updateProduct = await Product.updateOne(req.body)
    res.json({ msg: 'Product updated successfully' })
  }
  catch (error) {
    // We will be handling the error later
    console.log(error)
  }
})


// delete the whole product by id 
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const deletedProduct = await Product.findByIdAndRemove(id)
    res.json({ msg: 'Product was deleted successfully', data: deletedProduct })
  }
  catch (error) {
    // We will be handling the error later
    console.log(error)
  }
})

module.exports = router;






