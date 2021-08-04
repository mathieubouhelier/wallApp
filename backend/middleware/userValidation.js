const Joi = require('joi');
const { User } = require('../models');

const schema = Joi.object({
  displayName: Joi.string().min(8),
  email: Joi.string().email().required(),
  password: Joi.string().length(6).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const schemaValidation = Joi.object({
  email: Joi.required(),
  authNumber: Joi.required(),
});

// Check if POST create User request contain correct data
const userDataValidation = async (req, res, next) => {
  const { displayName, email, password } = req.body;
  const { error } = schema.validate({ displayName, email, password });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
};

// Check if POST validation request contain correct data
const emailAuthNumberExist = async (req, res, next) => {
  const { email, authNumber } = req.body;
  const { error } = schemaValidation.validate({ email, authNumber });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
};

// Check if POST Login request contain correct data
const loginDataValidation = async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = schemaLogin.validate({ email, password });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
};

// Check if POST request contain an unique email
const emailAlreadyExist = async (req, res, next) => {
  const { email } = req.body;
  const emailFromDB = await User.findOne({ where: { email } });
  if (emailFromDB) {
    return res.status(409).json({
      message: 'Usuário já existe',
    });
  }
  next();
};

module.exports = {
  emailAlreadyExist,
  userDataValidation,
  loginDataValidation,
  emailAuthNumberExist,
};
