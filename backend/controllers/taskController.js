const Task = require('../models/Task');
const User = require('../models/User');

const Notification = require('../models/Notification');
const { getIO } = require('../utils/socket');

//protected by isprojectMember on api/project/projectId/tasks 
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, assignee } = req.body;
        if (!title) return res.status(400).json({ message: 'Title is required' });
        const Assignee = await User.findOne({ username: assignee });

        const task = await Task.create({
            title, description, status, priority, assignee: Assignee._id, createdBy: req.user._id, project: req.project._id
        });

        getIO().to(req.project._id.toString()).emit('newTask', task);
        res.status(201).json({ message: 'Task created', task: task });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Invalid Id Format' });
    }

};

const getTasks = async (req, res) => {
    try {
        const filter = { project: req.params.projectId };
        if (req.query.status) filter.status = req.query.status;
        if (req.query.priority) filter.priority = req.query.priority;
        if (req.query.assignee) filter.assignee = req.query.assignee;

        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if (page < 1) page = 1;
        if (limit < 1) limit = 10;
        if (limit > 100) limit = 100;
        const skip = (page - 1) * limit;

        const tasks = await Task.find(filter).skip(skip).limit(limit);
        const total = await Task.countDocuments(filter);

        res.status(200).json({
            tasks,
            pagination: {
                total, page, limit, totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Invalid Id format' });
    }
};

const getTask = async (req, res) => {
    try {
        res.status(200).json({ task: req.task });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Invalid Id format' });
    }
}

const updateTask = async (req, res) => {
    try {
        const { title, description, status, priority, assignee } = req.body;
        if (title) req.task.title = title;
        if (description !== undefined) req.task.description = description;
        if (status) req.task.status = status;
        if (priority) req.task.priority = priority;

        if (assignee) {
            const user = await User.findOne({ email: assignee });
            if (!user) return res.status(404).json({ message: 'Asignee user does not exists' });

            const isMember = req.workspace.members.find(m => m.user.toString() === user._id.toString());
            if (!isMember) return res.status(403).json({ message: 'The desired assignee is not a member of the workspace' });

            req.task.assignee = user._id; // store actual objectId reference on task.

           const notification =  await Notification.create({
                recipient: user._id,
                type: 'task_assigned',
                message: `You were assigned to "${req.task.title}"`,
                relatedTask: req.task._id
            });
            getIO().to(user._id.toString()).emit('newNotification', notification);
        }
        await req.task.save();
        getIO().to(req.project._id.toString()).emit('updateTask', req.task);

        res.status(200).json({ message: 'Task updated', task: req.task });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error on updateTask' });
    }
};

const deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        getIO().to(req.project._id.toString()).emit('deleteTask', req.params.id);
        res.status(200).json({ message: 'Task deleted successfully' });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Invalid Id Format' });
    }
}
module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };