const express = require("express");
const router = express.Router();
const passport = require("passport");
const Mun_Development = require("../../models/Mun_Development");
const validator = require("../../validations/mun_developmentValidations");

// get all products
router.get("/", async (req, res) => {
  const mun_developments = await Mun_Development.find();
  res.json({ data: mun_developments });
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

      const newMun_Development = await Mun_Development.create(req.body);
      res.json({
        msg: "Product was created successfully",
        data: newMun_Development
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
      const mun_development = await Mun_Development.findById(id);
      if (!mun_development)
        return res.json({ message: "Product does not exist" });
      await Mun_Development.findByIdAndUpdate(mun_development, req.body);
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
      await Mun_Development.findByIdAndRemove(id);
      res.json({ msg: "Product updated successfully" });
    } catch (error) {
      return res.json({ msg: error });
    }
  }
);

module.exports = router;
