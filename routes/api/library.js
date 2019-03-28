const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require('passport')
const Library = require("../../models/Library");
const User = require("../../models/User").model ;
const validator = require("../../validations/libraryValidations");

// Return all library entries
router.get("/", async (req, res) => {
  try {
    const library = await Library.find();
    res.json({ data: library });
  } catch (error) {
    res.sendStatus(400).json(error);
  }
});

// get certain library entry using name regex, case insenstive
router.get("/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const library = await Library.find({
      name: { $regex: name, $options: "i" }
    });
    res.json({ data: library });
  } catch (error) {
    res.sendStatus(400).json(error);
  }
});

// post a new library entry
router.post("/", passport.authenticate('jwt', {session: false}),async (req, res) => {
  try {
    // if (!req.session.user_id)
    //   return res.json({ message: "You are not logged in" });

    const userOne =req.user;

    if (
      !(userOne.awg_admin === "mun") &&
      !(userOne.mun_role === "secretary_office")
    )
      return res.json({ message: "not an admin" });

    const isValidated = await validator.createValidation(req.body);
    if (isValidated.error)
      return res
        .status(400)
        .json({ error: isValidated.error.details[0].message });
    const newLibrary = await Library.create(req.body);
    res.json({ msg: "Entry was created successfully", data: newLibrary });
  } catch (error) {
    res.sendStatus(400).json(error);
  }
});

// update a library entry
router.put("/:id",passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    // if (!req.session.user_id)
    //   return res.json({ message: "You are not logged in" });

    const userOne = req.user;

    if (
      !(userOne.awg_admin === "mun") &&
      !(userOne.mun_role === "secretary_office")
    )
      return res.json({ message: "not an admin" });

    const id = req.params.id;
    const library = await Library.findOne({ id });
    if (!library)
      return res
        .status(404)
        .json({ error: "Academic Paper requested was not found." });
    const isValidated = validator.updateValidation(req.body);
    if (isValidated.error)
      return res
        .status(400)
        .send({ error: isValidated.error.details[0].message });
    const updateLibrary = await Library.updateOne(req.body);
    res.json({ msg: updateLibrary });
  } catch (error) {
    res.sendStatus(400).json(error);
  }
});

// delete a library entry
router.delete("/:id", passport.authenticate('jwt', {session: false}),async (req, res) => {
  try {
    // if (!req.session.user_id)
    //   return res.json({ message: "You are not logged in" });

    const userOne = req.user;

    if (
      !(userOne.awg_admin === "mun") &&
      !(userOne.mun_role === "secretary_office")
    )
      return res.json({ message: "not an admin" });

    const id = req.params.id;
    const deletedLibrary = await Library.findByIdAndRemove(id);
    res.json({
      msg: "Academic paper was deleted successfully",
      data: deletedLibrary
    });
  } catch (error) {
    res.sendStatus(400).json(error);
  }
});

module.exports = router;
