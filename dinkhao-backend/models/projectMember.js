module.exports = (sequelize, DataTypes) => {
  const ProjectMember = sequelize.define('projectmember');
  return ProjectMember;
}