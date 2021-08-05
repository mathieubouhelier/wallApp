const { User } = require('../models');
const emailSender = require('../services/emailSender');
const bcrypt = require('bcrypt');
const createToken = require('../services/createJWT');
const SALT = bcrypt.genSaltSync();

const registerUser = async (req, res) => {
  try {
    const { user_name, email, user_password } = req.body;

    const emailFromDB = await User.create({
      user_name,
      email,
      user_password: bcrypt.hashSync(user_password, SALT),
    });
    const { password: _, ...userWithoutPassword } = emailFromDB;
    const token = await createToken(userWithoutPassword);

    emailSender(email, user_name);

    return res.status(201).json({
      message: 'User registered with success!',
      user: { user_name, email },
      token,
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: 'Error to create a new user' });
  }
};

const login = async (req, res) => {
  try {
    const { email, user_password } = req.body;
    const userFromDB = await User.findOne({ where: { email } });

    const isPasswordValid = await bcrypt.compare(
      user_password,
      userFromDB.user_password,
    );

    if (!userFromDB || !isPasswordValid) {
      return res.status(400).json({ message: 'Invalid login and/or password' });
    }

    const { user_password: _, ...userWithoutPassword } = userFromDB;
    const token = await createToken(userWithoutPassword);

    return res.status(201).json({ token }); //201 ????
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: 'Error to login process' });
  }
};

module.exports = {
  registerUser,
  login,
};
