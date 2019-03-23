const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Event = require("../../models/Event");
const validator = require("../../validations/eventValidations");

const User = require("../../models/User");
const Page = require("../../models/Page");

//getting all events & finally checked
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json({ data: events });
});
// checked  certain events & finally checked
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const event = await Event.find({ _id: id });
    if (!event) return res.status(404).send({ error: "Event does not exist" });

    res.json({ msg: "Event data", data: event });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});
// get feedbacks of certain event & checked
router.get("/:id/viewfeedback", async (req, res) => {
  try {
    const id = req.params.id;
    const event = await Event.find({ _id: id });
    event.forEach(value => {
      data = `Feedback: ${value.feedback}`;
    });
    res.send(data || "No feedbacks");
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

// get photos of certain event & checked
router.get("/:id/viewphotos", async (req, res) => {
  try {
    const id = req.params.id;
    const event = await Event.find({ _id: id });
    event.forEach(value => {
      data = `photos: ${value.photos}`;
    });
    res.send(data || "No photos");
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});
// Create an event && checked//
router.post("/addevent", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const userOne = await User.findById(req.session.user_id);

    if (
      userOne.awg_admin === "mun" ||
      userOne.mun_role === "secretary_office"
    ) {
      const isValidated = validator.createValidation(req.body);
      if (isValidated.error)
        return res
          .status(404)
          .send({ error: isValidated.error.details[0].message });
      const newEvent = await Event.create(req.body);
      res.json({ msg: "Event was created successfully", data: newEvent });
    } else {
      const page = await Page.findOne({ name: req.body.creator });

      if (!page)
        return res.status(403).send({ error: "Only admins can create events" });

      if (
        !(userOne.mun_role == page.role_to_control) &&
        !(userOne.mun_role == req.body.creator)
      )
        return res.json({ msg: "Eventa cannot not be added successfully" });
      const isValidated = validator.createValidation(req.body);
      if (isValidated.error)
        return res
          .status(40)
          .send({ error: isValidated.error.details[0].message });
      const newEvent = await Event.create(req.body);
      res.json({ msg: "Event was created successfully", data: newEvent });
    }
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});
// done & checked
router.post("/:id/addfeedback", async (req, res) => {
  try {

    const id = req.params.id

    const isValidated = validator.createFeedbackValidation(req.body);
    if (isValidated.error)
      return res
        .status(400)
        .send({ error: isValidated.error.details[0].message });
    const f = Event.update(
      { _id: id },
      { $push: { feedback: [req.body] } }
    ).exec();
    return res.json({ msg: "Feedback was created successfully", data: f });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//add photo check done 
router.post("/:id/addphoto", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const id = req.params.id;
    const userOne = await User.findById(req.session.user_id);

    if (
      userOne.awg_admin === "mun" ||
      userOne.mun_role === "secretary_office"
    ) {
      const isValidated = validator.photoValidation(req.body);
      if (isValidated.error)
        return  res.json({ msg: "jhkjkhj"})
      const e = Event.update(
        { _id: id },
        { $push: { photos: [req.body] } }
      ).exec();
      return res.json({ msg: "Photo added successfully", data: e });
    } else {
      const event = await Event.findById(id);
      const page = await Page.findOne({ name: event.creator });

      if (!page)
        return res
          .status(403)
          .send({ error: "Only admins can delete this event photos" });

      if (
        !(userOne.mun_role == page.role_to_control) &&
        !(userOne.mun_role == event.creator)
      )
        return res.json({ msg: "Photo cannot not be successfully" });
      const isValidated = validator.photoValidation(req.body);
      if (isValidated.error)
        return  res.json({ msg: "jhkjkhj"});
      const e = Event.update(
        { _id: id },
        { $push: { photos: [req.body] } }
      ).exec();
      return res.json({ msg: "Photo added successfully", data: e });
    }
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});
///////////////////////

/////////////////////// Update event done && checked
router.put("/:id", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const id = req.params.id;
    // const id1 = req.params.id1;
    const userOne = await User.findById(req.session.user_id);

    if (
      userOne.awg_admin === "mun" ||
      userOne.mun_role === "secretary_office"
    ) {
      const isValidated = validator.updateValidation(req.body);
      if (isValidated.error)
        return  res.json({ msg: "val 1"})
      const updatedEvent = await Event.updateOne(req.body);
      return res.json({
        msg: "Event updated successfully",
        data: updatedEvent
      });
    } else {
      const event = await Event.findById(id);
      const page = await Page.findOne({ name: event.creator });

      if (!page)
        return  res.json({ msg: "page not found"})

      if (
        !(userOne.mun_role == page.role_to_control) &&
        !(userOne.mun_role == event.creator)
      )
        return res.json({ msg: "Photo cannot not be successfully" });
      const isValidated = validator.updateValidation(req.body);
      if (isValidated.error)
        return res.json({ msg: "val 2"})
      const updatedEvent = await Event.updateOne(req.body);
      res.json({ msg: "Event updated successfully", data: updatedEvent });
    }
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});
////////////////////

////////////////////delete event & checked
router.delete("/:id", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const id = req.params.id;
    // const id1 = req.params.id1;
    const userOne = await User.findById(req.session.user_id);

    if (
      userOne.awg_admin === "mun" ||
      userOne.mun_role === "secretary_office"
    ) {
      const deletedEvent = await Event.findByIdAndRemove(id);
      res.json({ msg: "Event was deleted successfully", data: deletedEvent });
    } else {
      const event = await Event.findById(id);
      const page = await Page.findOne({ name: event.creator });

      if (!page)
        return res
          .status(403)
          .send({ error: "Only admins can delete this event " });

      if (
        !(userOne.mun_role == page.role_to_control) &&
        !(userOne.mun_role == event.creator)
      )
        return res.json({ msg: "event cannot not be deleted successfully" });
      const deletedEvent = await Event.findByIdAndRemove(id);
      res.json({ msg: "Event was deleted successfully", data: deletedEvent });
    }
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

/////////////////////

///////////to be checked
router.delete("/:id/:id1/deletefeedback", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const id = req.params.id;
    const id1 = req.params.id1;
    const userOne = await User.findById(req.session.user_id);

    if (
      userOne.awg_admin === "mun" ||
      userOne.mun_role === "secretary_office"
    ) {
      Event.update({ _id: id }, { $pull: { feedback: { _id: id1 } } }).exec();
      res.json({ msg: "Feedback was deleted successfully" });
    } else {
      const event = await Event.findById(id);
      const page = await Page.findOne({ name: event.creator });

      if (!page)
        return res
          .status(403)
          .send({ error: "Only admins can delete this event feedback" });

      if (
        !(userOne.mun_role == page.role_to_control) &&
        !(userOne.mun_role == event.creator)
      )
        return res.json({ msg: "Photo cannot not be successfully" });
      Event.update({ _id: id }, { $pull: { feedback: { _id: id1 } } }).exec();
      res.json({ msg: "Feedback was deleted successfully" });
    }
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});
//need to check
router.delete("/:id/:id1/deletephoto", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const id = req.params.id;
    const id1 = req.params.id1;
    const userOne = await User.findById(req.session.user_id);

    if (
      userOne.awg_admin === "mun" ||
      userOne.mun_role === "secretary_office"
    ) {
      Event.update({ _id: id }, { $pull: { photos: { _id: id1 } } }).exec();
      return res.json({ msg: "Photo was deleted successfully" });
    } else {
      const event = await Event.findById(id);
      const page = await Page.findOne({ name: event.creator });
     
      if (!page)
        return res
          .status(403)
          .send({ error: "Only admins can delete this event photos" });

      if (!(userOne.mun_role ==page.role_to_control) && !(userOne.mun_role == event.creator))
        return res.json({ msg: "Photo cannot not be successfully" });
      Event.update({ _id: id }, { $pull: { photos: { _id: id1 } } }).exec();
      return res.json({ msg: "Photo was deleted successfully" });
    }
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});
module.exports = router;
