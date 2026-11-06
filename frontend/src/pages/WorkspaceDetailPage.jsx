import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import ProjectCard from "../components/ui/ProjectCard";
import AddMemberModal from "../components/ui/AddMemberModal";

import CreateProjectModal from "../components/ui/CreateProjectModal";

import { getAWorkspace, getProjects } from '../api/workspaceApi';

import { useAuth } from "../hooks/useAuth";
import { socket } from "../utils/socket";

import { getImageUrl } from "../utils/getImageUrl";

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

    const [onlineIds, setOnlineIds] = useState([]);
    const [isPresenceOpen, setIsPresenceOpen] = useState(true);

    const userId = user?._id;
    const isCurrentUser = (id) => id?.toString() === userId?.toString();

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
        socket.on('connect', joinWorkspaceRoom);
        if (socket.connected) joinWorkspaceRoom(); // if already connected, join the workspace room
        const updateWorkspace = (updatedWorkspace) => setWorkspace(updatedWorkspace);
        const refreshProjects = () => getProject();

        const join = () => socket.emit('joinWorkspace', workspaceId, (res) => {
            if (res?.ok) setOnlineIds(res.onlineIds.filter((id) => !isCurrentUser(id)));
        });

        const onPresence = ({ userId, online }) => {

            setOnlineIds((prevOnlineIds) => {

                if (isCurrentUser(userId)) return prevOnlineIds;

                return online
                    ? (prevOnlineIds.includes(userId) ? prevOnlineIds : [...prevOnlineIds, userId])
                    : prevOnlineIds.filter((id) => id?.toString() !== userId?.toString());

            });

        }

        socket.on('workspaceUpdated', updateWorkspace);
        socket.on('memberAdded', updateWorkspace);
        socket.on('newProject', refreshProjects);
        socket.on('updateProject', refreshProjects);
        socket.on('deleteProject', refreshProjects);
        socket.on('projectTasksChanged', refreshProjects);

        socket.on('connect', join);
        socket.on('presenceUpdate', onPresence);
        if (socket.connected) join(); // if already connected, join the workspace room and get the online ids

        return () => {
            socket.off('workspaceUpdated', updateWorkspace);
            socket.off('memberAdded', updateWorkspace);
            socket.off('newProject', refreshProjects);
            socket.off('updateProject', refreshProjects);
            socket.off('deleteProject', refreshProjects);
            socket.off('projectTasksChanged', refreshProjects);
            socket.off('connect', joinWorkspaceRoom);
            socket.emit('leaveWorkspace', workspaceId);

            socket.off('connect', join);
            socket.off('presenceUpdate', onPresence);
            socket.emit('leaveWorkspace', workspaceId); // leave the workspace room when component unmounts
        };
    }, [workspaceId]);


    const currentWorkspaceName = workspace?.name;
    const onlineMembers = workspace?.members?.filter((member) =>
        onlineIds.some((id) => id?.toString() === (member.user?._id ?? member.user)?.toString()) // ?? means if member.user?._id is undefined, then use member.user
    ) ?? [];

    const handleAddMemberSuccess = () => {

        setIsModalOpen(false);
        getWorkspace();

    }

    const handleProjectModalSuccess = () => {
        setIsCreateModalOpen(false);
        getProject();
    }



    return (

        <div className="min-h-screen bg-slate-100 px-9 py-5">

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
                    <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900">{workspace.name}</h1>
                        </div>
                        <div className="flex items-center">
                            {
                                workspace?.members?.slice(0, 3).map((member, index) =>
                                    <div key={member.user?._id ?? member.user} className={index > 0 ? '-ml-3' : ''}>
                                        <img src={getImageUrl(member.user?.avatarUrl)} alt={member.user?.username} className="h-10 w-10 rounded-full border-2 border-slate-50 object-cover" />
                                    </div>
                                )
                            }
                            {workspace?.members?.length > 3 && (
                                <div className="-ml-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-50 bg-slate-200 text-xs font-semibold text-slate-600">
                                    +{workspace.members.length - 3}
                                </div>
                            )}

                        </div>
                        <div> {workspace?.members?.length === 1 ? 'Member' : 'Members'} </div>


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

            <div className="">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Online Presence</h2>
                        <p className="text-slate-500 text-sm">
                            {
                                onlineMembers.length === 0 ? '' : 
                                'Workspace members currently online and available for collaboration.'
                            }
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsPresenceOpen((isOpen) => !isOpen)}
                        aria-expanded={isPresenceOpen}
                        aria-controls="online-presence-content"
                        title={isPresenceOpen ? 'Collapse online presence' : 'Expand online presence'}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`h-5 w-5 transition-transform ${isPresenceOpen ? 'rotate-180' : ''}`}>
                            <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="sr-only">{isPresenceOpen ? 'Collapse online presence' : 'Expand online presence'}</span>
                    </button>
                </div>

                {isPresenceOpen && <div id="online-presence-content">
                    {
                        onlineMembers.length === 0 ? <p className="text-slate-500">No one is currently online.</p>
                            :
                            <div className="mb-5 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                                {

                                    onlineMembers.map((member) =>

                                    (<div key={member.user?._id ?? member.user} className="flex items-center gap-3 divide-x-2 divide-slate-200 rounded-lg px-3 py-2">
                                        <img src={getImageUrl(member.user?.avatarUrl)} alt={member.user?.userName} className="w-7 h-7 rounded-full object-cover" />
                                        <div className="flex flex-col">
                                            <span className="ml-2 text-sm text-slate-700">{member.user?.username}</span>
                                            <span className="ml-2 text-sm text-slate-500">{member.role}</span>
                                        </div>


                                    </div>))
                                }
                            </div>
                    }
                </div>}

            </div>

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
                    <div className="rounded-2xl bg-transparent">
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
