import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getWorkspace } from '../api/workspaceApi';
import WorkspaceCard from '../components/ui/WorkspaceCard';
import { AuthProvider } from '../contexts/AuthContext';
import CreateWorkspaceModal from '../components/ui/CreateWorkspaceModal';

const DashboardPage = () => {
    const { logout, user } = useAuth();

    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getWorkspaces = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await getWorkspace({ page: 1, limit: 100 });

            setWorkspaces(data.workspaces);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Workspace error'
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {

        getWorkspaces();

    }, []);


    const currentUserId = user?._id;


    const handleSuccess = () => {

        setIsModalOpen(false);
        getWorkspaces();

    }
    return (
        <div>

            <div className="flex w-full items-center justify-start bg-amber-700 px-5 py-3">
                <button
                    type="button"
                    onClick={logout}
                    className="inline-flex w-fit flex-none items-center gap-2 rounded-full border border-amber-400 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 shadow-sm transition hover:bg-amber-100 hover:shadow-md"
                >
                    Logout
                </button>
            </div>


            <div className="flex justify-between items-center p-7 mb-6">
                <div className='block'>
                    <h1 className="text-3xl font-bold mb-3">My Workspaces</h1>
                    <p className='text-sm m-auto'>Choose a workspace to collaborate and track progress.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#4338CA] text-white px-4 py-2 rounded-lg"
                >
                    + New Workspace
                </button>
            </div>

            <CreateWorkspaceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />


            <div className="p-8 bg-gray-50 min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

                    {workspaces.map((workspace) => (
                        <WorkspaceCard
                            key={workspace._id}
                            workspace={workspace}
                            currentUserId={currentUserId}
                        />
                    ))}

                </div>
            </div>


        </div>
    );
};

export default DashboardPage;