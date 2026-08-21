const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const {isTaskMember} = require('../middleware/taskAuth');

const { getTask, updateTask, deleteTask} = require('../controllers/taskController');

router.get('/:id', protect, isTaskMember, getTask);
router.put('/:id', protect, isTaskMember, updateTask);
router.delete('/:id', protect, isTaskMember, deleteTask);

module.exports = router;