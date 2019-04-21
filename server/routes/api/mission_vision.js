const express = require("express");
const router = express.Router();
const passport = require("passport");
const Mission_Vision = require("../../models/Mission_Vision");
const validator = require("../../validations/mission_visionValidations");

// get all products
router.get("/", async (req, res) => {
  const mission_vision = await Mission_Vision.find();
  res.json({ data: mission_vision });
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

      const newMission_Vision = await Mission_Vision.create(req.body);
      res.json({
        msg: "Product was created successfully",
        data: newMission_Vision
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
      const mission_vision = await Mission_Vision.findById(id);
      if (!mission_vision)
        return res.json({ message: "Product does not exist" });
      await Mission_Vision.findByIdAndUpdate(mission_vision, req.body);
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
      await Mission_Vision.findByIdAndRemove(id);
      res.json({ msg: "Product updated successfully" });
    } catch (error) {
      return res.json({ msg: error });
    }
  }
);

module.exports = router;
