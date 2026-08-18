const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { checkMember, checkOwner } = require('../middleware/workspaceAuth');
const {
    createWorkspace, getWorkspaces, getWorkspace, updateWorkspace, deleteWorkspace, addMember }
    = require('../controllers/workspaceController');

router.post('/', protect, createWorkspace);
router.get('/', protect, getWorkspaces);
router.get('/:id', protect, checkMember, getWorkspace);
router.put('/:id', protect, checkOwner, updateWorkspace);
router.delete('/:id', protect, checkOwner, deleteWorkspace);
router.post('/:id/members', protect, checkOwner, addMember);

module.exports = router;
