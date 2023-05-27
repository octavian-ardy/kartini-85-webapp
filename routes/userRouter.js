const router = require("express").Router();
const userRepo = require("../repositories/userRepository");
const errorLogger = require("../helper/errorLogger");
const Joi = require("joi");
const Salty = require("../helper/saltyHelper");

const schema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  repeat_password: Joi.string().required().valid(Joi.ref("password")),
  phone: Joi.string().required(),
  telegramID: Joi.string(),
});

const schemaedit = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  telegramID: Joi.string().required(),
  role: Joi.string().required(),
  isActive: Joi.boolean().required(),
  isPermit: Joi.boolean().required(),
  isDeleted: Joi.boolean().required(),
});

// User routes
router.get("/", async (req, res) => {
  try {
    const result = await userRepo.getUser({});

    if (Object.keys(result).length != 0) {
      return res.send(result);
    } else {
      return res.status(400).send({ message: "No user data." });
    }
  } catch (err) {
    const errmsg = errorLogger.logger(err, err.message);
    return res.status(500).send(errmsg);
  }
});
router.get("/:email", async (req, res) => {
  try {
    if (
      Object.keys(req.params).length == 0 &&
      Object.keys(req.params)[0] == "email"
    )
      return res.status(400).send({ message: "Email is not provided." });

    const result = await userRepo.getOneUser({ email: req.params.email });

    if (result != null && Object.keys(result).length != 0) {
      return res.send(result);
    } else {
      return res.status(400).send({ message: "No user data." });
    }
  } catch (err) {
    const errmsg = errorLogger.logger(err, err.message);
    return res.status(500).send(errmsg);
  }
});

router.post("/", async (req, res) => {
  try {
    const schemaresult = schema.validate(req.body);
    if ("error" in schemaresult) {
      let msg = "";
      schemaresult.error.details.forEach((element) => {
        msg = msg + element.message + ". ";
      });
      return res.status(400).send({
        message: msg,
        joidetails: schemaresult.error.details,
      });
    }

    schemaresult.value.salt = Salty.generateSalt();
    schemaresult.value.password = Salty.generateHashedPassword(
      schemaresult.value.password,
      schemaresult.value.salt
    );
    schemaresult.value.phone = schemaresult.value.phone.replace(/\s/g, "");
    if (schemaresult.value.phone.charAt(0) == "0") {
      schemaresult.value.phone = "+62" + schemaresult.value.phone.substring(1);
    } else if (schemaresult.value.phone.charAt(0) == "8") {
      schemaresult.value.phone = "+62" + schemaresult.value.phone;
    }
    delete schemaresult.value.repeat_password;

    const result = await userRepo.createUser(schemaresult.value);

    if (Object.keys(result).length != 0) {
      return res.send(result);
    } else {
      return res
        .status(400)
        .send({ message: "No user created. Check input field." });
    }
  } catch (err) {
    const errmsg = errorLogger.logger(err, err.message);
    return res.status(500).send(errmsg);
  }
});
router.put("/:email", async (req, res) => {
  try {
    if (
      Object.keys(req.params).length == 0 &&
      Object.keys(req.params)[0] == "email"
    )
      return res.status(400).send({ message: "Email is not provided." });

    const schemaresult = schemaedit.validate(req.body);
    if ("error" in schemaresult) {
      let msg = "";
      schemaresult.error.details.forEach((element) => {
        msg = msg + element.message + ". ";
      });
      return res.status(400).send({
        message: msg,
        joidetails: schemaresult.error.details,
      });
    }
    schemaresult.value.phone = schemaresult.value.phone.replace(/\s/g, "");
    if (schemaresult.value.phone.charAt(0) == "0") {
      schemaresult.value.phone = "+62" + schemaresult.value.phone.substring(1);
    } else if (schemaresult.value.phone.charAt(0) == "8") {
      schemaresult.value.phone = "+62" + schemaresult.value.phone;
    }

    const updateresult = await userRepo.updateOneUser(
      { email: req.params.email },
      schemaresult.value
    );
    if (updateresult == null) {
      return res.status(400).send({ message: "No data updated" });
    } else {
      updateresult.password = undefined;
      updateresult.salt = undefined;
      res.send(updateresult);
    }
  } catch (err) {
    const errmsg = errorLogger.logger(err, err.message);
    return res.status(500).send(errmsg);
  }
});

module.exports = router;
