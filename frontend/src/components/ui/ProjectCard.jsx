const ProjectCard = ({ project }) => {
    const taskCounts = project?.taskCounts || { todo: 0, inProgress: 0, done: 0, taskTotal: 0 };
    const progress = project?.progress ?? 0;

    return (
        <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-10 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <div className="mb-3">
                <h3 className="text-2xl font-bold text-slate-800">
                    {project?.name || "Untitled Project"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    {project?.description || "No description provided."}
                </p>
            </div>

            <div className="mt-2 flex items-start justify-between  border-t border-slate-100 pt-3 text-gray-400 text-xs font-bold ">
                <div className="flex min-w-0 flex-1 items-center gap-2">

                   
                    <div className="min-w-0 ">
                        <div >TOTAL TASK</div>
                        <div className="mt-1 text-base font-bold text-slate-900">{taskCounts.taskTotal}</div>
                    </div>
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="h-9 w-0.5 rounded-full bg-slate-500" />
                    <div className="min-w-0">
                        <div >TO DO</div>
                        <div className="mt-1 text-base font-bold text-blue-600">{taskCounts.todo}</div>
                    </div>
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-2">
                     <span className="h-9 w-0.5 rounded-full bg-slate-500" />
                    <div className="min-w-0">
                        <div>IN PROGRESS</div>
                        <div className="mt-1 text-base font-bold text-amber-600">{taskCounts.inProgress}</div>
                    </div>
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-2">
                     <span className="h-9 w-0.5 rounded-full bg-slate-500" />
                    <div className="min-w-0">
                        <div>DONE</div>
                        <div className="mt-1 text-base font-bold text-emerald-600">{taskCounts.done}</div>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                    <span>Project Progress</span>
                    <span className="font-semibold text-slate-800">{progress}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                        className="h-full rounded-full bg-[#4f46e5]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;
