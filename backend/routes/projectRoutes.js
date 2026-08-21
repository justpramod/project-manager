const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { isProjectMember} = require('../middleware/projectAuth');
const { getProject, updateProject, deleteProject} = require('../controllers/projectController');

const { createTask, getTasks } = require('../controllers/taskController');

router.get('/:id', protect, isProjectMember('id'), getProject);
router.put('/:id', protect, isProjectMember('id'), updateProject);
router.delete('/:id', protect, isProjectMember('id'), deleteProject);

router.post('/:projectId/tasks', protect, isProjectMember('projectId'),createTask);
router.get('/:projectId/tasks', protect, isProjectMember('projectId'), getTasks );
module.exports = router;