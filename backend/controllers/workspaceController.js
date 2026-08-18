const { findById } = require('../models/User');
const Workspace = require('../models/Workspace');
const User = require('../models/User');

const createWorkspace = async (req, res)=>{
    try{
        const {name} = req.body;
        if(!name) return res.status(400).json({message: 'Name is required'});

        const workspace = await Workspace.create({
            name,
            members: [{user: req.user._id, role: 'owner'}]
        });
        
        res.status(201).json({message: 'Workspace created!', workspace: workspace});
    }
    catch(e){
          console.log(e);
        res.status(500).json({message: 'Server Error'});
    }
};

const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await Workspace.find({ 'members.user': req.user._id });
        res.status(200).json({ workspaces });
    }
    catch (e) {
          console.log(e);
        res.status(500).json({ message: 'Invalid Id format' });
    }
};

const getWorkspace = async(req, res)=>{
    try{
        res.status(200).json({workspace: req.workspace});
    }
    catch(e){
          console.log(e);
        res.status(500).json({message: 'Invalid Id format'});
    }
    
};

const updateWorkspace = async (req, res) => {
    try {

        const { name } = req.body;
        if(name) req.workspace.name = name;
        await req.workspace.save();
        res.status(200).json({ message: 'Workspace updated!', Workspace: req.workspace});
    }
    catch (e) {
          console.log(e);
        res.status(500).json({ message: 'Invalid Id format' });
    }
};

const deleteWorkspace = async (req, res)=>{
    try{
        await Workspace.findByIdAndDelete(req.params.id);
        res.status(200).json({message: 'workspace deleted successfully'});
    }
    catch(e){
        console.log(e);
        res.status(500).json({message: 'Server error'});
    }
};

const addMember = async (req, res)=>{
    try{
    
        const {email, role} = req.body;

        const userToAdd = await User.findOne({ email });
        if(!userToAdd) return res.status(404).json({mesasge: 'User with that email does not exists'});

        const alreadyMember = req.workspace.members.find(m => m.user.toString() === userToAdd._id.toString());
        if(alreadyMember) return res.status(400).json({message: 'User is already a member'});

        req.workspace.members.push({user: userToAdd._id, role: role || 'member'});
        await req.workspace.save();

        res.status(200).json({message: 'Member added', workspace: req.workspace});
    }
    catch(e){
        console.log(e);
        res.status(500).json({message: 'Server error on adding member'});
    }
}

module.exports = { createWorkspace, getWorkspaces, getWorkspace, updateWorkspace, deleteWorkspace, addMember};

