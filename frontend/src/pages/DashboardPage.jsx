import React from 'react';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {

    const { logout, user } = useAuth();
    console.log(user);

    return (
        <div>
            <div className='flex w-full items-center justify-start  bg-amber-700 px-5 py-3 '>
                <button
                    type="button"
                    onClick={logout}
                    className='inline-flex w-fit flex-none items-center gap-2 rounded-full border border-amber-400 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 shadow-sm transition hover:bg-amber-100 hover:shadow-md'>
                    Logout
                </button>
            </div>
            <div className='bg-amber-700 grid place-content-center items-center  p-4 space-x-4 h-screen '>
                <div className='grid bg-white border-4 p-14 m-2'>
                    <h1>User Info:</h1>
                    <p> Username: {user.username}</p>
                    <p> UserEmail: {user.email}</p>
                </div>

            </div>
        </div>

    );
}

export default DashboardPage;
