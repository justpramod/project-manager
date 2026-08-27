const Notification = require('../models/Notification');

const getNotifications = async (req, res)=>{
    try{
        const filter = {recipient: req.user._id};

        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if(page<1) page = 1;
        if(limit<1) limit = 10;
        if(limit>100) limit =100;

        const skip = (page -1)* limit;
        const notifications = await Notification.find(filter).sort({ createdAt: -1}).skip(skip).limit(limit);
        const total = await Notification.countDocuments(filter);

        res.status(200).json({
            notifications,
            pagination: {total, page, limit, totalPages: Math.ceil(total /limit)}
        });
    }
    catch(e){
        console.log(e);
        res.status(500).json({message: 'Server error on getNotifcations'});
    }
};

const markAsRead = async(req, res)=>{
    try{
        const notification = await Notification.findOne({_id: req.params.id, 
            recipient: req.user._id
        });

        if(!notification) return res.status(404).json({message: 'The very Notification does not exists'});

        notification.isRead = true;
        await notification.save();

        res.status(200).json({message: 'Marked as read', notification: notification});
    }
    catch(e){
        console.log(e);
        res.status(500).json({message: 'Server error on markAsRead'});
    }
}

module.exports = {getNotifications, markAsRead}; 