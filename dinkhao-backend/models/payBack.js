module.exports = (sequelize, DataTypes) => {
  const PayBack = sequelize.define('payback', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATEONLY
    },
    price: {
      type: DataTypes.DECIMAL(10,2)
    }
  });

  return PayBack;
}