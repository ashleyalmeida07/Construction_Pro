const Project = require('../models/Project');
const User = require('../models/User');
const DailyReport = require('../models/DailyReport');

const createProject = async (req, res) => {
  try {
    const { name, description, start_date, end_date, status } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required.' });
    }

    const project = await Project.create({
      name,
      description,
      start_date,
      end_date,
      status: status || 'planned',
      created_by: req.user.id,
    });

    return res.status(201).json({
      message: 'Project created successfully.',
      projectId: project.id,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error.', details: err.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;

    const where = {};
    if (status) where.status = status;

    const projects = await Project.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }],
    });

    return res.status(200).json({ total: projects.length, projects });
  } catch (err) {
    return res.status(500).json({ error: 'Server error.', details: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: DailyReport, include: [{ model: User, as: 'reporter', attributes: ['id', 'name'] }] },
      ],
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    return res.status(200).json({ project });
  } catch (err) {
    return res.status(500).json({ error: 'Server error.', details: err.message });
  }
};

// PUT /projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const { name, description, start_date, end_date, status } = req.body;
    await project.update({ name, description, start_date, end_date, status });

    return res.status(200).json({ message: 'Project updated successfully.', project });
  } catch (err) {
    return res.status(500).json({ error: 'Server error.', details: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    await project.destroy();
    return res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error.', details: err.message });
  }
};

module.exports = { createProject, getAllProjects, getProjectById, updateProject, deleteProject };
