const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const { isTaskMember } = require('../middleware/taskAuth');

const { getTask, updateTask, deleteTask } = require('../controllers/taskController');
const { createComment, getComments, deleteComment } = require('../controllers/commentController');


router.get('/:id', protect, isTaskMember('id'), getTask);
router.put('/:id', protect, isTaskMember('id'), updateTask);
router.delete('/:id', protect, isTaskMember('id'), deleteTask);

router.post('/:taskId/comments', protect, isTaskMember('taskId'), createComment);
router.get('/:taskId/comments', protect, isTaskMember('taskId'), getComments);
router.delete('/:taskId/comments/:id', protect, isTaskMember('taskId'), deleteComment);

module.exports = router;