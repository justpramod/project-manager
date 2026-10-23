const Project = require('../models/Project');
const Task = require('../models/Task');
const Workspace = require('../models/Workspace');

// for api/tasks/:id  and api/tasks/:taskId
const isTaskMember = (paramName) => {
   return async (req, res, next) => {
      try {
         const task = await Task.findById(req.params[paramName]);
         if (!task) return res.status(404).json({ message: 'Task does not exists' });

         const project = await Project.findById(task.project);
         if (!project) return res.status(404).json({ message: 'Project doesnt exists' });

         const workspace = await Workspace.findById(project.workspace);
         if (!workspace) return res.status(404).json({ message: 'workspace doesnot exists' });

         const isMember = workspace.members.find(m => m.user.toString() === req.user._id.toString());
         if (!isMember) return res.status(403).json({ message: 'User is not a member of the workspace' });

         req.workspace = workspace;
         req.project = project;
         req.task = task;
         next();
      }
      catch (e) {
         console.log(e);
         res.status(500).json({ message: 'Invalid Id Format' });
      }
   };
}

const canDeleteTask = (req, res, next) => {
   const userId = req.user?._id?.toString();
   const taskCreatorId = req.task?.createdBy?.toString();

   const workspaceMember = req.workspace?.members?.find(
      (member) => member.user?.toString() === userId
   );

   const isTaskCreator = taskCreatorId === userId;
   const isWorkspaceOwner = workspaceMember?.role === 'owner';

   if (!isTaskCreator && !isWorkspaceOwner) {
      return res.status(403).json({ message: 'Only the workspace owner or task creator can delete this task' });
   }

   next();

}



module.exports = { isTaskMember, canDeleteTask };

