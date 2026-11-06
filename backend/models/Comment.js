const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
{
    text: {type: String, required: true, trim: true, maxLength: 500},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    task: {type: mongoose.Schema.Types.ObjectId, ref: 'Task',  index: true}
},
{
    timestamps: true
}
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
