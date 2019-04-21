const express = require("express");
const router = express.Router();
const passport = require("passport");
const Form = require("../../models/Form");
const validator = require("../../validations/formValidations");

// get all products
router.get("/", async (req, res) => {
  const form = await Form.find();
  res.json({ data: form });
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

      const newForm = await Form.create(req.body);
      res.json({
        msg: "Product was created successfully",
        data: newForm
      });
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
      const deletedForm = await Form.findByIdAndRemove(id);
      res.json({
        msg: "Product was deleted successfully",
        data: deletedForm
      });
    } catch (error) {
      return res.json({ msg: error });
    }
  }
);

module.exports = router;
