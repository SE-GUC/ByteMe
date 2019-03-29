const express = require("express");
const router = express.Router();
const passport = require("passport");
const Page = require("../../models/Page");
const User = require("../../models/User").model;
const Event = require("../../models/Event");
const validator = require("../../validations/pageValidations");
const eventValidator = require("../../validations/eventValidations");

//get all pages
router.get("/", async (req, res) => {
  const pages = await Page.find();
  res.json({ data: pages });
});

//get certain page by id
router.get("/:id", async (request, response) => {
  const id = request.params.id;
  const page = await Page.find({ _id: id });
  response.json({ data: page });
});

//get events of a certain page by id
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

//get members of a certain page
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

//admins create new page/council
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (!(userOne.awg_admin === "mun"))
        return res.json({ mesage: "Only authorized admins can add councils" });

      const isValidated = validator.createValidation(req.body);
      if (isValidated.error)
        return res.json({ mesage: "validations not satisfied" });
      const newPage = await Page.create(req.body);
      res.json({ msg: "Page was created successfully", data: newPage });
    } catch (error) {
      console.log(error);
    }
  }
);

// admins add events to the page by id
router.post(
  "/:id/events",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      var page = await Page.findById(req.params.id);

      if (
        !(userOne.mun_role === "secretary_office") &&
        !(userOne.mun_role === page.role_to_control) &&
        !(userOne.mun_role === page.name)
      )
        return res.json({
          message: "Only authorized admins can add events to this council"
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
  }
);

// admins add members to council by id
router.post(
  "/:id/members",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      var page = await Page.findById(req.params.id);

      if (
        !(userOne.mun_role === "secretary_office") &&
        !(userOne.mun_role === page.role_to_control) &&
        !(userOne.mun_role === page.name)
      )
        return res.json({
          message: "Only authorized admins can add members to this entity"
        });

      const guc_id = req.body.guc_id;
      const userTwo = await User.findOne({ guc_id: guc_id });
      if (!userTwo)
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
  }
);

// admins assign role to member
router.put(
  "/:id/members/set_role",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userOne = req.user;

    var page = await Page.findById(req.params.id);

    const guc_id = req.body.guc_id;
    const userTwo = await User.findOne({ guc_id: req.body.guc_id });

    if (!(userOne.mun_role === page.name))
      return res.json({ message: "Only authorized admins can assign roles" });

    if (!userTwo)
      return res.json({ message: "A member with this id does not exists" });

    if (!(userTwo.mun_role == "none"))
      return res.json({ message: "This member is already assigned to a role" });

    await User.updateOne(
      { guc_id: guc_id },
      { mun_role: userOne.mun_role },
      { upsert: false }
    );
    const updatedUser = await User.findOne({ guc_id: req.body.guc_id });
    return res.json({ message: "updated!", user: updatedUser });
  }
);

//admins update council by id
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      var page = await Page.findById(req.params.id);

      if (
        !(userOne.mun_role === "secretary_office") &&
        !(userOne.mun_role === page.role_to_control) &&
        !(userOne.mun_role === page.name)
      )
        return res.json({
          message: "Only authorized admins can edit this council"
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
  }
);

//admins delete the whole council by id
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (!(userOne.awg_admin === "mun"))
        return res.json({
          message: "Only authorized admins can delete this council"
        });

      const id = req.params.id;
      const deletedPage = await Page.findByIdAndRemove(id);
      res.json({ message: "Page was deleted successfully", data: deletedPage });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

// admins delete certain members from certain council by id
router.delete(
  "/:id/members/:id1",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      var page = await Page.findById(req.params.id);

      if (
        !(userOne.mun_role === "secretary_office") &&
        !(userOne.mun_role === page.role_to_control) &&
        !(userOne.mun_role === page.name)
      )
        return res.json({
          message: "Only authorized admins can delete members from this council"
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
      res.json({ msg: "Member was deleted successfully" });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

// admins delete certain event from certain council by id
router.delete(
  "/:id/events/:id1",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      var page = await Page.findById(req.params.id);

      if (
        !(userOne.mun_role === "secretary_office") &&
        !(userOne.mun_role === page.role_to_control) &&
        !(userOne.mun_role === page.name)
      )
        return res.json({
          message: "Only authorized admins can delete events from this council"
        });

      const id1 = req.params.id1;
      const deletedEvent = await Event.findByIdAndRemove(id1);
      res.json({
        message: "Event was deleted successfully",
        data: deletedEvent
      });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

module.exports = router;
