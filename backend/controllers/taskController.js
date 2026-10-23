const Task = require('../models/Task');
const User = require('../models/User');

const Notification = require('../models/Notification');
const { getIO } = require('../utils/socket');
const touchWorkspace = require('../utils/touchWorkspace');

//protected by isprojectMember on api/project/projectId/tasks 
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, assignee } = req.body;
        if (!title) return res.status(400).json({ message: 'Title is required' });

        let assigneeId = undefined;
        if (assignee) {
            const assigneeUser = await User.findOne({ email: assignee });
            if (!assigneeUser) return res.status(404).json({ message: 'Assignee user does not exist' });

            const isMember = req.workspace.members.find(m => m.user.toString() === assigneeUser._id.toString())
            if (!isMember) return res.status(403).json({ message: 'The desired assignee is not a member of workspace' });

            assigneeId = assigneeUser._id;
        }

        const taskData = {
            title,
            description,
            assignee: assigneeId,
            createdBy: req.user._id,
            project: req.project._id
        };

        if (status) taskData.status = status;
        if (priority) taskData.priority = priority;

        const task = await Task.create(taskData);

        await task.populate('assignee', 'username email avatarUrl');
        await touchWorkspace(req.workspace);

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

        const sortableFields = ['title', 'status', 'priority', 'createdAt', 'updatedAt'];
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order || 'desc';
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if (page < 1) page = 1;
        if (limit < 1) limit = 10;
        if (limit > 100) limit = 100;
        const skip = (page - 1) * limit;

        const tasks = await Task.find(filter)
            .populate('assignee', 'username email avatarUrl')
            .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);
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
        await req.task.populate('assignee', 'username email avatarUrl');
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

            const notification = await Notification.create({
                recipient: user._id,
                type: 'task_assigned',
                message: `You were assigned to "${req.task.title}"`,
                relatedTask: req.task._id
            });
            getIO().to(user._id.toString()).emit('newNotification', notification);
        }

        if (assignee === '') {
            req.task.assignee = null;
        }

        await req.task.save();

        await touchWorkspace(req.workspace);
        await req.task.populate('assignee', 'username email avatarUrl');
        getIO().to(req.project._id.toString()).emit('updateTask', req.task);

        res.status(200).json({ message: 'Task updated', task: req.task });
    }
    catch (e) {
        if(e.name === 'ValidationError')
        {
            return res.status(400).json({message: 'Invalid data by user'})
        }
        res.status(500).json({ message: 'Server error on updateTask' });
    }
};

const deleteTask = async (req, res) => {
    try {
        await await req.task.deleteOne();
        await touchWorkspace(req.workspace);
        await Notification.deleteMany({ relatedTask: req.params.id });
        getIO().to(req.project._id.toString()).emit('deleteTask', req.params.id);
        res.status(200).json({ message: 'Task deleted successfully' });


    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server Error on deleteTask' });
    }
}
module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };