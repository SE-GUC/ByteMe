const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Page = require("../../models/Page");
const User = require("../../models/User");
const Event = require("../../models/Event");
const validator = require("../../validations/pageValidations");
const eventValidator = require("../../validations/eventValidations");

// done
// get the main page
router.get("/", async (req, res) => {
  let data = "";
  const page = await Page.find();
  page.forEach(value => {
    const id = value.id;
    const name = value.name;
    data += `<a href="/api/page/${id}">${name}</a><br>`;
  });
  res.send(data);
});

//done
// Any one can view any council/office/page
// get certain council or page
router.get("/:id", async (request, response) => {
  var data = "";
  const id = request.params.id;
  const page = await Page.find({ _id: id });

  page.forEach(value => {
    data = `Description: ${
      value.description
    }<br><a href="/api/page/${id}/events">Events</a><br><a href="/api/page/${id}/members">Members</a>`;
  });
  response.send(data || "No student matches the requested id");
});

//done & checked
// Any can view events for any certain council or office
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

//done
//Any can view members of any council
router.get("/:id/members", async (req, res) => {
  try {
    const id = req.params.id;
    const page = await Page.find({ _id: id });
    page.forEach(value => {
      data = `Members: ${value.members.toString()}`;
    });
    res.send(data || "No feedbacks");
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//done & checked
// should be for the website admin for the first time to create a council/page/office
// it posts the whole council
router.post("/", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const userOne = await User.findById(req.session.user_id);

    if (!userOne.is_admin)
      return res.status(403).send({ error: "Only admins can add councils" });

    const isValidated = validator.createValidation(req.body);
    if (isValidated.error) return res.send(`<h1>error hah</h1>`); // res.status(400).send({ error: isValidated.error.details[0].message })
    const newPage = await Page.create(req.body);
    res.json({ msg: "Page was created successfully", data: newPage });
  } catch (error) {
    console.log(error);
  }
});

//
// add events to the council if he is logged in and is admin of this page or higher
router.post("/:id/events", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const userOne = await User.findById(req.session.user_id);

    if (!userOne.mun_role)
      return res
        .status(403)
        .send({ error: "Only admins can add events to this entity" });

    var page = await Page.findById(req.params.id);

    if (
      !(userOne.mun_role === "secretary_office") &&
      !(userOne.mun_role === page.role_to_control) &&
      !(userOne.mun_role === page.name)
    )
      return res
        .status(403)
        .send({ error: "Only admins can add members to this entity" });
    const isValidated = eventValidator.createValidation(req.body);
    if (isValidated.error)
      return res
        .status(400)
        .send({ error: isValidated.error.details[0].message });
    const newEvent = await Event.create(req.body);

    //   const isValidated = validator.addEventValidation(req.body)
    //   if (isValidated.error) return res.send(`<h1>error hah</h1>`)
    //   const id = req.params.id

    //   Page.update({"_id": id},{$push:{"events": [ req.body ] }}).exec()
    res.json({ msg: "Events was creator successfully" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

// done & checked
// add members to the council if he is logged in and is admin of this page or higher
router.post("/:id/members", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const userOne = await User.findById(req.session.user_id);

    if (!userOne.mun_role)
      return res
        .status(403)
        .send({ error: "Only MUN admins can add members to this entity" });

    var page = await Page.findById(req.params.id);

    if (
      !(userOne.mun_role === "secretary_office") &&
      !(userOne.mun_role === page.role_to_control) &&
      !(userOne.mun_role === page.name)
    )
      return res
        .status(403)
        .send({ error: "Only admins can add members to this entity" });

    const guc_id = req.body.guc_id;
    const user = await User.findOne({ guc_id: guc_id });
    if (!user)
      return res
        .status(400)
        .json({ error: "A student with this id does not exists" });

    const isValidated = validator.addMemberValidation(req.body);
    if (isValidated.error) return res.send(`<h1>error hah</h1>`); // res.status(400).send({ error: isValidated.error.details[0].message })

    const id = req.params.id;
    Page.update({ _id: id }, { $push: { members: [req.body] } }).exec();
    res.json({ msg: "Member was added successfully" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

// done & checked
// assign role members if he is this member the same or page admin
router.put("/:id/members/set_role", async (req, res) => {
  if (!req.session.user_id)
    return res.status(403).send({ error: "You are not logged in" });

  const userOne = await User.findById(req.session.user_id);

  if (!userOne.mun_role)
    return res
      .status(403)
      .send({ error: "Only admins can update members to this entity" });

  var page = await Page.findById(req.params.id);

  const guc_id = req.body.guc_id;
  const user = await User.findOne({ guc_id: req.body.guc_id });

  if (!(userOne.mun_role === page.name))
    return res.status(403).send({ error: " already assigned" });

  if (!user)
    return res
      .status(400)
      .json({ error: "A member with this id does not exists" });

  if (user.mun_role)
    return res.status(403).send({ error: "role already assigned" });

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
router.put("/:id", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const userOne = await User.findById(req.session.user_id);

    var page = await Page.findById(req.params.id);

    if (
      !(userOne.mun_role === "secretary_office") &&
      !(userOne.mun_role === page.role_to_control) &&
      !(userOne.mun_role === page.name)
    )
      return res
        .status(403)
        .send({ error: "Only admins can delete events to this entity" });

    const isValidated = validator.updateValidation(req.body);
    if (isValidated.error)
      return res
        .status(400)
        .send({ error: isValidated.error.details[0].message });
    const updatedPage = await Page.updateOne(req.body);
    res.json({ msg: "Page updated successfully" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//done
// delete the whole council
router.delete("/:id", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const userOne = await User.findById(req.session.user_id);

    if (!userOne.is_admin)
      return res
        .status(403)
        .send({ error: "Only admins can add events to this entity" });

    const id = req.params.id;
    const deletedPage = await Page.findByIdAndRemove(id);
    res.json({ msg: "Page was deleted successfully", data: deletedPage });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

// done & checked
// delete members from the council
router.delete("/:id/members/:id1", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const userOne = await User.findById(req.session.user_id);

    var page = await Page.findById(req.params.id);

    if (
      !(userOne.mun_role === "secretary_office") &&
      !(userOne.mun_role === page.role_to_control) &&
      !(userOne.mun_role === page.name)
    )
      return res
        .status(403)
        .send({ error: "Only admins can delete events to this entity" });

    const user = await User.findOne({ guc_id: req.body.guc_id });

    if (!user)
      return res
        .status(400)
        .json({ error: "A member with this id does not exists" });

    await User.updateOne(
      { guc_id: req.body.guc_id },
      { mun_role: null },
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

// done
// delete events from the council
router.delete("/:id/events/:id1", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const userOne = await User.findById(req.session.user_id);

    var page = await Page.findById(req.params.id);

    if (
      !(userOne.mun_role === "secretary_office") &&
      !(userOne.mun_role === page.role_to_control) &&
      !(userOne.mun_role === page.name)
    )
      return res
        .status(403)
        .send({ error: "Only admins can delete events to this entity" });

    const id1 = req.params.id1;
    const deletedEvent = await Event.findByIdAndRemove(id1);
    res.json({ msg: "Event was deleted successfully", data: deletedEvent });

    res.json({ msg: "Events was deleted successfully" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

module.exports = router;

/*

 before any action I should be logged in then if the entity id.roletocontrol equal the session id .munrole

 
 */
