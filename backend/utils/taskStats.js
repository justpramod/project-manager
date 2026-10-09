const Task = require('../models/Task');

const getTaskByCount = async (projectIds) => {

    const counts = await Task.aggregate([
        { $match: { project: { $in: projectIds } } },
        {
            $group: {
                _id: { project: '$project', status: '$status' },
                count: { $sum: 1 },
            }
        },
    ]);
  
    const countsByProject = {};

    for (const row of counts) {

        const id = row._id.project.toString();

        if (!countsByProject[id]) {
            countsByProject[id] = { todo: 0, inProgress: 0, done: 0 };
        }
          countsByProject[id][row._id.status] = row.count;
    }

    return countsByProject;
}

module.exports = {getTaskByCount};