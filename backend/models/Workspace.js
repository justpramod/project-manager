const mongoose = require('mongoose');
const workspaceSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        members: [
                    {
                        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
                        role: {type: String, enum: ['owner', 'member'], default: 'member'}
                    }
                ]
    },
    {
        timestamps: true
    }
);
const Workspace = mongoose.model('Workspace', workspaceSchema);
module.exports = Workspace;