const { Router } = require('express');
const { userController } = require('../controllers');

const userRouter = Router();

userRouter.get('/', userController.getAllUsers);
userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.login);

module.exports = { userRouter };
