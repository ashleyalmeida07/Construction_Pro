const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

// All project routes require login
router.use(authenticate);

router.post('/', authorize('admin', 'manager'), createProject);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', authorize('admin', 'manager'), updateProject);
router.delete('/:id', authorize('admin'), deleteProject);

module.exports = router;
