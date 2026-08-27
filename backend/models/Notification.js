const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({

    recipient: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    type : {type:String, enum: ['task_assigned', 'new_comment'], required: true},
    message: {type: String, required: true},
    relatedTask : {type: mongoose.Schema.Types.ObjectId, ref: 'Task'},
    isRead : {type: Boolean, default: false},
    
},
{
        timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;