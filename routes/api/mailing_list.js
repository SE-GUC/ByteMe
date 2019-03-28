const express = require("express");

const router = express.Router();
const passport = require('passport')
const mongoose = require("mongoose");

const Mailing_list = require("../../models/Mailing_list");

const validator = require("../../validations/mailing_listvalidations");

const User = require("../../models/User").model;

router.get("/", passport.authenticate('jwt', {session: false}), async (req, res) => {
  //if (!req.session.user_id) return res.json({ message: "not logged in" });
  
  const userOne = req.user
  if (
    !(userOne.awg_admin === "mun") &&
    !(userOne.mun_role === "secretary_office")
  )
    return res.json({ message: "Only mun admins can view subscribed mails" });

  const mailing_list = await Mailing_list.find();

  res.json({ data: mailing_list });
});

router.post("/", async (req, res) => {
  try {
    const isValidated = validator.createValidation(req.body);
    if (isValidated.error)
      return res.json({ msg: "validations not satisfied" });

    const newMailinglist = await Mailing_list.create(req.body);

    res.json({ data: newMailinglist });
  } catch (error) {
    // We will be handling the error later

    console.log(error);
  }
});

router.delete("/:id", passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    //if (!req.session.user_id) returnres.json({ msg: "not logged in" });

    const userOne = req.user;

    if (
      userOne.awg_admin === "mun" ||
      userOne.mun_role === "secretary_office"
    ) {
      const deletedMail = await Mailing_list.findByIdAndRemove(req.params.id);

      return res.json({ msg: "Mail was deleted successfully", data: deletedMail });
    }
    return res.json({ message: "Only mun admins can view subscribed mails" });
  } catch (error) {
    // We will be handling the error later

    console.log(error);
  }
});

module.exports = router;
