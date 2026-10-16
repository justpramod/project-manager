const touchWorkspace = async (workspace) => {
    workspace.updatedAt = new Date();
    await workspace.save();
};

module.exports = touchWorkspace;