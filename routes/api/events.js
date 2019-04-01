const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Event = require("../../models/Event");
const validator = require("../../validations/eventValidations");
const User = require("../../models/User").model;
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
    if (!event) return res.json({ message: "Event does not exist" });

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
    const event = await Event.findById({ _id: id });
    res.json({ msg: "Event feedback", data: event.feedback });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

// get photos of certain event & checked
router.get("/:id/viewphotos", async (req, res) => {
  try {
    const id = req.params.id;
    const event = await Event.findById({ _id: id });
    res.json({ data: event.photos });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});
// Create an event && checked//
router.post(
  "/addevent",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // if (!req.session.user_id)
      //   return res.json({ message: "You are not logged in" });

      const userOne = req.user;

      if (
        userOne.awg_admin === "mun" ||
        userOne.mun_role === "secretary_office"
      ) {
        const isValidated = validator.createValidation(req.body);
        if (isValidated.error)
          return res.json({ message: "val not satisfied" });
        const newEvent = await Event.create(req.body);
        res.json({ msg: "Event was created successfully", data: newEvent });
      } else {
        const page = await Page.findOne({ name: req.body.creator });

        if (!page)
          return res.json({
            message: "Only admins can create events",
            data: req.body
          });

        if (
          !(userOne.mun_role == page.role_to_control) &&
          !(userOne.mun_role == req.body.creator)
        )
          return res.json({ msg: "Event cannot not be added successfully" });
        const isValidated = validator.createValidation(req.body);
        if (isValidated.error)
          return res.json({ message: "val not satisfied" });
        const newEvent = await Event.create(req.body);
        res.json({ msg: "Event was created successfully", data: req });
      }
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);
// done & checked
router.post("/:id/addfeedback", async (req, res) => {
  try {
    const id = req.params.id;

    const isValidated = validator.createFeedbackValidation(req.body);
    if (isValidated.error) return res.json({ message: "no validations" });
    const f = Event.updateOne(
      { _id: id },
      { $push: { feedback: [req.body] } }
    ).exec();
    return res.json({
      msg: "Feedback was created successfully",
      data: req.body
    });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//add photo check done
router.post(
  "/:id/addphoto",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // if (!req.session.user_id)
      //   return res.json({ message: "You are not logged in" });

      const id = req.params.id;
      const userOne = req.user;

      if (
        userOne.awg_admin === "mun" ||
        userOne.mun_role === "secretary_office"
      ) {
        const isValidated = validator.photoValidation(req.body);
        if (isValidated.error) return res.json({ msg: "vaidations error" });
        const e = Event.updateOne(
          { _id: id },
          { $push: { photos: [req.body] } }
        ).exec();
        return res.json({ msg: "Photo added successfully", data: req.body });
      } else {
        const event = await Event.findById(id);
        const page = await Page.findOne({ name: event.creator });
        if (!page)
          return res.json({
            message: "Only admins can delete this event photos"
          });

        if (
          !(userOne.mun_role == page.role_to_control) &&
          !(userOne.mun_role == event.creator)
        )
          return res.json({ msg: "Photo cannot not be successfully" });
        const isValidated = validator.photoValidation(req.body);
        if (isValidated.error) return res.json({ msg: "validations error" });
        const e = Event.updateOne(
          { _id: id },
          { $push: { photos: [req.body] } }
        ).exec();
        return res.json({ msg: "Photo added successfully", data: req.body });
      }
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);
///////////////////////

/////////////////////// Update event done && checked
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // if (!req.session.user_id)
      //   return res.json({ message: "You are not logged in" });

      const id = req.params.id;
      const userOne = req.user;

      if (
        userOne.awg_admin === "mun" ||
        userOne.mun_role === "secretary_office"
      ) {
        const isValidated = validator.updateValidation(req.body);
        if (isValidated.error) return res.json({ msg: "val 1" });
        const updatedEvent = await Event.updateOne(req.body);
        return res.json({
          msg: "Event updated successfully",
          data: updatedEvent
        });
      } else {
        const event = await Event.findById(id);
        const page = await Page.findOne({ name: event.creator });

        if (!page) return res.json({ msg: "page not found" });

        if (
          !(userOne.mun_role == page.role_to_control) &&
          !(userOne.mun_role == event.creator)
        )
          return res.json({ msg: "Event cannot be updated successfully" });
        const isValidated = validator.updateValidation(req.body);
        if (isValidated.error) return res.json({ msg: "val 2" });
        const updatedEvent = await Event.updateOne(req.body);
        res.json({ msg: "Event updated successfully", data: updatedEvent });
      }
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);
////////////////////

////////////////////delete event & checked
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // if (!req.session.user_id)
      //   return res.json({ message: "You are not logged in" });

      const id = req.params.id;
      //const id1 = req.params.id1;
      const userOne = req.user;

      if (
        userOne.awg_admin === "mun" ||
        userOne.mun_role === "secretary_office"
      ) {
        const deletedEvent = await Event.findByIdAndRemove({ _id: id });
        res.json({ msg: "Event was deleted successfully", data: deletedEvent });
      } else {
        const event = await Event.findById(id);
        const page = await Page.findOne({ name: event.creator });

        if (!page)
          return res.json({ message: "Only admins can delete this event " });

        if (
          !(userOne.mun_role == page.role_to_control) &&
          !(userOne.mun_role == event.creator)
        )
          return res.json({ msg: "event cannot not be deleted successfully" });
        const deletedEvent = await Event.findByIdAndRemove({ _id: id });
        res.json({ msg: "Event was deleted successfully", data: req.body });
      }
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

/////////////////////

///////////to be checked
router.delete(
  "/:id/:id1/deletefeedback",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // if (!req.session.user_id)
      //   return res.json({ message: "You are not logged in" });

      const id = req.params.id;
      const id1 = req.params.id1;
      const userOne = req.user;

      if (
        userOne.awg_admin === "mun" ||
        userOne.mun_role === "secretary_office"
      ) {
        Event.updateOne(
          { _id: id },
          { $pull: { feedback: { _id: id1 } } }
        ).exec();
        res.json({ msg: "Feedback was deleted successfully" });
      } else {
        const event = await Event.findById({ _id: id });
        const page = await Page.findOne({ name: event.creator });

        if (!page)
          return res.json({
            message: "Only admins can delete this event feedback"
          });

        if (
          !(userOne.mun_role == page.role_to_control) &&
          !(userOne.mun_role == event.creator)
        )
          return res.json({
            msg: "Feedback cannot not be deleted successfully"
          });
        Event.updateOne(
          { _id: id },
          { $pull: { feedback: { _id: id1 } } }
        ).exec();
        res.json({ msg: "Feedback was deleted successfully" });
      }
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);
//need to check
router.delete(
  "/:id/:id1/deletephoto",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // if (!req.session.user_id)
      //   return res.json({ message: "You are not logged in" });

      const id = req.params.id;
      const id1 = req.params.id1;
      const userOne = req.user;

      if (
        userOne.awg_admin === "mun" ||
        userOne.mun_role === "secretary_office"
      ) {
        Event.updateOne(
          { _id: id },
          { $pull: { photos: { _id: id1 } } }
        ).exec();
        return res.json({ msg: "Photo was deleted successfully" });
      } else {
        const event = await Event.findById({ _id: id });
        const page = await Page.findOne({ name: event.creator });

        if (!page)
          return res.json({
            message: "Only admins can delete this event photos"
          });

        if (
          !(userOne.mun_role == page.role_to_control) &&
          !(userOne.mun_role == event.creator)
        )
          return res.json({ msg: "Photo cannot not be successfully" });
        Event.updateOne(
          { _id: id },
          { $pull: { photos: { _id: id1 } } }
        ).exec();
        return res.json({ msg: "Photo was deleted successfully" });
      }
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);
module.exports = router;
