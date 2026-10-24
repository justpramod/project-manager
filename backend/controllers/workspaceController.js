const { findById } = require('../models/User');
const Workspace = require('../models/Workspace');
const User = require('../models/User');
const { getIO } = require('../utils/socket');

const emitToWorkspaceMembers = (workspace, event, payload) => {
    const io = getIO();
    workspace.members.forEach((member) => {
        io.to(member.user.toString()).emit(event, payload);
    });
};

const createWorkspace = async (req, res)=>{
    try{
        const {name} = req.body;
        if(!name) return res.status(400).json({message: 'Name is required'});

        const workspace = await Workspace.create({
            name,
            members: [{user: req.user._id, role: 'owner'}]
        });

        getIO().to(req.user._id.toString()).emit('workspaceCreated', workspace);
        
        res.status(201).json({message: 'Workspace created!', workspace: workspace});
    }
    catch(e){
          console.log(e);
        res.status(500).json({message: 'Server Error'});
    }
};

const getWorkspaces = async (req, res) => {
    try {

        const filter = { 'members.user': req.user._id};
    
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if(page<1) page = 1;
        if(limit < 1) limit = 10;
        if(limit > 100) limit = 100;
        
        const skip = (page - 1) * limit;
        
        const workspaces = await Workspace.find(filter).skip(skip).limit(limit);
        const total = await Workspace.countDocuments(filter);

        res.status(200).json({ 
            workspaces,
            pagination: {total, page, limit, totalPages: Math.ceil(total / limit )}
         });

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
        emitToWorkspaceMembers(req.workspace, 'workspaceUpdated', req.workspace);
        getIO().to(req.workspace._id.toString()).emit('workspaceUpdated', req.workspace);
        res.status(200).json({ message: 'Workspace updated!', Workspace: req.workspace});
    }
    catch (e) {
          console.log(e);
        res.status(500).json({ message: 'Invalid Id format' });
    }
};

const deleteWorkspace = async (req, res)=>{
    try{
        const workspaceId = req.workspace._id.toString();
        const memberIds = req.workspace.members.map((member) => member.user.toString());
        await Workspace.findByIdAndDelete(req.params.id);
        getIO().to(workspaceId).emit('deleteWorkspace', req.params.id);
        memberIds.forEach((memberId) => getIO().to(memberId).emit('deleteWorkspace', req.params.id));
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
        if(!userToAdd) return res.status(404).json({message: 'User with that email does not exists'});

        const alreadyMember = req.workspace.members.find(m => m.user.toString() === userToAdd._id.toString());
        if(alreadyMember) return res.status(400).json({message: 'User is already a member'});

        req.workspace.members.push({user: userToAdd._id, role: role || 'member'});
        await req.workspace.save();

        getIO().to(req.workspace._id.toString()).emit('memberAdded', req.workspace);
        emitToWorkspaceMembers(req.workspace, 'workspaceUpdated', req.workspace);
        getIO().to(userToAdd._id.toString()).emit('workspaceCreated', req.workspace);

        res.status(200).json({message: 'Member added', workspace: req.workspace});
    }
    catch(e){
        console.log(e);
        res.status(500).json({message: 'Server error on adding member'});
    }
}

module.exports = { createWorkspace, getWorkspaces, getWorkspace, updateWorkspace, deleteWorkspace, addMember};

