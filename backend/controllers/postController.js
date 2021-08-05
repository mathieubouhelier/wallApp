const { Posts, User } = require('../models');

const addPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id, displayName } = req.userData;
    const post = { title, content, userId: id };
    await Posts.create(post);
    return res.status(201).json(post);
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: 'Error to post a new post' });
  }
};

module.exports = { addPost };
