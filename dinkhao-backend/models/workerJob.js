module.exports = (sequelize, DataTypes) => {
  const WorkerJob = sequelize.define('workerjob', {
    name: {
      type: DataTypes.STRING(255)
    }
  });

  WorkerJob.associate = (models) => {
    WorkerJob.hasMany(models.work);
    WorkerJob.hasMany(models.manage);
  }

  return WorkerJob;
}