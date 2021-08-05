const { Router } = require('express');
const { postController } = require('../controllers');
const { authJWT } = require('../middleware/auth');
const postValidation = require('../middleware/postValidation');

const postsRouter = Router();

postsRouter.post('/', authJWT, postValidation.dataValidation, postController.addPost);
postsRouter.delete('/:id', authJWT, postController.deletePost);
postsRouter.put('/:id', authJWT, postValidation.dataValidation, postController.deletePost);

module.exports = { postsRouter };
