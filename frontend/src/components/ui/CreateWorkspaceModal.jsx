import { useState, useEffect } from "react";
import { createWorkspace } from "../../api/workspaceApi";

const CreateWorkspaceModal = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setError('');
            setSubmitting(false);
        }
    }, [isOpen]);



    useEffect(() => {
        if (!isOpen) return;

        const downKeyHandler = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        }
        document.addEventListener('keydown', downKeyHandler);

        return () => { document.removeEventListener('keydown', downKeyHandler) };

    }, [isOpen, onClose]);



    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Name is required');
            return;
        }


        setSubmitting(true);
        setError('');

        try {
                await createWorkspace({name});
                onSuccess();
            }


        catch (e) {
            setError(e?.response?.data?.message || 'Failed to create workspace. Please try again')
        }


        finally {
            setSubmitting(false);
        }
    };


return (
  
    //outside of card => close trigger garxa
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
     {/* actual card */}
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()} // Stops click from bubbling up to the backdrop
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Workspace</h2>
        <p className="text-gray-500 text-sm mb-6">Give your new workspace a name to get started.</p>

        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="workspaceName" className="block text-sm font-medium text-gray-700 mb-1">
              Workspace Name
            </label>
            <input
              id="workspaceName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Marketing Team"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4338CA]"
              autoFocus //automatically focuses on input when modal opens
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button" // Important: type="button" prevents this from submitting the form
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#4338CA] rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
);
}

export default CreateWorkspaceModal;