import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";


import { getAWorkspace } from "../api/workspaceApi";
import { getProject, getTasks } from "../api/projectApi";

import TaskColumn from "../components/ui/TaskColumn";
import CreateTaskModal from "../components/ui/CreateTaskModal";

const ProjectPage = () => {

    const { projectId } = useParams();

    const [workspaceName, setWorkspaceName] = useState('');
    const [workspaceError, setWorkspaceError] = useState('');


    const [project, setProject] = useState('');
    const [projectLoading, setProjectLoading] = useState(true);
    const [pageError, setPageError] = useState('');

    const [todoTasks, setTodoTasks] = useState([]);
    const [todoTaskLoading, setTodoTaskLoading] = useState(true);
    const [todoTotal, setTodoTotal] = useState(null);

    const [inprogressTasks, setInprogressTasks] = useState([]);
    const [inprogressLoading, setInprogressLoading] = useState(true);
    const [inProgressTotal, setInProgressTotal] = useState(null);

    const [doneTasks, setDoneTasks] = useState([]);
    const [doneTaskLoading, setdoneTaskLoading] = useState(true);
    const [doneTotal, setDoneTotal] = useState(null);

    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [createTaskStatus, setCreateTaskStatus] = useState('todo');
    const [taskRefreshCounts, setTaskRefreshCounts] = useState({ todo: 0, inProgress: 0, done: 0 });


    const getAProject = async () => {

        setProjectLoading(true);
        try {
            const data = await getProject(projectId);
            setProject(data?.project ?? null);

        }
        catch (e) {

            setPageError(e?.response?.data?.message || 'Unable to load this project');
        }
        finally {
            setProjectLoading(false);
        }

    };

    const workspaceId = project?.workspace;

    const getWorkspace = async (workspaceId) => {

        setWorkspaceName('');
        setWorkspaceError('');
        try {
            const data = await getAWorkspace(workspaceId);
            setWorkspaceName(data?.workspace?.name);
        }
        catch (e) {
            setWorkspaceName(null);
            setWorkspaceError(e?.response?.data?.message || 'Workspace error');
        }



    };

    const getTodoTasks = async () => {

        setTodoTaskLoading(true);
        const params = { status: 'todo', page: 1, limit: 100 };

        try {
            const data = await getTasks(params, projectId);
            setTodoTasks(data?.tasks ?? []);
            setTodoTotal(data?.pagination.total);

        }
        catch (err) {
            setTodoTasks([]);
            setPageError((currentError) => currentError || err?.response?.data?.message || 'Unable to load project tasks');

        }
        finally {
            setTodoTaskLoading(false);
        }
    }



    const getInprogressTasks = async () => {

        setInprogressLoading(true);

        const params = { status: 'inProgress', page: 1, limit: 100 };

        try {

            const data = await getTasks(params, projectId);
            setInprogressTasks(data?.tasks ?? []);
            setInProgressTotal(data?.pagination.total);
        }
        catch (err) {
            setInprogressTasks([]);
            setPageError((currentError) => currentError || err?.response?.data?.message || 'Unable to load project tasks');
        }
        finally {
            setInprogressLoading(false);
        }

    }

    const getDoneTasks = async () => {

        setdoneTaskLoading(true);

        const params = { status: 'done', page: 1, limit: 100 };

        try {
            const data = await getTasks(params, projectId);
            setDoneTasks(data?.tasks ?? []);
            setDoneTotal(data?.pagination.total);
        }
        catch (err) {
            setDoneTasks([]);
            setPageError((currentError) => currentError || err?.response?.data?.message || 'Unable to load project tasks');

        }
        finally {
            setdoneTaskLoading(false);
        }

    }

    useEffect(() => {
        setPageError('');
        getAProject();
    }, [projectId]);

    useEffect(() => {
        getTodoTasks();
    }, [projectId, taskRefreshCounts.todo]);

    useEffect(() => {
        getInprogressTasks();
    }, [projectId, taskRefreshCounts.inProgress]);

    useEffect(() => {
        getDoneTasks();
    }, [projectId, taskRefreshCounts.done]);

    useEffect(() => {
        if (workspaceId) {
            getWorkspace(workspaceId);
        }
    }, [workspaceId]);


    const handleTaskCreated = (task) => {
        setIsCreateTaskModalOpen(false);
        if (!task?.status) return;

        setTaskRefreshCounts((counts) => ({
            ...counts,
            [task.status]: counts[task.status] + 1,
        }));
    };

    const openCreateTaskModal = (status = 'todo') => {
        setCreateTaskStatus(status);
        setIsCreateTaskModalOpen(true);
    };


    return (
        <div className="mx-9 my-8  ">

            <header className="flex items-center gap-3  px-2 py-3 text-sm text-slate-600">
                <NavLink to="/workspace" className="hover:text-slate-900">Workspace</NavLink>
                {workspaceError && <h3 className="text-red-500"> {workspaceError} </h3>}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                    <path d="m9 18 6-6-6-6"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <NavLink to={`/workspace/${workspaceId}`} className={({ isActive }) => isActive ? "font-semibold text-slate-800" : ""} > {workspaceName}</NavLink>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                    <path d="m9 18 6-6-6-6"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-semibold text-slate-800"> {project?.name}</span>
                {pageError && <h3 className="text-red-500"> {pageError} </h3>}

            </header>

            {
                projectLoading && <div className="py-8 text-center text-sm text-slate-500">Loading...</div>
            }
            {
                !pageError && !projectLoading && project &&
                (
                    <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 py-5 px-6 ">

                        <div className="flex-1 flex-col">

                            <h1 className="text-4xl font-bold text-slate-900 ">{project?.name}</h1>
                            <p className="text-slate-800 mt-4">{project?.description}</p>

                        </div>

                        <div>
                            <button type="button"
                                className="ml-6 rounded-xl border bg-[#4338CA]  px-4 py-2  font-medium text-white shadow-sm cursor-pointer"
                                onClick={() => openCreateTaskModal()}
                            >
                                + New Task
                            </button>
                        </div>

                    </div>
                )
            }


            {!pageError && <CreateTaskModal
                isOpen={isCreateTaskModalOpen}
                onClose={() => setIsCreateTaskModalOpen(false)}
                projectId={projectId}
                projectName={project?.name}
                workspaceName={workspaceName}
                initialStatus={createTaskStatus}
                onCreated={handleTaskCreated}
            />}

            {!pageError && <main className="flex justify-between gap-8 ">
                <TaskColumn tasks={todoTasks} title={'Todo'} status="todo" total={todoTotal} loading={todoTaskLoading} onAddTask={openCreateTaskModal} />

                <TaskColumn tasks={inprogressTasks} title={'In Progress'} status="inProgress" total={inProgressTotal} loading={inprogressLoading} onAddTask={openCreateTaskModal} />

                <TaskColumn tasks={doneTasks} title={'Done'} status="done" total={doneTotal} loading={doneTaskLoading} onAddTask={openCreateTaskModal} />
            </main>}

        </div>
    );
}

export default ProjectPage;
