const Joi = require('joi');

const schema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

// Check if POST request contain the correct data
const dataValidation = async (req, res, next) => {
  console.log("dataValidation", req.body);
  const { title, content } = req.body;
  const { error } = schema.validate({ title, content });
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
};

module.exports = {
  dataValidation,
};
