const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { isProjectMember} = require('../middleware/projectAuth');
const { getProject, updateProject, deleteProject} = require('../controllers/projectController');

router.get('/:id', protect, isProjectMember, getProject);
router.put('/:id', protect, isProjectMember, updateProject);
router.delete('/:id', protect, isProjectMember, deleteProject);

module.exports = router;