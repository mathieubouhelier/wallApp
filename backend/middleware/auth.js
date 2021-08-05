const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

const authJWT = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'missing auth token' });
    }
    const data = jwt.verify(token, secret);
    const { user_password: _, ...dataWithoutPassword } = data;
    req.userData = dataWithoutPassword
    console.log(req.userData );
    next();
  } catch (err) {
    return res.status(401).json({ message: 'jwt malformed' });
  }
};

module.exports = { authJWT };
