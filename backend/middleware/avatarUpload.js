const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MiB
const allowedExt = ['.jpg', '.jpeg', '.png'];
const allowedMime = ['image/jpeg', 'image/png'];

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext) || !allowedMime.includes(file.mimetype)) {
        return cb(new Error('Only .jpg, .jpeg and .png files are allowed'));
    }
    cb(null, true);
};

const avatarUpload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter
});

module.exports = avatarUpload;