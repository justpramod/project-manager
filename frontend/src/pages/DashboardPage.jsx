import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getWorkspace } from '../api/workspaceApi';
import WorkspaceCard from '../components/ui/WorkspaceCard';
import { AuthProvider } from '../contexts/AuthContext';

const DashboardPage = () => {
    const { logout, user } = useAuth();

    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const getWorkspaces = async () => {
            setLoading(true);
            setError('');

            try {
                const data = await getWorkspace();

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

         getWorkspaces();

    }, []);

    

    const currentUserId = user?._id;
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

            <div className="min-h-screen bg-amber-700 p-4">

                <div className="mb-4 bg-white border-4 p-14">
                    <h1 className="text-2xl font-bold">
                        User Info
                    </h1>

                    <p>
                        Username: {user?.username}
                    </p>

                    <p>
                        Email: {user?.email}
                    </p>
                </div>

                <div className="bg-amber-200 p-6 text-black">

                    <h2 className="mb-4 text-2xl font-bold">
                        Workspaces
                    </h2>

                    {/* Loading */}
                    {loading && (
                        <p>Loading workspaces...</p>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="text-red-600">
                            {error}
                        </p>
                    )}

                    {!loading && !error && (
                        <div>
                            {workspaces.length === 0 ? (
                                <p>No workspaces found.</p>
                            ) : (
                                workspaces.map((workspace) => (
                                    <div
                                        key={workspace._id}
                                        className="mb-2 rounded bg-white p-4"
                                    >
                                        <h3 className="font-bold">
                                            {workspace.name}
                                        </h3>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                </div>
            </div>
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