const DailyReport = require('../models/DailyReport');
const Project = require('../models/Project');
const User = require('../models/User');
const createDPR = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const { date, work_description, weather, worker_count } = req.body;

    if (!date || !work_description) {
      return res.status(400).json({ error: 'Date and work description are required.' });
    }

    const report = await DailyReport.create({
      project_id: req.params.id,
      user_id: req.user.id,
      date,
      work_description,
      weather,
      worker_count,
    });

    return res.status(201).json({
      message: 'Daily report created successfully.',
      dprId: report.id,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error.', details: err.message });
  }
};

const getDPRsByProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const where = { project_id: req.params.id };
    if (req.query.date) where.date = req.query.date;

    const reports = await DailyReport.findAll({
      where,
      include: [{ model: User, as: 'reporter', attributes: ['id', 'name', 'email'] }],
      order: [['date', 'DESC']],
    });

    return res.status(200).json({ total: reports.length, reports });
  } catch (err) {
    return res.status(500).json({ error: 'Server error.', details: err.message });
  }
};

const deleteDPR = async (req, res) => {
  try {
    const report = await DailyReport.findOne({
      where: { id: req.params.dprId, project_id: req.params.id },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    if (report.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not allowed to delete this report.' });
    }

    await report.destroy();
    return res.status(200).json({ message: 'Report deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error.', details: err.message });
  }
};

module.exports = { createDPR, getDPRsByProject, deleteDPR };
