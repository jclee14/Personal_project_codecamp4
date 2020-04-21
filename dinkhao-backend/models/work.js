module.exports = (sequelize, DataTypes) => {
  const Works = sequelize.define('work', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATEONLY
    },
    current_rate: {
      type: DataTypes.INTEGER
    },
    normal_morning_hr: {
      type: DataTypes.DECIMAL(10,2)
    },
    normal_afternoon_hr: {
      type: DataTypes.DECIMAL(10,2)
    },
    ot_early_hr: {
      type: DataTypes.DECIMAL(10,2)
    },
    ot_noon_hr: {
      type: DataTypes.DECIMAL(10,2)
    },
    ot_evening_hr: {
      type: DataTypes.DECIMAL(10,2)
    },
    ot_night_hr: {
      type: DataTypes.DECIMAL(10,2)
    },
    wage_earning: {
      type: DataTypes.INTEGER
    }
  });

  Works.associate = (models) => {
    Works.belongsTo(models.workerjob);
  }

  return Works;
}