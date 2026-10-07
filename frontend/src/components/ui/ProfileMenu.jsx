import { useState, useEffect, useRef } from "react";
import {useAuth} from "../../hooks/useAuth";
import EditAvatarModal from "./EditAvatarModal";
import {getImageUrl} from '../../utils/getImageUrl';
const ProfileMenu = () => {

    const { user, logout, updateAvatarUrl } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!isMenuOpen) return;
        const handleOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [isMenuOpen]);

    const handleAvatarClick = () => setIsMenuOpen((prev) => !prev);

    const handleUploadPhotoClick = () => {
        setIsMenuOpen(false);
        setIsEditModalOpen(true);
    }

    const handleLogout = () => {
        setIsMenuOpen(false);
        logout();
    };

    const handleAvatarSuccess = (newAvatarUrl) => {
        updateAvatarUrl(newAvatarUrl);
        setIsEditModalOpen(false);
    };


    return (
        <div ref={menuRef} className="relative">

            <img src={getImageUrl(user?.avatarUrl)}
                alt="Avatar"
                onClick={handleAvatarClick}
                className="w-13 h-13 object-cover  rounded-full cursor-pointer border-2 border-transparent hover:border-indigo-500 transition-colors" />


            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-40">


                    <div className="flex flex-col items-center px-4 py-5 border-b border-gray-100">

                        <img src={getImageUrl(user?.avatarUrl)}
                            alt="Avatar"
                            className="w-16 h-16 rounded-full object-cover mb-2" />

                        <p className="font-semibold text-gray-800">{user?.username}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>

                    </div>

                    <button type="button"
                        onClick={handleUploadPhotoClick}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round" className="w-4 h-4 mr-3">
                            <path d="M12 16V4" />
                            <path d="m7 9 5-5 5 5" />
                            <path d="M20 16.5v2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-2" />
                            
                        </svg>
                        Upload Profile Photo
                    </button>

                    <button type="button" onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round" className="w-4 h-4 mr-3">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            )}

            <EditAvatarModal
            isOpen={isEditModalOpen}
            onClose={()=> setIsEditModalOpen(false)}
            onSuccess={handleAvatarSuccess} />

        </div>
    );
}

export default ProfileMenu;
