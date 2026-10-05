import { useEffect, useState, useRef } from "react";
import { uploadAvatar } from "../../api/userApi";

const EditAvatarModal = ({ isOpen, onClose, onSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedFile(null);
            setError(null);
            setPreviewUrl(null);
            setIsDragging(false);
        }
    }, [isOpen]);

    const handleFile = (file) => {
        if (!file) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);

        setSelectedFile(file);
        const newUrl = URL.createObjectURL(file);
        setPreviewUrl(newUrl);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        if (!isDragging) setIsDragging(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const onInputChange = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    const handleSubmit = async () => {
        if (!selectedFile || submitting) return;
        setSubmitting(true);
        setError(null);

        try {
            const newAvatarUrl = await uploadAvatar(selectedFile);
            onSuccess(newAvatarUrl);
            onClose(); // Close on success
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to upload avatar. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const downKeyHandler = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', downKeyHandler);
        return () => document.removeEventListener('keydown', downKeyHandler);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        /* 1. Backdrop: Full screen, dark overlay, centered */
        <div 
            onClick={onClose} 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
            {/* 2. Modal Container: White box, rounded, shadow */}
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden"
            >
                {/* 3. Header: Title and Close X */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Upload new profile picture</h2>
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </header>

                <div className="p-6">
                    {/* Hidden File Input */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={onInputChange} 
                        className="hidden" 
                        accept="image/*" 
                    />

                    {/* 4. Dropzone */}
                    <div 
                        onClick={() => fileInputRef.current.click()} 
                        onDragOver={onDragOver} 
                        onDragLeave={onDragLeave} 
                        onDrop={onDrop} 
                        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
                            isDragging 
                                ? 'border-indigo-500 bg-indigo-50' 
                                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}
                    >
                        {/* Conditional Rendering: Filled State */}
                        {previewUrl ? (
                            <div className="pointer-events-none flex items-center justify-center w-full h-full p-4">
                                <img 
                                    src={previewUrl} 
                                    alt="Avatar Preview" 
                                    className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white" 
                                />
                            </div>
                        ) : (
                            /* Conditional Rendering: Empty State */
                            <div className="pointer-events-none flex flex-col items-center justify-center text-center space-y-3">
                                <div className="p-3 bg-white rounded-full shadow-sm">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="24" height="24" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="1.8" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                        className="text-gray-500"
                                    >
                                        <path d="M12 16V4" />
                                        <path d="m7 9 5-5 5 5" />
                                        <path d="M20 16.5v2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-2" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Drag and drop your profile picture or <span className="text-indigo-600">click here</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        jpeg, jpg or png, 2MB max
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
                    )}

                    {/* 5. Footer Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            disabled={!selectedFile || submitting} 
                            onClick={handleSubmit}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                                !selectedFile || submitting 
                                    ? 'bg-indigo-300 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {submitting ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAvatarModal;