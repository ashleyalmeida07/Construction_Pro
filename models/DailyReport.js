const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Project = require('./Project');
const User = require('./User');

const DailyReport = sequelize.define('DailyReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'projects', key: 'id' },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  work_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  weather: {
    type: DataTypes.STRING,
  },
  worker_count: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'daily_reports',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

// Relationships
DailyReport.belongsTo(Project, { foreignKey: 'project_id' });
DailyReport.belongsTo(User, { foreignKey: 'user_id', as: 'reporter' });
Project.hasMany(DailyReport, { foreignKey: 'project_id' });

module.exports = DailyReport;
