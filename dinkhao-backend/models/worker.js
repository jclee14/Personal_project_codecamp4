module.exports = (sequelize, DataTypes) => {
  const Worker = sequelize.define('worker', {
    fname: {
      type: DataTypes.STRING(255)
    },
    lname: {
      type: DataTypes.STRING(255)
    },
    wage_rate: {
      type: DataTypes.INTEGER
    },
    gender: {
      type: DataTypes.ENUM("male", "female")
    },
    race: {
      type: DataTypes.STRING(100)
    },
    bank_account_id: {
      type: DataTypes.STRING(50)
    },
    image_url: {
      type: DataTypes.STRING(500)
    },
    phone: {
      type: DataTypes.STRING(20)
    },
    isEmployed: {
      type: DataTypes.BOOLEAN
    },
  });

  Worker.associate = (models) => {
    Worker.belongsToMany(models.project, { through: { model: models.work, unique: false }});
    Worker.belongsToMany(models.project, { through: { model: models.manage, unique: false }});
    Worker.belongsToMany(models.extracharge, { through: { model: models.payback, unique: false }});
  }

  return Worker;
}