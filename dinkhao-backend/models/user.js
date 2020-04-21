module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING(255)
    },
    password: {
      type: DataTypes.STRING(255)
    },
    name: {
      type: DataTypes.STRING(100)
    },
    role: {
      type: DataTypes.ENUM("admin", "user")
    }
  });

  User.associate = (models) => {
    User.belongsToMany(models.project, { through: models.administer , foreignKey: 'userId' });
  }

  return User;
}