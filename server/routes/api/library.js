const express = require("express");
const router = express.Router();
const passport = require("passport");
const Library = require("../../models/Library");
const validator = require("../../validations/libraryValidations");

// Return all library entries
router.get("/", async (req, res) => {
  try {
    const library = await Library.find();
    res.json({ data: library });
  } catch (error) {
    res.sendStatus(400).json(error);
  }
});

// get certain library entry using name regex, case insenstive
router.get("/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const library = await Library.find({
      name: { $regex: name, $options: "i" }
    });
    res.json({ data: library });
  } catch (error) {
    res.sendStatus(400).json(error);
  }
});

//filtering library by year
router.get("/filter/:year", async (req, res) => {
  try {
    const filter_year = req.params.year;
    const library = await Library.find({
      year: filter_year
    });

    res.json({ data: library });
  } catch (error) {
    res.sendStatus(400).json(error);
  }
});

// admins post a new library entry
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (
        !(userOne.awg_admin === "mun") &&
        !(userOne.mun_role === "secretary_office")
      )
        return res.json({
          message: "Only authorized admins can create new library entry"
        });

      const isValidated = await validator.createValidation(req.body);
      if (isValidated.error)
        return res
          .status(400)
          .json({ error: isValidated.error.details[0].message });
      const newLibrary = await Library.create(req.body);
      res.json({ msg: "Entry was created successfully", data: newLibrary });
    } catch (error) {
      res.sendStatus(400).json(error);
    }
  }
);

// admins update a library entry by id
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (
        !(userOne.awg_admin === "mun") &&
        !(userOne.mun_role === "secretary_office")
      )
        return res.json({
          message: "Only authorized admins can update library"
        });

      const id = req.params.id;
      const library = await Library.findOne({ _id: id });

      if (!library)
        return res
          .status(404)
          .json({ error: "Academic Paper requested was not found." });
      const isValidated = validator.updateValidation(req.body);
      if (isValidated.error)
        return res
          .status(400)
          .send({ error: isValidated.error.details[0].message });
      await Library.findByIdAndUpdate(library, req.body);
      res.json({ msg: "Entry updated successfully" });
    } catch (error) {
      res.sendStatus(400).json(error);
    }
  }
);

// admins delete a library entry by id
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
        return res.json({
          message: "Only authorized admins can delete library entries"
        });

      const id = req.params.id;
      const deletedLibrary = await Library.findByIdAndRemove(id);
      res.json({
        msg: "Academic paper was deleted successfully",
        data: deletedLibrary
      });
    } catch (error) {
      res.sendStatus(400).json(error);
    }
  }
);

module.exports = router;
