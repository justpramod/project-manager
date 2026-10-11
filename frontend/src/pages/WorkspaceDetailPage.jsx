import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import ProjectCard from "../components/ui/ProjectCard";

import { getAWorkspace, getProjects } from '../api/workspaceApi';

const WorkspaceDetailPage = () => {

    const { workspaceId } = useParams();

    const [workspace, setWorkspace] = useState(null);
    const [workspaceLoading, setWorkspaceLoading] = useState(true);
    const [workspaceError, setWorkspaceError] = useState('');

    const [projects, setProjects] = useState([]);
    const [projectLoading, setProjectLoading] = useState(true);
    const [projectError, setProjectError] = useState('');


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
    }, [workspaceId]);

    const currentWorkspaceName = workspace?.name ;

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
                workspaceLoading && <div className="flex place-content-center justify-center h-screen items-center text-5xl">Loading...</div>
            }
            {
                !workspaceLoading && !workspaceError && workspace && (
                    <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900">{workspace.name}</h1>
                        </div>
                        <button type="button" className="ml-6 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                            Add Member
                        </button>
                    </div>
                )
            }
            {
                workspaceError && <h2 className="text-red-500 mt-5">{workspaceError}</h2>
            }

            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">
                    {projects.length === 0 ? "No Projects yet" : "Active Projects"}
                </h2>

                <button type="button" className="flex items-center gap-2 rounded-xl bg-[#4338CA] px-4 py-3 text-sm font-semibold text-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M12 5v14M5 12h14"
                            fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" />
                    </svg>
                    New Project
                </button>
            </div>
            <main>
                {
                    projectLoading && <div className="flex place-content-center justify-center items-center text-4xl">Loading...</div>
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
