const express = require("express");
const router = express.Router();
const passport = require("passport");
const FAQ = require("../../models/FAQ");
const validator = require("../../validations/faqValidations");

// get all FAQs
router.get("/", async (req, res) => {
  const faqs = await FAQ.find();
  res.json({ data: faqs });
});

// get certain Q&A
router.get("/:id", async (request, response) => {
  const id = request.params.id;
  const faq = await FAQ.find({ _id: id });
  response.json({ data: faq });
});

// admins post a Q&A
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (!userOne.is_admin)
        return res.json({ message: "Only admins can add FAQ" });
      const isValidated = validator.createValidation(req.body);
      if (isValidated.error)
        return res.json({ message: "Validations net met" });
      const newFAQ = await FAQ.create(req.body);
      res.json({ msg: "FAQ was created successfully", data: newFAQ });
    } catch (error) {
      return res.json({ msg: error });
    }
  }
);

// admins update FAQ by id
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (!userOne.is_admin)
        return res.json({ message: "Only admins can update FAQ" });
      const id = req.params.id;
      const faq = await FAQ.findOne({ _id: id });
      if (!faq) return res.json({ message: "FAQ not found" });
      const isValidated = validator.updateValidation(req.body);
      if (isValidated.error)
        return res.json({ message: "Validations not met" });
      await FAQ.findByIdAndUpdate(faq, req.body);
      res.json({ msg: "FAQ updated successfully" });
    } catch (error) {
      return res.json({ msg: error });
    }
  }
);

// admins delete FAQ by id
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (!userOne.is_admin)
        return res.json({ message: "Only admins can delete FAQ" });
      const id = req.params.id;
      const deletedFAQ = await FAQ.findByIdAndRemove(id);
      res.json({ msg: "FAQ was deleted successfully", data: deletedFAQ });
    } catch (error) {
      return res.json({ msg: error });
    }
  }
);

module.exports = router;
