const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../../models/Product");
const User = require("../../models/User");

// get all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json({ data: products });
});

// get certain product by name
router.get("/:name", async (req, res) => {
  const name = req.params.name;
  const product = await Product.find({ name: name });
  res.json({ data: product });
});

// create a new product
router.post("/", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const userOne = await User.findById(req.session.user_id);

    if (
      !(userOne.awg_admin === "mun") &&
      !(userOne.mun_role === "secretary_office")
    )
      return res.status(403).send({ error: "Only admins can create products" });

    const newProduct = await Product.create(req.body);
    res.json({ msg: "Product was created successfully", data: newProduct });
  } catch (error) {
    return res.sendStatus(400).json(error);
  }
});

// update the whole product by id
router.put("/:id", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const userOne = await User.findById(req.session.user_id);

    if (
      !(userOne.awg_admin === "mun") &&
      !(userOne.mun_role === "secretary_office")
    )
      return res.status(403).send({ error: "Only admins can update products" });

    const id = req.params.id;
    const product = await Product.find({ id });
    if (!product)
      return res.status(404).send({ error: "Product does not exist" });
    const updateProduct = await Product.updateOne(req.body);
    res.json({ msg: "Product updated successfully" });
  } catch (error) {
    return res.sendStatus(400).json(error);
  }
});

// delete the whole product by id
router.delete("/:id", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const userOne = await User.findById(req.session.user_id);

    if (
      !(userOne.awg_admin === "mun") &&
      !(userOne.mun_role === "secretary_office")
    )
      return res.status(403).send({ error: "Only admins can delete products" });

    const id = req.params.id;
    const deletedProduct = await Product.findByIdAndRemove(id);
    res.json({ msg: "Product was deleted successfully", data: deletedProduct });
  } catch (error) {
    return res.sendStatus(400).json(error);
  }
});

module.exports = router;