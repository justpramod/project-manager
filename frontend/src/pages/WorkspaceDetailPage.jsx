import { NavLink, Link } from "react-router-dom";

const WorkspaceDetailPage = ({ wokrspaceName = "Engineering Team", workspaceDescription = "core platform infrastructure. buliding API together with a Backend" }) => {

    return (
        <div className="mx-9 my-5">
            <header className="p-6 flex gap-3" >
                <NavLink to="/workspace"> Workspaces</NavLink>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                    <path d="m9 18 6-6-6-6"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />

                </svg>
                <NavLink className={({ isActive }) => 'font-bold'} >{wokrspaceName}</NavLink>
            </header>
            <div className=" border border-gray-400 rounded-2xl py-7 p-5 flex justify-between">
                <div className=" ">
                    <h1 className="font-bold text-3xl mb-3">{wokrspaceName}</h1>
                    <p className="text-sm m-auto">{workspaceDescription}</p>
                </div>
                <div className="m-4 border border-gray-300 rounded-2xl">
                    <button type="button" className="p-3">Add Member</button>
                </div>
            </div>
            <div className=" my-9 p-5  border flex justify-between">
                <h1 className="text-2xl font-bold">Active Projects</h1>
                <div className="border border-gray-300 p-4 rounded-2xl text-white bg-[#4338CA] font-bold"><button type="button" className="flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                        <path d="M12 5v14M5 12h14"
                            fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                    </svg>
                    New Project
                </button></div>
            </div>
            <main></main>

        </div>
    );
}

export default WorkspaceDetailPage;
