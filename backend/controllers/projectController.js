const Project = require('../models/Project');
const { getIO } = require('../utils/socket');

const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: 'Name is required' });

        const project = await Project.create({ name, description, workspace: req.workspace._id });
        getIO().to(req.workspace._id.toString()).emit('newProject', project);

        res.status(201).json({ project });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Invalid Id format' });
    }
};

const getProjects = async (req, res) => {
    try {
        const filter = {workspace: req.params.workspaceId};
        if(req.query.name) filter.name = { $regex: req.query.name, $options: 'i'};
        
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if(page< 1) page = 1;
        if(limit< 1) limit = 10;
        if(limit > 100) limit = 100;

        const skip = (page - 1) * limit;

        const projects = await Project.find(filter).skip(skip).limit(limit);
        const total = await Project.countDocuments(filter);
        res.status(200).json({
             projects,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit )}
         });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Invalid Id format' });
    }
}

const getProject = async (req, res) => {

    res.status(200).json({ project: req.project });

}

const updateProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (name) req.project.name = name;
        if (description !== undefined) req.project.description = description;
        await req.project.save();
        getIO().to(req.workspace._id.toString()).emit('updateProject', req.project);

        res.status(200).json({ message: 'Project Updated', project: req.project });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Invalid Id format' });
    }
}

const deleteProject = async (req, res) => {
    try {

        await Project.findByIdAndDelete(req.params.id);
        getIO().to(req.workspace._id.toString()).emit('deleteProject', req.params.id);
        
        res.status(200).json({ message: 'Project deleted successfully' });

    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Invalid Id Format' });
    }
}

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject };