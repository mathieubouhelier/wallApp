const { User } = require('../models');
const emailSender = require('../services/emailSender');
const bcrypt = require('bcrypt');
const createToken = require('../services/createJWT');
const SALT = bcrypt.genSaltSync();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Parameters to set nodemailer (email sender)
// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

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

//Add check if email already exist
// Add data format check

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
    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: 'Registered successfully',
    //   text: `Thank you ${user_name} and welcome!`,
    // };

    //module to send email
    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log('Email sent: ' + info.response);
    //   }
    // });

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
  getAllUsers,
  registerUser,
  login,
};
