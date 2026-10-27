import { useState, useEffect } from "react";
import { createTask } from "../../api/taskApi";

const CreateTaskModal = ({ isOpen, onClose, onCreated, projectId, projectName, workspaceName, members = [], initialStatus = 'todo' }) => {

    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [assignee, setAssignee] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {

        if (isOpen) {
            setTitle('');
            setTitleError('');
            setDescription('');
            setStatus(initialStatus);
            setPriority('');
            setAssignee('');
            setSubmitting(false);
            setError('');
        }
    }, [isOpen, initialStatus]);

    useEffect(() => {
        if (!isOpen) return;

        const downkeyHandler = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        }

        document.addEventListener('keydown', downkeyHandler);

        return () => { document.removeEventListener('keydown', downkeyHandler) };
    }, [isOpen, onClose]);


    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setTitleError('Title is required');
            return;
        }
        setSubmitting(true);
        setTitleError('');
        setError('');

        try {
            const response = await createTask({ title: title.trim(), description: description.trim(), status, priority, assignee: assignee.trim(), projectId });
            onCreated(response?.data?.task);
        }
        catch (err) {
            setError(err?.response?.data?.message || 'Failed to create Task. please try again!');
        }
        finally {
            setSubmitting(false);
        }


    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 p-4 backdrop-blur-sm" onClick={onClose}>

            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>

                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">Create task</h2>
                        <p className="mt-1 text-xs text-slate-500">Add a task to {projectName || 'this project'}</p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close"
                        className="rounded-lg p-2 text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        onClick={onClose}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form className="space-y-5 px-5 py-5" onSubmit={handleSubmit}>
                    <p className="truncate text-xs text-slate-600">
                        {workspaceName || 'Workspace'} <span className="px-1 text-slate-300">/</span> {projectName || 'Project'}
                    </p>

                    <div>
                        <label htmlFor="task-title" className="mb-2 block text-xs font-semibold text-slate-700">
                            Task title <span className="text-indigo-600">*</span>
                        </label>
                        <input
                            id="task-title"
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (titleError) setTitleError('');
                            }}
                            required
                            placeholder="Enter task title"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100"
                            aria-invalid={Boolean(titleError)}
                            autoFocus
                        />
                    </div>
                    {
                        titleError && <p className="text-red-500 text-sm mt-2"> {titleError} </p>
                    }

                    <div>
                        <label htmlFor="task-description" className="mb-2 block text-xs font-semibold text-slate-700">
                            Description <span className="font-normal text-slate-500">(optional)</span>
                        </label>
                        <textarea
                            id="task-description"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the task and what needs to be done"
                            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:opacity-60 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="task-status" className="mb-2 block text-xs font-semibold text-slate-700">
                                Status <span className="font-normal text-slate-500">(optional)</span>
                            </label>
                            <select
                                id="task-status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-500 outline-none focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="" disabled>Select status</option>
                                <option value="todo">Todo</option>
                                <option value="inProgress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="task-priority" className="mb-2 block text-xs font-semibold text-slate-700">
                                Priority <span className="font-normal text-slate-500">(optional)</span>
                            </label>
                            <select
                                id="task-priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-500 outline-none focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="" disabled>Select priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="task-assignee" className="mb-2 block text-xs font-semibold text-slate-700">
                            Assignee email <span className="font-normal text-slate-500">(optional)</span>
                        </label>
                        <select
                            id="task-assignee"
                            value={assignee}
                            onChange={(e)=> setAssignee(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">Leave unassigned</option>
                            {members.map((member) => {
                                const user = member.user ?? member;
                                return (
                                    <option key={user._id ?? user.email} value={user.email}>
                                        {user.username ? `${user.username} (${user.email})` : user.email}
                                    </option>
                                );
                            })}
                        </select>
                        <p className="mt-2 text-[11px] text-slate-500">
                            Select a workspace member or leave the task unassigned.
                        </p>
                    </div>
                    {error && (
                        <div role="alert" className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-xs text-red-600">{error}</div>
                    )}

                    <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? 'Creating...' : 'Create task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;