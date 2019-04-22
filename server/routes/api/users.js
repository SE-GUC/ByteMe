const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../../models/User").model;
const validator = require("../../validations/userValidations");
const tokenKey = require("../../config/keys").secretOrKey;
const emailer = require("../../emailer");

const hideSecrets = require("../../models/User").hideSecrets;

router.get("/", (req, res) => res.json({ data: "Users Route Online" }));
router.get("/role/:role", async (req, res) => {
  try {
    const role = req.params.role;
    if (role === "none")
      return res.status("400").json({ error: "You can't look for this role!" });
    const users_with_roles = await User.find({ mun_role: role });
    if (users_with_roles.length === 0)
      return res.json({ message: "No users assigned to this role" });
    res.json({
      msg: "Users assigned to this role",
      data: users_with_roles.map(user => {
        return hideSecrets(user);
      })
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req, res) => {
  const isValidated = validator.createValidation(req.body);
  if (isValidated.error)
    return res
      .status(400)
      .send({ error: isValidated.error.details[0].message });

  var {
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

  email = email.toLowerCase();

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
    const isValidated = validator.basicValidation(req.body);
    if (isValidated.error)
      return res
        .status(400)
        .send({ error: isValidated.error.details[0].message });

    const email = req.body.email.toLowerCase();
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
        return res.json({ data: `Bearer ${token}` });
      } else {
        return res.status(403).json({ error: "wrong password" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      return res.json({ message: "logout successful" });
    } catch (error) {
      console.log(error);
    }
  }
);
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      res.json({ data: hideSecrets(req.user) });
    } catch (err) {
      console.log(error);
    }
  }
);

router.get("/:gucid", async (req, res) => {
  try {
    const guc_id = req.params.gucid;
    var user = await User.findOne({ guc_id });

    if (!user)
      return res.status(404).send({ error: "No user with this guc id" });
    if (user.is_private)
      return res.status(403).send({ message: "this user is private" });

    res.json({ data: hideSecrets(user) });
  } catch (error) {
    console.log(error);
  }
});

router.get(
  "/asAdmin/:gucid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const guc_id = req.params.gucid;
      var user = await User.findOne({ guc_id });
      var userTwo = req.user;

      if (!user)
        return res.status(404).send({ error: "No user with this guc id" });
      if (user.is_private && !userTwo.is_admin && user.email != userTwo.email)
        return res.status(403).send({ message: "this user is private" });

      res.json({ data: hideSecrets(user) });
    } catch (error) {
      console.log(error);
    }
  }
);

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
      console.log(error);
    }
  }
);

router.put(
  "/give_awgAdmin",
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
        return res.status(404).json({ error: "No user with this guc id" });

      if (userOne.awg_admin === "none")
        return res
          .status(403)
          .json({ error: "this user is not an admin of any AWG" });

      if (userTwo.awg_admin !== "none")
        return res
          .status(403)
          .json({ error: "that user is an admin of an AWG" });

      await User.updateOne(
        { guc_id: req.body.guc_id },
        { awg_admin: userOne.awg_admin },
        { upsert: false }
      );
      const updatedUser = await User.findOne({ guc_id: req.body.guc_id });
      return res.json({ message: "updated!", user: updatedUser });
    } catch (error) {
      console.log(error);
    }
  }
);

router.put(
  "/forefitAdmin",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(
        req.user,
        { is_admin: "false" },
        { upsert: false }
      );
      return res.json({ message: "you are no longer an admin!" });
    } catch (error) {
      console.log(error);
    }
  }
);

router.put(
  "/forefit_awgAdmin",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(
        req.user,
        { awg_admin: "none" },
        { upsert: false }
      );
      return res.json({ message: "you are no longer an admin!" });
    } catch (error) {
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

          const email = req.body.email
            ? req.body.email.toLowerCase()
            : req.body.email;

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

          await User.findOneAndUpdate({ guc_id: guc_id }, updatedUser, {
            upsert: false
          });

          const userAfterUpdate = await User.findOne({ guc_id: guc_id });

          return res.json({
            message: "user updated!",
            "updated user": userAfterUpdate
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        //editing yourself

        const isValidated = validator.updateValidation(req.body);
        if (isValidated.error)
          return res
            .status(400)
            .send({ error: isValidated.error.details[0].message });

        const email = req.body.email
          ? req.body.email.toLowerCase()
          : req.body.email;

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

        await User.findByIdAndUpdate(req.user, updatedUser, {
          upsert: false
        });

        const userAfterUpdate = await User.findById(req.user);

        return res.json({
          message: "user updated!",
          "updated user": userAfterUpdate
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.query.gucid) {
        const userOne = req.user;
        if (!userOne.is_admin)
          return res.status(403).json({ error: "User is not an Admin" });
        const userToDel = await User.findOne({ guc_id: req.query.gucid });
        if (!userToDel)
          return res.status(400).json({ error: "No user with this guc id" });
        await User.findByIdAndDelete(userToDel);
        return res.json({ message: "User deleted!" });
      } else {
        await User.findByIdAndDelete(req.user);
        return res.json({ message: "User deleted!" });
      }
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  }
);
const randomString = length => {
  let text = "";
  const possible = "abcdefghijklmnopqrstuvwxyz0123456789_-.";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

router.put("/forgotpass", (req, res) => {
  if (!req.body) return res.status(400).json({ message: "No request body" });
  if (!req.body.email)
    return res.status(400).json({ message: "No Email request body" });
  const token = randomString(40);
  const emailData = {
    to: req.body.email,
    subject: "AWG reset Password",
    text: `Please use the following link to reset your password: gucmun.me/resetpass/${token}`,
    html: `<p>Please use the following link to reset your password:</p><p>gucmun.me/resetpass/${token}</p>`
  };
  return User.findOneAndUpdate(
    { email: req.body.email.toLowerCase() },
    { $set: { resetPassLink: token } },
    function(error, feedback) {
      if (error) return res.send(error);
      else {
        emailer.sendEmail(emailData);
        return res
          .status(200)
          .json({ message: `Email sent to: ${req.body.email}` });
      }
    }
  );
});

router.put("/resetpass", (req, res) => {
  const { resetPassLink, newPassword } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(newPassword, salt);
  return User.findOneAndUpdate(
    { resetPassLink },
    { $set: { password: hashedPassword, resetPassLink: "" } },
    function(error, feedback) {
      if (error) return res.send(error);
      return res.send(feedback);
    }
  );
});

module.exports = router;
