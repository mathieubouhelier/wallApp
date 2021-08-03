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

const registerUser = async (req, res) => {
  try {
    const { user_name, email, user_password } = req.body;

    const emailFromDB = await User.create({
      user_name,
      email,
      user_password,
    });
    const { password: _, ...userWithoutPassword } = emailFromDB;
    return res.status(201).json({
      message: 'User registred with success!',
      user: { user_name, email },
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: 'Error to create a new user' });
  }
};


module.exports = {
  getAllUsers,
  registerUser,
};
