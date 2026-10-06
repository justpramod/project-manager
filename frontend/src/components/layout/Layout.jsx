import { Outlet } from "react-router-dom";
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";


const Layout = () => {
    const [notificationCount, setNotificationCount] = useState(5);
    const [userAvatar, setUserAvatar] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="flex-col ">
            <div className=" border-t-gray-200 border-b">
                <nav className="flex  items-center justify-between mx-7 py-3">
                    <div className="flex items-center  px-4 py-2  gap-8">
                        <Link to="/dashboard">
                            <img src="/projectLogo.png" alt="Proj" className="w-12" />
                        </Link>

                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-blue-700" : ""} > Workspaces</NavLink>
                        <NavLink to="/settings" className={({ isActive }) => isActive ? "text-blue-700" : ""}> Settings</NavLink>
                        <NavLink to="/calendar" className={({ isActive }) => isActive ? "text-blue-700" : ""} > Calendar</NavLink>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="relative flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                fill="currentColor"
                            >
                                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
                                <path d="M9.5 21h5a2.5 2.5 0 0 1-5 0Z" />
                            </svg>
                            {notificationCount > 0 && (
                                <div className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] text-white bg-red-500 rounded-full">
                                    {notificationCount}
                                </div>
                            )}
                        </div>

                        <img className="w-10 h-10 rounded-full object-cover" src={userAvatar ? userAvatar : "/dummyprofile.jpg"} alt="User"  />

                    </div>

                </nav>
            </div>



            <Outlet/>
        </div>

    );
}

export default Layout;
