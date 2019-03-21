const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const Mailing_list = require("../../models/Mailing_list");

const validator = require("../../validations/mailing_listvalidations");

const User = require("../../models/User");

//get mails

router.get("/", async (req, res) => {
  if (!req.session.user_id)
    return res.status(403).send({ error: "You are not logged in" });

  const userOne = await User.findById(req.session.user_id);

  if (!userOne.is_admin)
    return res
      .status(403)
      .send({ error: "Only admins can view subscribed mails" });

  let data = "";

  const mailing_list = await Mailing_list.find();

  mailing_list.forEach(value => {
    data += `<a>${value.email}</a><br>`;
  });

  res.send(data || "welcome to our list");
});

// it posts the whole mails

router.post("/", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const userOne = await User.findById(req.session.user_id);

    const newMailinglist = await Mailing_list.create({ email: userOne.email });

    res.json({ data: newMailinglist });
  } catch (error) {
    // We will be handling the error later

    console.log(error);
  }
});

// delete the whole council

router.delete("/", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const userOne = await User.findById(req.session.user_id);

    if (userOne.is_admin) {
      const deletedMail = await Mailing_list.findOneAndDelete(req.body);

      res.json({ msg: "Mail was deleted successfully", data: deletedMail });
    } else {
      // const deletedMail = await Mailing_list.findByIdAndRemove(req.session.user_id)

      const deletedMail = await Mailing_list.findOneAndDelete(
        { email: userOne.email },
        { upsert: false }
      );

      res.json({ msg: "Mail was deleted successfully", data: deletedMail });
    }
  } catch (error) {
    // We will be handling the error later

    console.log(error);
  }
});

module.exports = router;
