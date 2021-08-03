const { Router } = require('express');
const { userController } = require('../controllers');

const usersRouter = Router();

usersRouter.post('/login', userController.login);
usersRouter.post('/register', userController.registerUser);

module.exports = { usersRouter };
