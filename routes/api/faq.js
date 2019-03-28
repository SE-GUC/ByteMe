const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require('passport')
const FAQ = require("../../models/FAQ");
const validator = require("../../validations/faqValidations");

const User = require("../../models/User").model;

// get the main page
router.get("/", async (req, res) => {
  const faqs = await FAQ.find();
  res.json({ data: faqs });
});

// get certain Q&A
router.get("/:id", async (request, response) => {
  const id = request.params.id;
  const faq = await FAQ.findById({ id });
  response.json({ data: faq });
});

// it posts the whole Q&A
router.post("/", passport.authenticate('jwt', {session: false}),async (req, res) => {
  try {
    // if (!req.session.user_id)
    //   return res.json({ msg: "You are not logged in" });

    const userOne = req.user;

    if (!userOne.is_admin)
      return res.json({ message : "Only admins can add FAQ" });
    const isValidated = validator.createValidation(req.body);
    if (isValidated.error) return res.json({ message: "not validated" }); // res.status(400).send({ error: isValidated.error.details[0].message })
    const newFAQ = await FAQ.create(req.body);
    res.json({ msg: "FAQ was created successfully", data: newFAQ });
  } catch (error) {
    console.log(error);
  }
});

// update the whole Q&A
router.put("/:id", passport.authenticate('jwt', {session: false}),async (req, res) => {
  try {
    // if (!req.session.user_id) return res.json({ message: "not logged in" });

    const userOne = req.user;

    if (!userOne.is_admin) return res.json({ message: "not admin" });
    const id = req.params.id;
    const faq = await FAQ.find({ id });
    if (!faq) return res.json({ message: "not faq exists" });
    const isValidated = validator.updateValidation(req.body);
    if (isValidated.error) return res.json({ message: "not validated" });
    const updatedFAQ = await FAQ.updateOne(req.body);
    res.json({ msg: "FAQ updated successfully" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

// delete the whole Q&A
router.delete("/:id", passport.authenticate('jwt', {session: false}),async (req, res) => {
  try {
    // if (!req.session.user_id) return res.json({ message: "not logged in" });

    const userOne = req.user;

    if (!userOne.is_admin) return res.json({ message: "not logged in" });
    const id = req.params.id;
    const deletedFAQ = await FAQ.findByIdAndRemove(id);
    res.json({ msg: "FAQ was deleted successfully", data: deletedFAQ });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

module.exports = router;
