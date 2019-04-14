const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Page = require("../../models/Page");
const User = require("../../models/User").model;
const Event = require("../../models/Event");
const validator = require("../../validations/pageValidations");

//1) get all the pages
router.get("/", async (req, res) => {
  const pages = await Page.find();
  res.json({ data: pages });
});

router.get("/:id", async (request, response) => {
  const id = request.params.id;
  const page = await Page.find({ _id: id });
  response.json({ data: page });
});

//2) get specific page with id
router.get("/:id/events", async (req, res) => {
  try {
    const id = req.params.id;
    var page = await Page.findById(id);
    const events = await Event.find({ creator: page.name });
    res.json({ data: events });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//3) get all members of this page by matching it's mun_role to be the page's name or the page's name_member
router.get("/:id/members", async (req, res) => {
  try {
    const id = req.params.id;
    const page = await Page.findById(id);
    var members1 = await User.find({ mun_role: page.name });
    var members2 = await User.find({ mun_role: `${page.name}_member` });
    members2.forEach(value => {
      members1.push(value);
    });
    res.json({ data: members1 });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//4) post a new mun council/committee/office only by user which is mun admin or secretary office
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (
        !(
          userOne.awg_admin === "mun" ||
          user.One.mun_role === "secretary_office"
        )
      )
        return res.json({ msg: "Only mun admins can add councils" });

      const isValidated = validator.createValidation(req.body);
      if (isValidated.error)
        return res.json({ msg: "validations not satisfied" });
      const newPage = await Page.create(req.body);
      res.json({ msg: "Page was created successfully", data: newPage });
    } catch (error) {
      console.log(error);
    }
  }
);
//5) add member to the page by secretary_office/executive member controlling it/one of the page's heads
router.post(
  "/:id/members",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;
      const id = req.params.id;
      var page = await Page.findById(id);

      if (
        !(userOne.mun_role === "secretary_office") &&
        !(userOne.mun_role === page.role_to_control) &&
        !(userOne.mun_role === page.name)
      ) {
        return res.json({
          msg: "Only MUN admins can add members to this entity"
        });
      }

      const guc_id = req.body.guc_id;
      const user = await User.findOne({ guc_id: guc_id });
      if (!user)
        return res.json({ msg: "A student with this id does not exists" });

      if (!(user.mun_role === "none"))
        return res.json({ msg: "already has mun role" });

      const isValidated = validator.addMemberValidation(req.body);
      if (isValidated.error)
        return res.json({ msg: "validations not satisfied" });

      await Page.updateOne(
        { _id: id },
        { $push: { members: [req.body] } }
      ).exec();
      await User.updateOne(
        { guc_id: guc_id },
        { mun_role: `${page.name}_member` },
        { upsert: false }
      );
      var page1 = await Page.findById(id);
      var x = page1.members[0]._id;
      res.json({ msg: "Member was added successfully", data: x });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);
//6) assign role to one of the page's members to be a head for this page as me
router.put(
  "/:id/members/set_role",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userOne = req.user;
    const id = req.params.id;
    var page = await Page.findById(id);

    const guc_id = req.body.guc_id;
    const user = await User.findOne({ guc_id: guc_id });

    if (!(userOne.mun_role === page.name))
      return res.json({ msg: "Cannot assign" });

    if (!user)
      return res.json({ msg: "A member with this id does not exists" });

    if (user.mun_role === page.name)
      return res.json({ msg: "role already assigned" });

    await User.updateOne(
      { guc_id: guc_id },
      { mun_role: userOne.mun_role },
      { upsert: false }
    );
    const updatedUser = await User.findOne({ guc_id: guc_id });
    return res.json({ msg: "updated!", user: updatedUser });
  }
);

//7) update pages name , role to control , description when the pages name changed all of it's people mun role should be changed in consequence
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;
      const id = req.params.id;
      var page = await Page.findById(id);

      if (
        !(userOne.mun_role === "secretary_office") &&
        !(userOne.mun_role === page.role_to_control) &&
        !(userOne.mun_role === page.name)
      )
        return res.json({
          msg: "Only admins can update this entity"
        });

      const isValidated = validator.updateValidation(req.body);
      if (isValidated.error)
        return res.json({ message: "validations not satisfied" });

      await User.update(
        { mun_role: page.name },
        { mun_role: req.body.name },
        { upsert: false }
      );
      await User.updateOne(
        { mun_role: `${page.name}_member` },
        { mun_role: `${req.body.name}_member` },
        { upsert: false }
      );
      const updatedPage = await Page.update({ _id: id }, req.body);

      res.json({ msg: "updated", data: updatedPage });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

//8) delete this page by mun admin or secretary office
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;
      const id = req.params.id;
      var page = await Page.findById(id);
      if (
        !(
          userOne.awg_admin === "mun" ||
          userOne.mun_role === "secretary_office" ||
          userOne.mun_role === page.role_to_control ||
          userOne.mun_role === page.name
        )
      )
        return res.json({
          msg: "Only admins can delete this entity"
        });

      await User.update(
        { mun_role: page.name },
        { mun_role: "none" },
        { upsert: false }
      );
      await User.updateOne(
        { mun_role: `${page.name}_member` },
        { mun_role: "none" },
        { upsert: false }
      );
      const deletedPage = await Page.findByIdAndRemove(id);
      res.json({ msg: "Page was deleted successfully", data: deletedPage });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

//9) remove members for this page by secretary_office/executive/head's of this page passing it's guc_id in the request
router.delete(
  "/:id/members/:id2",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;
      const id = req.params.id;
      var page = await Page.findById(id);

      if (
        !(userOne.mun_role === "secretary_office") &&
        !(userOne.mun_role === page.role_to_control) &&
        !(userOne.mun_role === page.name)
      )
        return res.json({
          msg: "Only admins can delete members to this entity"
        });
      const id2 = req.params.id2;
      const user = await User.findOne({ guc_id: id2 });

      if (!user)
        return res.json({ msg: "A member with this id does not exists" });

      await User.updateOne(
        { guc_id: id2 },
        { mun_role: "none" },
        { upsert: false }
      );

      Page.updateOne(
        { _id: id },
        { $pull: { members: { guc_id: id2 } } }
      ).exec();
      res.json({ msg: "Members was deleted successfully" });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

module.exports = router;
