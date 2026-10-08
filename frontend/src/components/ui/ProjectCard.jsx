const ProjectCard = ({ project, workspaceId, task}) => {
    const tasks = task.find((task) => task.project === project._id);

    const totalTaskCount = tasks.length();
    const toDoTaskCount = tasks.find((task)=> task.status === 'todo').length();
    const inProgressTaskCount = tasks.find((task)=> task.status === 'in-progress');
    const doneTaskCount = tasks.find((task)=> task.status === 'done');
    return (
        <div className="border bg-white  rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
                <div className="m-4 flex flex-col"> 
                    <h1 className="text-lg font-bold text-gray-900 p-4">{project.name}</h1>
                    <p className="text-sm text-gray-800 p-4">{project.description}</p>
                </div>
                <div className="flex">
                    <div className="flex-col">TOTAL TASKS  <div>{totalTaskCount}</div></div>
                    <div className="flex-col">TO-DO  <div>{toDoTaskCount}</div></div>
                    <div className="flex-col">IN PROGRESS <div>{inProgressTaskCount}</div></div>
                    <div className="flex-col">DONE <div>{doneTaskCount}</div></div>
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;
