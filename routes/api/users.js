const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const User = require("../../models/User");
const validator = require("../../validations/userValidations");

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
    if (req.session.user_id)
      return res.status(400).json({ error: "already logged in" });

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
        req.session.user_id = userWithEmail._id;
        return res.json({ session: req.session });
      } else {
        return res.status(403).json({ error: "wrong password" });
      }
    });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

router.post("/logout", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(400).json({ error: "not logged in" });
    delete req.session.user_id;

    return res.json({ message: "logout successful" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

router.get("/:gucid", async (req, res) => {
  try {
    const guc_id = req.params.gucid;
    var user = await User.findOne({ guc_id });

    var userTwo;
    if (req.session.user_id) userTwo = await User.findById(req.session.user_id);

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

router.put("/giveAdmin", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const isValidated = validator.giveAdminValidation(req.body);
    if (isValidated.error)
      return res
        .status(400)
        .send({ error: isValidated.error.details[0].message });

    const userOne = await User.findById(req.session.user_id);
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
});
//checked
router.put("/give_AWG_Admin", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const isValidated = validator.giveAdminValidation(req.body);
    if (isValidated.error)
      return res
        .status(400)
        .send({ error: isValidated.error.details[0].message });

    var userOne = await User.findById(req.session.user_id);
    const userTwo = await User.findOne({ guc_id: req.body.guc_id });

    if (!userTwo)
      return res.status(404).send({ error: "No user with this guc id" });

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
});

router.put("/forefitAdmin", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const user = await User.findByIdAndUpdate(
      req.session.user_id,
      { is_admin: "false" },
      { upsert: false }
    );
    return res.json({ message: "you are no longer an admin!" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});
//checked
router.put("/forefitawg_Admin", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const user = await User.findByIdAndUpdate(
      req.session.user_id,
      { awg_admin: "none" },
      { upsert: false }
    );
    return res.json({ message: "you are no longer an admin!" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

router.put("/", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const isValidated = validator.updateValidation(req.body);
    if (isValidated.error)
      return res
        .status(400)
        .send({ error: isValidated.error.details[0].message });

    const email = req.body.email;

    const userWithEmail = await User.findOne({ email });
    if (userWithEmail)
      return res
        .status(400)
        .json({ error: "An account with the requested email already exists" });

    const updatedUser = req.body;

    if (updatedUser.password) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(updatedUser.password, salt);
      updatedUser.password = hashedPassword;
    }

    console.log(updatedUser);

    await User.findByIdAndUpdate(req.session.user_id, updatedUser, {
      upsert: false
    });

    const userAfterUpdate = await User.findById(req.session.user_id);

    return res.json({
      message: "user updated!",
      "updated user": userAfterUpdate
    });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

router.delete("/", async (req, res) => {
  try {
    if (!req.session.user_id)
      return res.status(403).send({ error: "You are not logged in" });

    const userOne = await User.findById(req.session.user_id);

    if (!userOne.is_admin) await User.findOneAndDelete({ guc_id });
    else await User.findByIdAndDelete(req.session.user_id);

    return res.json({ message: "user successfuly deleted" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

function hideSecrets(user) {
  const {
    email,
    first_name,
    last_name,
    birth_date,
    guc_id,
    picture_ref,
    is_admin,
    is_private,
    mun_role
  } = user;

  return {
    email: email,
    first_name: first_name,
    last_name: last_name,
    birth_date: birth_date,
    guc_id: guc_id,
    picture_ref: picture_ref,
    is_admin: is_admin,
    is_private: is_private,
    mun_role: mun_role
  };
}
module.exports = router;
