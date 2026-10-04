const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const {getMe} = require('../controllers/authController');
const avatarUpload = require('../middleware/avatarUpload');
const {updateAvatar} = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/me',protect, getMe)

router.patch('/avatar', protect, avatarUpload.single('file'), updateAvatar);

module.exports = router;