const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
    {
        filename: {type: String, required:true},
        size: {type: Number, required: true },
        mimetype: {type: String, required: true},
        uploadedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        task: {type: mongoose.Schema.Types.ObjectId, ref: 'Task'}
    },
    {
        timestamps: true
    }
);

const Attachment = mongoose.model('Attachment', attachmentSchema);
module.exports = Attachment;