const express = require("express");
const router = express.Router();
const passport = require("passport");
const Announcements = require("../../models/Announcements");
const validator = require("../../validations/announcementsValidations");

// get all announcements
router.get("/", async (req, res) => {
  const announcements = await Announcements.find();
  res.json({ data: announcements });
});

// get certain Announcement
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const announcements = await Announcements.find({ _id: id });
  res.json({ data: announcements });
});

// admins create new Announcement
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (!userOne.is_admin) return res.json({ msg: "Only admins can post" });
      const isValidated = validator.createValidation(req.body);
      if (isValidated.error)
        return res.json({ msg: "Validations are not met" });
      const newAnnouncements = await Announcements.create(req.body);
      res.json({
        msg: "Announcement was created successfully",
        data: newAnnouncements
      });
    } catch (error) {
      console.log(error);
    }
  }
);

// admins update announcement by id
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (!userOne.is_admin) return res.json({ msg: "Only admins can update" });
      const id = req.params.id;
      const announcements = await Announcements.find({ id });
      if (!announcements)
        return res.json({ msg: "Announcement doesnot exist" });
      const isValidated = validator.updateValidation(req.body);
      if (isValidated.error)
        return res.json({ msg: "Validations are not met" });
      const updateAnnouncements = await Announcements.updateOne(req.body);
      res.json({ msg: "Announcement updated successfully" });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

// admins delete Announcement by id
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (!userOne.is_admin) return res.json({ msg: "Only admins can delete" });
      const id = req.params.id;
      const deletedAnnouncements = await Announcements.findByIdAndRemove(id);
      res.json({
        msg: "Announcement was deleted successfully",
        data: deletedAnnouncements
      });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

module.exports = router;
