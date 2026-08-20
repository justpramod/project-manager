const Workspace = require('../models/Workspace');
const Project = require('../models/Project');

const isWorkspaceMember = async (req, res, next) => {
    try {
        const ws = await Workspace.findById(req.params.workspaceId);
        if (!ws) return res.status(404).json({ message: 'Workspace doesnot exists' });

        const ismember = ws.members.find(w => w.user.toString() === req.user._id.toString());
        if (!ismember) return res.status(403).json({ message: 'You are not an member of the workspace' });
        req.workspace = ws;
        next();
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'server error on check workspace_membersihp' });
    }
};
const isProjectMember = (paramName)=>{

return async (req, res, next) => {

    try {
        const project = await Project.findById(req.params[paramName]);
        if (!project) return res.status(404).json({ message: 'Project doesnot exists' });

        const ws = await Workspace.findById(project.workspace);
        if(!ws) return res.status(404).json({message: 'Parent workspace does not exists'});

        const isMember = ws.members.find(m=>m.user.toString() === req.user._id.toString());
        if(!isMember) return res.status(403).json({message: 'You are not a member of the workspace'});

        req.project = project;
        req.workspace = ws;
        next();
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Invalid Id format' });
    }
};
};

module.exports = {isWorkspaceMember, isProjectMember};