const express = require("express");
const router = express.Router();
const passport = require("passport");
const Gallery = require("../../models/Gallery");
const validator = require("../../validations/galleryValidations");

// get all products
router.get("/", async (req, res) => {
  const gallery = await Gallery.find();
  res.json({ data: gallery });
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
        return res.json({ message: "Only admins can create products" });

      const newGallery = await Gallery.create(req.body);
      res.json({ msg: "Product was created successfully", data: newGallery });
      console.log("ehhh");
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
      const gallery = await Gallery.findOne({ _id: id });
      if (!gallery) return res.json({ message: "Product does not exist" });
      await Gallery.findByIdAndUpdate(gallery, req.body);
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
      const deletedGallery = await Gallery.findByIdAndRemove(id);
      res.json({
        msg: "Product was deleted successfully",
        data: deletedGallery
      });
    } catch (error) {
      return res.json({ msg: error });
    }
  }
);

module.exports = router;
