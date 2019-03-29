const express = require("express");
const router = express.Router();
const passport = require("passport");
const Event = require("../../models/Event");
const validator = require("../../validations/eventValidations");
const Page = require("../../models/Page");

//get all events
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json({ data: events });
});

//get event by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const event = await Event.findById(id);
    if (!event) return res.json({ message: "Event does not exist" });

    res.json({ msg: "Event data", data: event });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

// get all feedbacks of certain event by id
router.get("/:id/viewfeedback", async (req, res) => {
  try {
    const id = req.params.id;
    const event = await Event.findById(id);
    res.json({ data: event.feedback });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

// get all photos of certain event by id
router.get("/:id/viewphotos", async (req, res) => {
  try {
    const id = req.params.id;
    const event = await Event.findById(id);
    res.json({ data: event.photos });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});
//uncecked delete tis comment wen testing
// admins create event
router.post(
  "/addevent",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (
        userOne.awg_admin === "mun" ||
        userOne.mun_role === "secretary_office"
      ) {
        const isValidated = validator.createValidation(req.body);
        if (isValidated.error)
          return res.json({ message: "validations not satisfied" });
        const newEvent = await Event.create(req.body);
        res.json({ msg: "Event was created successfully", data: newEvent });
      } else {
        const page = await Page.findOne({ name: req.body.creator });

        if (!page) return res.json({ message: "Page not found" });

        if (
          !(userOne.mun_role == page.role_to_control) &&
          !(userOne.mun_role == req.body.creator)
        )
          return res.json({ msg: "Only authorized admins can create events" });
        const isValidated = validator.createValidation(req.body);
        if (isValidated.error)
          return res.json({ message: "validations not satisfied" });
        const newEvent = await Event.create(req.body);
        res.json({ msg: "Event was created successfully", data: newEvent });
      }
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);
// anonymously post feedback on event by id
router.post("/:id/addfeedback", async (req, res) => {
  try {
    const id = req.params.id;

    const isValidated = validator.createFeedbackValidation(req.body);
    if (isValidated.error) return res.json({ message: "Validations not met" });
    const f = Event.update(
      { _id: id },
      { $push: { feedback: [req.body] } }
    ).exec();
    var count = 0;
    var rating = 0;
    var event = await Event.findById(id);
    event.feedback.forEach(value => {
      rating += value.rating;
      count += 1;
    });
    rating += Number(req.body.rating);
    count += 1;
    console.log(rating);
    console.log(count);
    const result = rating / count;
    console.log(result);
    const e = await Event.findByIdAndUpdate(
      id,
      { rating: result },
      { upsert: false }
    );
    return res.json({ msg: "Feedback was created successfully", data: f });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//admins post photo to event by id
router.post(
  "/:id/addphoto",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const id = req.params.id;
      const userOne = req.user;

      if (
        userOne.awg_admin === "mun" ||
        userOne.mun_role === "secretary_office"
      ) {
        const isValidated = validator.photoValidation(req.body);
        if (isValidated.error) return res.json({ msg: "Validations not met" });
        const e = Event.update(
          { _id: id },
          { $push: { photos: [req.body] } }
        ).exec();
        return res.json({ msg: "Photo added successfully", data: e });
      } else {
        const event = await Event.findById(id);
        const page = await Page.findOne({ name: event.creator });

        if (!page)
          return res.json({
            message: "Only admins can post photos to this event"
          });

        if (
          !(userOne.mun_role == page.role_to_control) &&
          !(userOne.mun_role == event.creator)
        )
          return res.json({
            msg: "Only authorized admins can post photos to this event"
          });
        const isValidated = validator.photoValidation(req.body);
        if (isValidated.error) return res.json({ msg: "Validations not met" });
        const e = Event.update(
          { _id: id },
          { $push: { photos: [req.body] } }
        ).exec();
        return res.json({
          msg: "Photo added to this event successfully",
          data: e
        });
      }
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

//admin Update event by id
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const id = req.params.id;
      const userOne = req.user;

      if (
        userOne.awg_admin === "mun" ||
        userOne.mun_role === "secretary_office"
      ) {
        const isValidated = validator.updateValidation(req.body);
        if (isValidated.error) return res.json({ msg: "Validations not met" });
        const updatedEvent = await Event.updateOne(req.body);
        return res.json({
          msg: "Event updated successfully",
          data: updatedEvent
        });
      } else {
        const event = await Event.findById(id);
        const page = await Page.findOne({ name: event.creator });

        if (!page) return res.json({ msg: "Page not found" });

        if (
          !(userOne.mun_role == page.role_to_control) &&
          !(userOne.mun_role == event.creator)
        )
          return res.json({
            msg: "Only authorized admins can update this event"
          });
        const isValidated = validator.updateValidation(req.body);
        if (isValidated.error) return res.json({ msg: "Validations not met" });
        const updatedEvent = await Event.updateOne(req.body);
        res.json({ msg: "Event updated successfully", data: updatedEvent });
      }
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

//admins delete event by id
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const id = req.params.id;
      const userOne = req.user;

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
          return res.json({
            message: "Page not found"
          });

        if (
          !(userOne.mun_role == page.role_to_control) &&
          !(userOne.mun_role == event.creator)
        )
          return res.json({
            msg: "Only authorized admins can delete this event"
          });
        const deletedEvent = await Event.findByIdAndRemove(id);
        res.json({ msg: "Event was deleted successfully", data: deletedEvent });
      }
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

//admins delete certain feedback of a certain event
router.delete(
  "/:id/:id1/deletefeedback",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const id = req.params.id;
      const id1 = req.params.id1;
      const userOne = req.user;

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
          return res.json({
            message: "Page not found"
          });

        if (
          !(userOne.mun_role == page.role_to_control) &&
          !(userOne.mun_role == event.creator)
        )
          return res.json({
            msg: "Only authorized admins can delete this event feedback"
          });
        Event.update({ _id: id }, { $pull: { feedback: { _id: id1 } } }).exec();
        res.json({ msg: "Feedback was deleted successfully" });
      }
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

//admins delete certain photo of a certain event
router.delete(
  "/:id/:id1/deletephoto",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const id = req.params.id;
      const id1 = req.params.id1;
      const userOne = req.user;

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
          return res.json({
            message: "Page not found"
          });

        if (
          !(userOne.mun_role == page.role_to_control) &&
          !(userOne.mun_role == event.creator)
        )
          return res.json({
            msg: "Only authorized admins can delete this event photo"
          });
        Event.update({ _id: id }, { $pull: { photos: { _id: id1 } } }).exec();
        return res.json({ msg: "Photo was deleted successfully" });
      }
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);
module.exports = router;
