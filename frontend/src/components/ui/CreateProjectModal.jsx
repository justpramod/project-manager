import React from 'react';
import { useState, useEffect } from 'react';
import { createProject } from '../../api/projectApi';
import { useParams } from 'react-router-dom';

const CreateProjectModal = ({ isOpen, onClose, onSuccess }) => {

    const { workspaceId } = useParams();

    const [projectName, setProjectName] = useState('');
    const [projectError, setProjectError] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(()=>{

        if(isOpen) {
            setError('');
            setSubmitting(false);
            setProjectName('');
            setProjectError('');
            setDescription('');
        }

    }, [isOpen]);


    useEffect(()=>{

        if(!isOpen) return;

        const downKeyHandler = (e)=>{
            if(e.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', downKeyHandler);
        return ()=> { document.removeEventListener('keydown', downKeyHandler)}

    }, [isOpen, onClose]);

    if(!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!(projectName.trim()))
        {
            setProjectError('Project name is required');
            return;   
        }

        setSubmitting(true);
        setError('');

        try{
                await createProject({projectName, description, workspaceId});
                onSuccess?.();
        }
        catch(e){
                setError(e?.response?.data?.message || 'Failed to create Project');
        }
        finally{
                setSubmitting(false);
        }
    }
    return (
      
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>


            <div className="w-full p-8 max-w-md bg-white rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Create Project</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                    >
                        ✕
                    </button>
                </div>

                <form action="" onSubmit={handleSubmit}>
                    <div className="mb-4 space-y-6">

                        <p className="text-sm text-gray-500">
                            create a new Project 
                        </p>

                        <div>
                            <label htmlFor="name" className="block font-medium text-gray-700 mb-1"  >Project Name</label>
                            <input type="text"
                                id="name"
                                placeholder="Enter the project name"
                                value={projectName}
                                onChange={(e) => {
                                    setProjectName(e.target.value);
                                    if (projectError) setProjectError('');
                                }
                                }
                                autoFocus
                                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-shadow ${projectError
                                        ? 'border-red-500 focus:ring-red-200'
                                        : ' focus:ring-[#4338CA]/20 focus:border-[#4338CA] '
                                    }`} />

                            {projectError && (
                                <p className="text-red-500 text-xs mt-1.5">{projectError}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className="block font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                id="description"
                                placeholder="Enter a project description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
                            />
                        </div>
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                    </div>


                      <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <button 
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#4338CA] rounded-lg hover:bg-[#3730a3] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#4338CA] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                        >
                            {submitting ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>



        </div>

    );
}

export default CreateProjectModal;
