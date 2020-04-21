module.exports = (sequelize, DataTypes) => {
  const ExtraCharge = sequelize.define('extracharge', {
    task: {
      type: DataTypes.STRING(255)
    }
  });

  ExtraCharge.associate = (models) => {
    ExtraCharge.belongsToMany(models.worker, { through: { model: models.payback, unique: false }});
  }

  return ExtraCharge;
}