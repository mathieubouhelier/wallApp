const createUser = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_name: DataTypes.STRING,
    email: DataTypes.STRING,
    user_password: DataTypes.STRING,
  });
  User.associate = (models) => {
    User.hasMany(models.Posts, { foreignKey: 'id', as: 'user' });
  };
  return User;
};

module.exports = createUser;
