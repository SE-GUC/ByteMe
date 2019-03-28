const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require('passport')
const Page = require("../../models/Page");
const User = require("../../models/User").model;
const Event = require("../../models/Event");
const validator = require("../../validations/pageValidations");
const eventValidator = require("../../validations/eventValidations");

//
router.get("/", async (req, res) => {
  const pages = await Page.find();
  res.json({ data: pages });
});

//
router.get("/:id", async (request, response) => {
  const id = request.params.id;
  const page = await Page.find({ _id: id });
  response.json({ data: page });
});

//
router.get("/:id/events", async (req, res) => {
  try {
    var page = await Page.findById(req.params.id);

    const events = await Event.find({ creator: page.name });
    res.json({ data: events });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//
router.get("/:id/members", async (req, res) => {
  try {
    const id = req.params.id;
    const page = await Page.findById(id);
    res.json({ data: page.members });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//done & checked
// should be for the website admin for the first time to create a council/page/office
// it posts the whole council
router.post("/", passport.authenticate('jwt', {session: false}),async (req, res) => {
  try {
    // if (!req.session.user_id)
    //   return res.json({ message: "You are not logged in" });

    const userOne = req.user;

    if (!(userOne.awg_admin === "mun"))
      return res.json({ mesage: "Only mun admins can add councils" });

    const isValidated = validator.createValidation(req.body);
    if (isValidated.error)
      return res.json({ mesage: "validations not satisfied" });
    const newPage = await Page.create(req.body);
    res.json({ msg: "Page was created successfully", data: newPage });
  } catch (error) {
    console.log(error);
  }
});
//checked
// add events to the council if he is logged in and is admin of this page or higher
router.post("/:id/events", passport.authenticate('jwt', {session: false}),async (req, res) => {
  try {
    // if (!req.session.user_id)
    //   return res.status(403).send({ error: "You are not logged in" });

    const userOne = req.user;

    var page = await Page.findById(req.params.id);

    if (
      !(userOne.mun_role === "secretary_office") &&
      !(userOne.mun_role === page.role_to_control) &&
      !(userOne.mun_role === page.name)
    )
      return res.json({
        message: "Only admins can add members to this entity"
      });
    const isValidated = eventValidator.createValidation(req.body);
    if (isValidated.error)
      return res.json({ message: "vaildations not satisfied" });
    const newEvent = await Event.create(req.body);

    res.json({ data: newEvent });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

// checked
// add members to the council if he is logged in and is admin of this page or higher
router.post("/:id/members", passport.authenticate('jwt', {session: false}),async (req, res) => {
  try {
    // if (!req.session.user_id)
    //   return res.json({ message: "You are not logged in" });

    const userOne = req.user;

    var page = await Page.findById(req.params.id);

    if (
      !(userOne.mun_role === "secretary_office") &&
      !(userOne.mun_role === page.role_to_control) &&
      !(userOne.mun_role === page.name)
    )
      return res.json({
        message: "Only MUN admins can add members to this entity"
      });

    const guc_id = req.body.guc_id;
    const user = await User.findOne({ guc_id: guc_id });
    if (!user)
      return res.json({ message: "A student with this id does not exists" });

    const isValidated = validator.addMemberValidation(req.body);
    if (isValidated.error)
      return res.json({ message: "validations not satisfied" });

    const id = req.params.id;
    Page.update({ _id: id }, { $push: { members: [req.body] } }).exec();
    res.json({ msg: "Member was added successfully" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

// checked
// assign role members if he is this member the same or page admin
router.put("/:id/members/set_role", passport.authenticate('jwt', {session: false}),async (req, res) => {
  // if (!req.session.user_id)
  //   return res.json({ message: "You are not logged in" });

  const userOne = req.user;

  var page = await Page.findById(req.params.id);

  const guc_id = req.body.guc_id;
  const user = await User.findOne({ guc_id: req.body.guc_id });

  if (!(userOne.mun_role === page.name))
    return res.json({ message: " already assigned" });

  if (!user)
    return res.json({ message: "A member with this id does not exists" });

  if (!(user.mun_role == "none"))
    return res.json({ message: "role already assigned" });

  await User.updateOne(
    { guc_id: guc_id },
    { mun_role: userOne.mun_role },
    { upsert: false }
  );
  const updatedUser = await User.findOne({ guc_id: req.body.guc_id });
  return res.json({ message: "updated!", user: updatedUser });
});

//done & checked
//this update will be limited for desc. only
// update the whole council if council admin or higher
router.put("/:id", passport.authenticate('jwt', {session: false}),async (req, res) => {
  try {
    // if (!req.session.user_id)
    //   return res.json({ message: "You are not logged in" });

    const userOne = req.user;

    var page = await Page.findById(req.params.id);

    if (
      !(userOne.mun_role === "secretary_office") &&
      !(userOne.mun_role === page.role_to_control) &&
      !(userOne.mun_role === page.name)
    )
      return res.json({
        message: "Only admins can delete events to this entity"
      });

    const isValidated = validator.updateValidation(req.body);
    if (isValidated.error)
      return res.json({ message: "validations not satisfied" });
    const updatedPage = await Page.updateOne(req.body);
    res.json({ data: updatedPage });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//checked
// delete the whole council
router.delete("/:id", passport.authenticate('jwt', {session: false}),async (req, res) => {
  try {
    // if (!req.session.user_id)
    //   return res.json({ message: "You are not logged in" });

    const userOne = req.user;

    if (!(userOne.awg_admin === "mun"))
      return res.json({ message: "Only admins can add events to this entity" });

    const id = req.params.id;
    const deletedPage = await Page.findByIdAndRemove(id);
    res.json({ message: "Page was deleted successfully", data: deletedPage });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

// checked
// delete members from the council
router.delete("/:id/members/:id1", passport.authenticate('jwt', {session: false}),async (req, res) => {
  try {
    // if (!req.session.user_id)
    //   return res.json({ message: "You are not logged in" });

    const userOne = req.user;

    var page = await Page.findById(req.params.id);

    if (
      !(userOne.mun_role === "secretary_office") &&
      !(userOne.mun_role === page.role_to_control) &&
      !(userOne.mun_role === page.name)
    )
      return res.json({
        message: "Only admins can delete events to this entity"
      });

    const user = await User.findOne({ guc_id: req.body.guc_id });

    if (!user)
      return res.json({ message: "A member with this id does not exists" });

    await User.updateOne(
      { guc_id: req.body.guc_id },
      { mun_role: "none" },
      { upsert: false }
    );

    const id = req.params.id;
    const id1 = req.params.id1;
    Page.update({ _id: id }, { $pull: { members: { _id: id1 } } }).exec();
    res.json({ msg: "Members was deleted successfully" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

// checked
// delete events from the council
router.delete("/:id/events/:id1",passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    // if (!req.session.user_id)
    //   return res.json({ message: "You are not logged in" });

    const userOne = req.user;

    var page = await Page.findById(req.params.id);

    if (
      !(userOne.mun_role === "secretary_office") &&
      !(userOne.mun_role === page.role_to_control) &&
      !(userOne.mun_role === page.name)
    )
      return res.json({
        message: "Only admins can delete events to this entity"
      });

    const id1 = req.params.id1;
    const deletedEvent = await Event.findByIdAndRemove(id1);
    res.json({ message: "Event was deleted successfully", data: deletedEvent });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

module.exports = router;
