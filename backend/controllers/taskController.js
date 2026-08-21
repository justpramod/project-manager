const Task = require('../models/Task');
const User = require('../models/User');

//protected by isprojectMember on api/project/projectId/tasks 
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority } = req.body;
        if (!title) return res.status(400).json({ message: 'Title is required' });
        const task = await Task.create({
            title, description, status, priority, createdBy: req.user._id, project: req.project._id
        });
        res.status(201).json({ message: 'Task created', task: task });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Invalid Id Format' });
    }

};

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId });
        if (tasks.length === 0) return res.status(200).json({ message: 'No tasks assinged at this project yet' });
        res.status(200).json({ tasks });

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

        if(assignee){
        const user = await User.findOne({ email: assignee });
        if (!user) return res.status(404).json({ message: 'Asignee user does not exists' });
        
        const isMember = req.workspace.members.find(m=>m.user.toString() === user._id.toString());
        if (!isMember) return res.status(403).json({ message: 'The desired assignee is not a member of the workspace' });

         req.task.assignee = user._id; // store actual objectId reference on task.
        }
        await req.task.save();
        res.status(200).json({message: 'Task updated', task: req.task});
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error on updateTask' });
    }
};

const deleteTask = async (req, res)=>{
    try{
         await Task.findByIdAndDelete(req.params.id);
         res.status(200).json({message: 'Task deleted successfully'});
    }
    catch(e){
        console.log(e);
        res.status(500).json({message: 'Invalid Id Format'});
    }
}
module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };