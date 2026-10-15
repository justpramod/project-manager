import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";


import { getAWorkspace } from "../api/workspaceApi";
import { getProject } from "../api/projectApi";

const ProjectPage = () => {

    const {projectId} = useParams();

    const [workspaceName, setWorkspaceName] = useState('');
    const [workspaceError, setWorkspaceError] = useState('');


    const [project, setProject] = useState('');
    const [projectLoading, setProjectLoading] = useState(false);
    const [projectError, setProjectError] = useState('');

    
    const getAProject = async ()=>{

        setProjectLoading(true);
        setProjectError('');
        try{
            const data = await getProject(projectId);
            setProject(data?.project ?? null);

        }
        catch(e){
        
            setProjectError(e?.response?.data?.message || 'Project error');
        }
        finally{
            setProjectLoading(false);
        }

    };

    const workspaceId = project?.workspace;

    const getWorkspace = async (workspaceId)=>{
        
        setWorkspaceName('');
        setWorkspaceError('');
        try{
            const data = await getAWorkspace(workspaceId);
            setWorkspaceName(data?.workspace?.name);
        }
        catch(e){
            setWorkspaceName(null);
            setWorkspaceError(e.response?.data?.message || 'Workspace error');
        }


    };

   
    
    useEffect(()=>{
        getAProject();
    }, [projectId]);

    useEffect(()=>{
        if (workspaceId) {
            getWorkspace(workspaceId);
        }
    }, [workspaceId]);



    return (
        <div className="mx-9 my-5 ">

            <header className="flex items-center gap-3 px-2 py-3 text-sm text-slate-600">
                <NavLink to="/workspace" className="hover:text-slate-900">Workspace</NavLink>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                    <path d="m9 18 6-6-6-6"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <NavLink to={`/workspace/${workspaceId}`}  className={ ({isActive})=> isActive ? "font-semibold text-slate-800": ""} > {workspaceName}</NavLink>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                    <path d="m9 18 6-6-6-6"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-semibold text-slate-800"> {project?.name}</span>

            </header>

            {
                projectLoading && <div className="py-8 text-center text-sm text-slate-500">Loading...</div>
            }
            {
                !projectError && !projectLoading && project && 
                (
                    <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 py-5 px-6">

                        <div className="flex-1 flex-col">

                            <h1 className="text-4xl font-bold text-slate-900 ">{project?.name}</h1>
                            <p className="text-slate-800 mt-4">{project?.description}</p>

                        </div>

                        <div>
                            <button type="button" 
                            className="ml-6 rounded-xl border bg-[#4338CA]  px-4 py-2  font-medium text-white shadow-sm cursor-pointer"
                            
                            >
                                + New Task
                            </button>
                        </div>

                    </div>
                )
            }

            <main>
                {projectId}
            </main>

        </div>
    );
}

export default ProjectPage;
