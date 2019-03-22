const express = require("express");
const router = express.Router();

const Club = require("../../models/Club")
const Event = require("../../models/Event")
const Announcement = require("../../models/Announcements")
const User = require("../../models/User").model;
const validator = require('../../validations/searchSubdomainsValidations')

const hideSecrets = require("../../models/User").hideSecrets;

router.post("/", async (req, res) => {
    try {
        const isValidated = validator.createValidation(req.body)
        if (isValidated.error) return res.status(400).send({ error: isValidated.error.details[0].message })

      const clubs_responded_to_keyword = await Club.find(
        { $text: { $search: req.body.searchkey } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
      console.log(clubs_responded_to_keyword);
      const events_responded_to_keyword = await Event.find(
        { $text: { $search: req.body.searchkey } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
      console.log(events_responded_to_keyword);
      const announcements_responded_to_keyword = await Announcement.find(
        { $text: { $search: req.body.searchkey } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
      console.log(announcements_responded_to_keyword)
      const users_responded_to_keyword = await User.find(
        { $text: { $search: req.body.searchkey } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
      var users_responded_to_keyword_filtered = []
      users_responded_to_keyword.forEach(user => {
        if(user.isPrivate == false) users_responded_to_keyword_filtered.push(hideSecrets(user))
      })
      if (
        clubs_responded_to_keyword.length === 0 &&
        events_responded_to_keyword.length === 0 &&
        announcements_responded_to_keyword.length === 0 &&
        users_responded_to_keyword.length === 0
      )
        return res.send("No relevant data. Try searching with another keyword");
      else
        res.json({
          clubs: clubs_responded_to_keyword ,
          events: events_responded_to_keyword,
          announcements: announcements_responded_to_keyword,
          users: users_responded_to_keyword_filtered
        });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  });

  module.exports = router