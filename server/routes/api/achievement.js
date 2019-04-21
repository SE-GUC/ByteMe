const express = require("express");
const router = express.Router();
const passport = require("passport");
const Achievement = require("../../models/Achievement");
const validator = require("../../validations/achievementValidations");

// get all products
router.get("/", async (req, res) => {
  const achievements = await Achievement.find();
  res.json({ data: achievements });
});

// get certain product by name using name regex, case insenstive
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const achievement = await Achievement.findById(id);
  res.json({ data: achievement });
});

// admins create a new product
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      const isValidated = validator.createValidation(req.body);
      if (isValidated.error) {
        return res
          .status(400)
          .json({ error: isValidated.error.details[0].message });
      }
      if (
        !(userOne.awg_admin === "mun") &&
        !(userOne.mun_role === "secretary_office")
      )
        return res.json({ message: "Only admins can create achievement" });

      const newAchievement = await Achievement.create(req.body);
      console.log(newAchievement);
      res.json({
        msg: "Product was created successfully",
        data: newAchievement
      });
    } catch (error) {
      return res.json({ msg: error });
    }
  }
);

// admins update the whole product by id
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      const isValidated = validator.updateValidation(req.body);
      if (isValidated.error) {
        return res
          .status(400)
          .json({ error: isValidated.error.details[0].message });
      }

      if (
        !(userOne.awg_admin === "mun") &&
        !(userOne.mun_role === "secretary_office")
      )
        return res.json({ message: "Only admins can update products" });

      const id = req.params.id;
      const achievement = await Achievement.findById(id);
      if (!achievement) return res.json({ message: "Product does not exist" });
      await Achievement.findByIdAndUpdate(achievement, req.body);
      res.json({ msg: "Product updated successfully" });
    } catch (error) {
      return res.json({ msg: error });
    }
  }
);

// admins delete the whole product by id
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (
        !(userOne.awg_admin === "mun") &&
        !(userOne.mun_role === "secretary_office")
      )
        return res.json({ message: "Only admins can delete products" });

      const id = req.params.id;
      const deletedAchievement = await Achievement.findByIdAndRemove(id);
      res.json({
        msg: "Product was deleted successfully",
        data: deletedAchievement
      });
    } catch (error) {
      return res.json({ msg: error });
    }
  }
);

module.exports = router;
