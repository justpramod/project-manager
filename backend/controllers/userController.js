const fs = require('fs').promises;
const path = require('path');
const User = require('../models/User');

const updateAvatar = async (req, res) => {
    try {

        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const { filename, mimetype, size } = req.file;

        const url = `/uploads/${filename}`;

        const prevAvatarUrl = req.user.avatarUrl;
        const user = await User.findOneAndUpdate({ _id: req.user._id }, { avatarUrl: url }, { new: true });

        
        if (prevAvatarUrl.startsWith('/uploads')) {
            try{
                const prevFilePath = path.join(__dirname, '..', 'uploads', prevAvatarUrl.slice(9));
                await fs.unlink(prevFilePath);
            }
            catch(err){
                console.log('File Deletion on disk failed', err.message);
            }
        
        }
        res.status(200).json({ avatarUrl: user.avatarUrl });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error on avatar upload' });;
    }
}

module.exports = { updateAvatar };