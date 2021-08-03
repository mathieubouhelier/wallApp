const { Router } = require('express');
const { userController } = require('../controllers');


const userRouter = Router();

userRouter.get('/', userController.getAllUsers);
// userRouter.post('/login', userController.login);
// userRouter.post('/register', userController.registerUser);

module.exports = { userRouter };
