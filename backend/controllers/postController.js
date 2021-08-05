const { Posts, User } = require('../models');

const addPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id, user_name } = req.userData;
    const post = { title, content, userId: id, user_name };
    await Posts.create(post);
    return res.status(201).json(post);
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: 'Error to post a new post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const userId = req.userData.id;
    const postId = req.params.id;
    const post = await Posts.findByPk(postId, {
      include: { model: User, as: 'user' },
    });
    if (post === null) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (userId !== post.userId) {
      return res.status(401).json({ message: 'user not granted' });
    }
    await Posts.destroy({
      where: { id: postId },
    });
    return res.status(204).json({ message: 'Post successfully deleted' });

  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: 'Error to delete the post' });
  }
};

module.exports = { addPost, deletePost };
