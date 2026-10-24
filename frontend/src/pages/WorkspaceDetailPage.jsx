import { useEffect, useState } from "react";
import {  NavLink, useParams } from "react-router-dom";
import ProjectCard from "../components/ui/ProjectCard";
import AddMemberModal from "../components/ui/AddMemberModal";

import CreateProjectModal from "../components/ui/CreateProjectModal";

import { getAWorkspace, getProjects } from '../api/workspaceApi';

import { useAuth } from "../hooks/useAuth";
import { socket } from "../utils/socket";

const WorkspaceDetailPage = () => {

    const { user } = useAuth();
    const { workspaceId } = useParams();

    const [workspace, setWorkspace] = useState(null);
    const [workspaceLoading, setWorkspaceLoading] = useState(true);
    const [workspaceError, setWorkspaceError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [iscreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [projects, setProjects] = useState([]);
    const [projectLoading, setProjectLoading] = useState(true);
    const [projectError, setProjectError] = useState('');

    const userId = user?._id;

    //works on populated members array
    const isOwner = !!workspace?.members?.some((member) => {
        const memberUserId = member.user?._id ?? member.user;
        return memberUserId?.toString() === userId?.toString() && member.role === 'owner';
    });



    const getWorkspace = async () => {

        setWorkspaceLoading(true);
        setWorkspaceError('');

        try {
            const data = await getAWorkspace(workspaceId);
            setWorkspace(data?.workspace ?? null);
        }
        catch (err) {
            setWorkspace(null);
            setWorkspaceError(err.response?.data?.message || 'Workspace Error');
        }
        finally {
            setWorkspaceLoading(false);
        }

    }


    const getProject = async () => {

        setProjectLoading(true);
        setProjectError('');

        try {
            const data = await getProjects({ page: 1, limit: 150 }, workspaceId);
            setProjects(data?.projectWithStats ?? []);
        }
        catch (err) {
            setProjects([]);
            setProjectError(err.response?.data?.message || 'Project fetch error');
        }
        finally {
            setProjectLoading(false);
        }
    };



    useEffect(() => {
        getWorkspace();
        getProject();

        const joinWorkspaceRoom = () => socket.emit('joinWorkspace', workspaceId);
        socket.connect();
        socket.on('connect', joinWorkspaceRoom);
        if (socket.connected) joinWorkspaceRoom();
        const updateWorkspace = (updatedWorkspace) => setWorkspace(updatedWorkspace);
        const refreshProjects = () => getProject();
        socket.on('workspaceUpdated', updateWorkspace);
        socket.on('memberAdded', updateWorkspace);
        socket.on('newProject', refreshProjects);
        socket.on('updateProject', refreshProjects);
        socket.on('deleteProject', refreshProjects);
        socket.on('projectTasksChanged', refreshProjects);

        return () => {
            socket.off('workspaceUpdated', updateWorkspace);
            socket.off('memberAdded', updateWorkspace);
            socket.off('newProject', refreshProjects);
            socket.off('updateProject', refreshProjects);
            socket.off('deleteProject', refreshProjects);
            socket.off('projectTasksChanged', refreshProjects);
            socket.off('connect', joinWorkspaceRoom);
            socket.disconnect();
        };
    }, [workspaceId]);

    const currentWorkspaceName = workspace?.name;

    const handleAddMemberSuccess = () => {

        setIsModalOpen(false);
        getWorkspace();

    }

    const handleProjectModalSuccess = () => {
        setIsCreateModalOpen(false);
        getProject();
    }



    return (

        <div className="mx-9 my-5 ">

            <header className="flex items-center gap-3 px-2 py-3 text-sm text-slate-600">
                <NavLink to="/workspace" className="hover:text-slate-900">Workspaces</NavLink>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                    <path d="m9 18 6-6-6-6"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-semibold text-slate-800">{currentWorkspaceName}</span>
            </header>

            {
                workspaceLoading && <div className="py-8 text-center text-sm text-slate-500">Loading...</div>
            }
            {
                !workspaceLoading && !workspaceError && workspace && (
                    <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900">{workspace.name}</h1>
                        </div>
                        <div> {workspace?.members?.length} {workspace?.members?.length === 1 ? 'Member' : 'Members'} </div>
                        {isOwner && <button type="button"

                            className={` ml-6 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm`}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Member
                        </button>}
                    </div>
                )
            }
            {
                workspaceError && <h2 className="text-red-500 mt-5">{workspaceError}</h2>
            }

            <div className="mb-5 flex items-center justify-between">



                {
                    projects.length === 0 ?

                        (!projectError) && (!projectLoading) && (<h2 className="text-2xl font-bold text-slate-900"> No project Yet </h2>)


                        :
                        <h2 className="text-2xl font-bold text-slate-900"> Active Projects </h2>
                }


                <button type="button"
                    className="flex items-center gap-2 rounded-xl bg-[#4338CA] px-4 py-3 text-sm font-semibold text-white shadow-sm ml-auto"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M12 5v14M5 12h14"
                            fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" />
                    </svg>
                    New Project
                </button>
            </div>

            <AddMemberModal

                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleAddMemberSuccess}

            />

            <CreateProjectModal
                isOpen={iscreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleProjectModalSuccess}
            />

            <main>
                {
                    projectLoading && <div className="py-8 text-center text-sm text-slate-500">Loading...</div>
                }
                {
                    !projectLoading &&
                    <div className="bg-white">
                        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                            {
                                projects.map((project) => (
                                   
                                        <ProjectCard 
                                            
                                            key={project._id}
                                            project={project}
                                        />

                                ))
                            }
                        </div>
                    </div>
                }
                {projectError && <h2 className="text-red-500">{projectError}</h2>}

            </main>
        </div>

    );
}

export default WorkspaceDetailPage;
