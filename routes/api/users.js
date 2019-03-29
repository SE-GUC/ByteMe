const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../../models/User").model;
const validator = require("../../validations/userValidations");
const tokenKey = require("../../config/keys").secretOrKey;

const hideSecrets = require("../../models/User").hideSecrets;

router.get("/", (req, res) => res.json({ data: "Users working" }));

router.post("/register", async (req, res) => {
  const isValidated = validator.createValidation(req.body);
  if (isValidated.error)
    return res
      .status(400)
      .send({ error: isValidated.error.details[0].message });

  const {
    email,
    first_name,
    last_name,
    birth_date,
    password,
    guc_id,
    picture_ref,
    is_admin,
    is_private,
    mun_role,
    awg_admin
  } = req.body;

  var user = await User.findOne({ email });
  if (user)
    return res
      .status(400)
      .json({ error: "An account with this email already exists" });
  user = await User.findOne({ guc_id });
  if (user)
    return res
      .status(400)
      .json({ error: "An account with this guc id already exists" });

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const newUser = new User({
    email,
    first_name,
    last_name,
    birth_date,
    password: hashedPassword,
    guc_id,
    picture_ref,
    is_admin,
    is_private,
    mun_role,
    awg_admin
  });
  newUser
    .save()
    .then(user => res.json({ data: user }))
    .catch(err => res.json({ error: "Can not create user" }));
});

router.post("/login", async (req, res) => {
  try {
    // if (req.headers.Authorization)
    //   if (req.headers.Authorization.email === req.body.email)
    //     return res.status(400).json({ error: "already logged in" });

    const isValidated = validator.basicValidation(req.body);
    if (isValidated.error)
      return res
        .status(400)
        .send({ error: isValidated.error.details[0].message });

    const email = req.body.email;
    const password = req.body.password;

    const userWithEmail = await User.findOne({ email });
    if (!userWithEmail)
      return res.status(404).send({ error: "No user with this email" });

    const dbHash = userWithEmail["password"];

    bcrypt.compare(password, dbHash, async (err, match) => {
      if (match) {
        const payload = {
          id: userWithEmail.id,
          name: userWithEmail.name,
          email: userWithEmail.email
        };
        const token = jwt.sign(payload, tokenKey, { expiresIn: "1h" });
        //console.log(req.user.email);
        return res.json({ data: `Bearer ${token}` });
      } else {
        return res.status(403).json({ error: "wrong password" });
      }
    });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      //req.logOut();
      return res.json({ message: "logout successful" });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

router.get("/:gucid", async (req, res) => {
  try {
    const guc_id = req.params.gucid;
    var user = await User.findOne({ guc_id });

    var userTwo;
    if (req.user.user_id) userTwo = await User.findById(req.user.user_id);

    if (!user)
      return res.status(404).send({ error: "No user with this guc id" });
    if (
      user.is_private &&
      (!userTwo || (!userTwo.is_admin && !userTwo.guc_id == user.guc_id))
    )
      return res.status(403).send({ message: "this user is private" });

    res.json({ data: hideSecrets(user) });
  } catch (error) {
    console.log(error);
  }
});

router.put(
  "/giveAdmin",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const isValidated = validator.giveAdminValidation(req.body);
      if (isValidated.error)
        return res
          .status(400)
          .send({ error: isValidated.error.details[0].message });

      const userOne = req.user;
      const userTwo = await User.findOne({ guc_id: req.body.guc_id });

      if (!userOne.is_admin)
        return res.status(403).send({ error: "This user is not an admin" });
      if (!userTwo)
        return res.status(404).send({ error: "No user with this guc id" });

      await User.updateOne(
        { guc_id: req.body.guc_id },
        { is_admin: true },
        { upsert: false }
      );
      const updatedUser = await User.findOne({ guc_id: req.body.guc_id });
      return res.json({ message: "updated!", user: updatedUser });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

router.put(
  "/give_AWG_Admin",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const isValidated = validator.giveAdminValidation(req.body);
      if (isValidated.error)
        return res
          .status(400)
          .send({ error: isValidated.error.details[0].message });

      var userOne = req.user;
      const userTwo = await User.findOne({ guc_id: req.body.guc_id });

      if (!userTwo)
        return res.status(404).send({ error: "No user with this guc id" });

      if (userOne.awg_admin === "none")
        return res.json({ message: "cannot give his role" });

      await User.updateOne(
        { guc_id: req.body.guc_id },
        { awg_admin: userOne.awg_admin },
        { upsert: false }
      );
      const updatedUser = await User.findOne({ guc_id: req.body.guc_id });
      return res.json({ message: "updated!", user: updatedUser });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

router.put(
  "/forefitAdmin",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user,
        { is_admin: "false" },
        { upsert: false }
      );
      return res.json({ message: "you are no longer an admin!" });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);
//checked
router.put(
  "/forefitawg_Admin",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user,
        { awg_admin: "none" },
        { upsert: false }
      );
      return res.json({ message: "you are no longer an admin!" });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.query.gucid) {
        //editing someone else
        try {
          const loggedUser = req.user;
          if (!loggedUser.is_admin)
            return res.status(403).send({ error: "You are not an admin!" });

          const guc_id = req.query.gucid;
          var userTwo = await User.findOne({ guc_id });
          if (!userTwo)
            return res.status(404).send({ error: "No user with this guc id" });

          const isValidated = validator.updateValidation(req.body);
          if (isValidated.error)
            return res
              .status(400)
              .send({ error: isValidated.error.details[0].message });

          const email = req.body.email;

          const userWithEmail = await User.findOne({ email });
          if (userWithEmail)
            return res.status(400).json({
              error: "An account with the requested email already exists"
            });

          const updatedUser = req.body;

          if (updatedUser.password) {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(updatedUser.password, salt);
            updatedUser.password = hashedPassword;
          }

          console.log(updatedUser);

          await User.findOneAndUpdate(
            { guc_id: req.params.gucid },
            updatedUser,
            {
              upsert: false
            }
          );

          const userAfterUpdate = await User.findOne({ guc_id: guc_id });

          return res.json({
            message: "user updated!",
            "updated user": userAfterUpdate
          });
        } catch (error) {
          // We will be handling the error later
          console.log(error);
        }
      } else {
        //editing yourself

        const isValidated = validator.updateValidation(req.body);
        if (isValidated.error)
          return res
            .status(400)
            .send({ error: isValidated.error.details[0].message });

        const email = req.body.email;

        const userWithEmail = await User.findOne({ email });
        if (userWithEmail)
          return res.status(400).json({
            error: "An account with the requested email already exists"
          });

        const updatedUser = req.body;

        if (updatedUser.password) {
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(updatedUser.password, salt);
          updatedUser.password = hashedPassword;
        }

        console.log(updatedUser);

        await User.findByIdAndUpdate(req.user, updatedUser, {
          upsert: false
        });

        const userAfterUpdate = req.user;

        return res.json({
          message: "user updated!",
          "updated user": userAfterUpdate
        });
      }
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);
//:user_id
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userOne = req.user;

      if (!userOne.is_admin) await User.findOneAndDelete({ guc_id });
      else await User.findByIdAndDelete(req.user.user_id);

      return res.json({ message: "user successfuly deleted" });
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);

module.exports = router;
