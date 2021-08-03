const { User } = require('../models');

const getAllUsers = async (_req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      error: `Something went wrong error: ${error}`,
    });
  }
};

module.exports = {
  getAllUsers,
};
