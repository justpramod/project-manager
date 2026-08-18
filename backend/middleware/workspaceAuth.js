const Workspace = require('../models/Workspace');

const checkMember = async function (req, res, next) {
    try {
        const ws = await Workspace.findById(req.params.id);
        if (!ws) return res.status(404).json({ message: 'Workspace not found' });

        const member =  ws.members.find(m=> m.user.toString() === req.user._id.toString());
        if (!member) return res.status(403).json({ message: 'User is not a member of this workspace' });

        req.workspace = ws;
        next();
    }
    catch (e) {
        res.status(500).json({ message: 'membercheck server error' });
    }
}

const checkOwner = async function (req, res, next) {
    try {
        const workspace = await Workspace.findById(req.params.id);
        if (!workspace) return res.status(404).json({ message: 'workspace doesnot exists' });

        const member =  workspace.members.find(m=> m.user._id.toString() === req.user._id.toString());
        if (!member || member.role != 'owner')
        {
             return res.status(403).json({ message: 'Only the owner is allowed to do this!' });
        }

        req.workspace = workspace;
        next();
    }
    catch (e) {
        res.status(500).json({ message: 'ownercheck server error' });
    }
}

module.exports = {checkMember, checkOwner};
