module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('project', {
    name: {
      type: DataTypes.STRING(255)
    },
    location: {
      type: DataTypes.STRING(500)
    },
    start_date: {
      type: DataTypes.DATEONLY
    },
    end_date: {
      type: DataTypes.DATEONLY
    }
  });

  Project.associate = (models) => {
    Project.belongsToMany(models.user, { through: models.administer , foreignKey: 'projectId' });
    Project.belongsToMany(models.worker, { through: { model: models.projectmember, foreignKey: 'projectId' }});
    Project.belongsToMany(models.worker, { through: { model: models.work, unique: false }});
    Project.belongsToMany(models.worker, { through: { model: models.manage, unique: false }});
  }

  return Project;
}