const Joi = require('joi');
const { User } = require('../models');

const schema = Joi.object({
  user_name: Joi.string().min(8),
  email: Joi.string().email().required(),
  user_password: Joi.string().length(6).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  user_password: Joi.string().required(),
});

// Check if user data to register are correct
const userRegisterDataValidation = async (req, res, next) => {
  const { user_name, email, user_password } = req.body;
  const { error } = schema.validate({ user_name, email, user_password });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
};


// Check if inputs to login contains correct data
const loginDataValidation = async (req, res, next) => {
  const { email, user_password } = req.body;
  const { error } = schemaLogin.validate({ email, user_password });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
};

const emailAlreadyExist = async (req, res, next) => {
  const { email } = req.body;
  const emailFromDB = await User.findOne({ where: { email } });
  if (emailFromDB) {
    return res.status(409).json({
      message: 'User already exist',
    });
  }
  next();
};

module.exports = {
  emailAlreadyExist,
  userRegisterDataValidation,
  loginDataValidation,
};
