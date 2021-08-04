const { Router } = require('express');
const { userController } = require('../controllers');
const userValidation = require('../middleware/userValidation');

const userRouter = Router();

userRouter.get('/', userController.getAllUsers);
userRouter.post(
  '/register',
  userValidation.emailAlreadyExist,
  userValidation.userRegisterDataValidation,
  userController.registerUser,
);
userRouter.post(
  '/login',
  userValidation.loginDataValidation,
  userController.login,
);

module.exports = { userRouter };
