const { Router } = require('express');
const { postController } = require('../controllers');
const { authJWT } = require('../middleware/auth');

const postsRouter = Router();

postsRouter.post('/', authJWT, postController.addPost);
postsRouter.delete('/:id', authJWT, postController.deletePost);

module.exports = { postsRouter };
