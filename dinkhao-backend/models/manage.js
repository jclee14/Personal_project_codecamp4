module.exports = (sequelize, DataTypes) => {
  const Manages = sequelize.define('manage', {
    start_date: {
      type: DataTypes.DATEONLY
    }
  });

  Manages.associate = (models) => {
    Manages.belongsTo(models.workerjob);
  }

  return Manages;
}