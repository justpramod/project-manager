const Workspace = require('../models/Workspace');

const createWorkspace = async (req, res)=>{
    try{
        const {name} = req.body;
        if(!name) return res.status(400).json({message: 'Name is required'});

        const workspace = await Workspace.create({
            name,
            members: [{user: req.user._id, role: 'owner'}]
        });
        
        res.status(201).json({message: 'Workspace created!'});
    }
    catch(e){
        res.status(500).json({message: 'Server Error'});
    }
};

const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await Workspace.find({ 'members.user': req.user._id });
        res.status(200).json({ workspaces });
    }
    catch (e) {
        res.status(500).json({ message: 'Invalid Id format' });
    }
};

const getWorkspace = async(req, res)=>{
    res.status(200).json({workspace: req.workspace});
};

const updateWorkspace = async (req, res) => {
    try {

        const { name } = req.body;
        if(name) req.workspace.name = name;
        await req.workspace.save();
        res.status(200).json({ message: 'Workspace updated!', Workspace: req.workspace});
    }
    catch (e) {
        res.status(500).json({ message: 'Invalid Id format' });
    }
};

const deleteWorkspace = async (req, res)=>{
    try{
        await Workspace.findByIdAndDelete(req.params.id);
        res.status(200).json({messaeg: 'workspace deleted successfully'});
    }
    catch(e){
        res.status(500).json({message: 'Server error'});
    }
};

module.exports = { createWorkspace, getWorkspaces, getWorkspace, updateWorkspace, deleteWorkspace};

