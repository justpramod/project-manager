const fs = require('fs').promises;
const path = require('path');
const Attachment = require('../models/Attachment');

const createAttachment = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'File does not exists' });
        const { filename, mimetype, size } = req.file;
        const url = `/uploads/${filename}`;
        const attachment = await Attachment.create(
            { filename, size, mimetype, uploadedBy: req.user._id, task: req.task._id, url: url });
        res.status(201).json({ message: 'Attachment created successfully!!', attachment: attachment });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'server error on createAttachment' });
    }
};

const getAttachments = async (req, res) => {
    try {
        const attachments = await Attachment.find({ task: req.task._id });
        if (attachments.length === 0) return res.status(200).json({ message: 'No attachment uplaoded yet!' });
        res.status(200).json({ attachments });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error on getAttachment' });
    }
};

const deleteAttachment = async (req, res) => {
    try {
        const attachment = await Attachment.findById(req.params.id);
        if (!attachment) return res.status(404).json({ message: 'Attachment does not exists' });

        if (attachment.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not eligible to delete it' })
        }

        const filePath = path.join(__dirname, '..', 'uploads', attachment.filename);
        try{
             await fs.unlink(filePath);
        }
        catch(err){
            console.log('File Deletion on disk failed.', err.message);
        }
       
        await attachment.deleteOne();

        res.status(200).json({ message: `File Deleted Successfully: ${attachment.filename}` });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error on deleteAttachment' });
    }
};
module.exports = { createAttachment, getAttachments, deleteAttachment };