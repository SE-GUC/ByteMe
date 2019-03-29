const express = require("express");
const router = express.Router();
const passport = require("passport");
const Club = require("../../models/Club");
const validator = require("../../validations/clubValidations");

//get all clubs
router.get("/", async (req, res) => {
  const clubs = await Club.find();
  res.json({ data: clubs });
});

//get clubs by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const club = await Club.find({ _id: id });
    if (!club) return res.json({ message: "Club does not exist" });

    res.json({ msg: "Club data", data: club });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//admins create new club
router.post(
  "/addclub",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (!userOne.is_admin)
        return res.json({ message: "Only admins can add clubs" });
      const isValidated = validator.createValidation(req.body);
      if (isValidated.error)
        return res.json({ msg: "validation are not satisfied" });
      const newClub = await Club.create(req.body);
      res.json({ msg: "Club was created successfully", data: newClub });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

//admins update club by id
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;
      if (!userOne.is_admin)
        return res.json({ msg: "Only admins can update clubs" });
      const id = req.params.id;
      const club = await Club.find({ _id: id });
      if (!club) return res.json({ message: "Club does not exist" });
      const isValidated = validator.updateValidation(req.body);
      if (isValidated.error)
        return res.json({ message: "validations are not satisfied" });
      const updatedClub = await Club.updateOne(req.body);
      res.json({ msg: "Club updated successfully", data: updatedClub });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

//admins delete club by id
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (!userOne.is_admin)
        return res.json({ msg: "Only admins can delete clubs" });
      const id = req.params.id;
      const deletedClub = await Club.findByIdAndRemove(id);
      res.json({ msg: "Club was deleted successfully", data: deletedClub });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

module.exports = router;
