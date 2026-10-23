import { useEffect, useRef, useState } from "react";
import { deleteTask, updateTask } from "../../api/taskApi";
import { getImageUrl } from "../../utils/getImageUrl";

const getAssigneeEmail = (assignee) => assignee?.email || '';

const getTaskValues = (task) => ({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    assignee: getAssigneeEmail(task?.assignee),
});

const statusOptions = [
    { value: 'todo', label: 'Todo', dot: 'bg-slate-400' },
    { value: 'inProgress', label: 'In Progress', dot: 'bg-indigo-500' },
    { value: 'done', label: 'Done', dot: 'bg-emerald-500' },
];

const priorityOptions = [
    { value: 'low', label: 'Low', style: 'bg-emerald-50 text-emerald-700' },
    { value: 'medium', label: 'Medium', style: 'bg-amber-100 text-amber-700' },
    { value: 'high', label: 'High', style: 'bg-red-100 text-red-700' },
];

const Chevron = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const Avatar = ({ user, className = 'h-6 w-6' }) => (
    <img
        src={getImageUrl(user?.avatarUrl)}
        alt=""
        className={`${className} rounded-full object-cover`}
    />
);

const OptionMenu = ({ options, value, onChange, renderValue, renderOption, className = 'w-full' }) => {
    const [open, setOpen] = useState(false);
    const selected = options.find((option) => option.value === value);

    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((isOpen) => !isOpen)}
                className="flex w-full items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:border-slate-300"
            >
                {renderValue(selected)}
                <Chevron />
            </button>
            {open && (
                <div role="listbox" className="absolute right-0 top-full z-10 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white p-1 shadow-lg">
                    {options.map((option) => (
                        <button
                            type="button"
                            role="option"
                            aria-selected={option.value === value}
                            key={option.value || 'unassigned'}
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                            className="flex w-full items-center rounded px-2 py-1.5 text-left text-sm hover:bg-slate-50"
                        >
                            {renderOption(option)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const TaskDetailPanel = ({ task, onClose, onUpdated, onDeleted, members = [] }) => {
    const [values, setValues] = useState(getTaskValues(task));
    const [originalValues, setOriginalValues] = useState(getTaskValues(task));
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const descriptionRef = useRef(null);

    useEffect(() => {
        const nextValues = getTaskValues(task);
        setValues(nextValues);
        setOriginalValues(nextValues);
        setSubmitting(false);
        setDeleting(false);
        setError('');
    }, [task]);

    useEffect(() => {
        const descriptionInput = descriptionRef.current;
        if (!descriptionInput) return;

        descriptionInput.style.height = 'auto';
        descriptionInput.style.height = `${descriptionInput.scrollHeight}px`;
    }, [values.description]);

    useEffect(() => {
        if (!task) return;

        const downKeyHandler = (event) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', downKeyHandler);
        return () => document.removeEventListener('keydown', downKeyHandler);
    }, [task, onClose]);

    if (!task) return null;

    const hasChanges = Object.keys(originalValues).some(
        (field) => values[field] !== originalValues[field]
    );

    const setField = (field, value) => {
        setValues((currentValues) => ({ ...currentValues, [field]: value }));
    };

    const assigneeOptions = [
        { value: '', label: 'Unassigned' },
        ...members.map((member) => {
            const user = member.user ?? member;
            return { value: user.email, label: user.username || user.email, email: user.email, user };
        }),
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!hasChanges || !values.title.trim()) return;

        const changedFields = Object.keys(values).reduce((fields, field) => {
            const value = field === 'title' || field === 'description'
                ? values[field].trim()
                : values[field];
            const originalValue = field === 'title' || field === 'description'
                ? originalValues[field].trim()
                : originalValues[field];

            if (value !== originalValue) fields[field] = value;
            return fields;
        }, {});

        setSubmitting(true);
        setError('');
        try {
            const response = await updateTask(task._id, changedFields);
            onUpdated({ oldStatus: task.status, task: response.data.task });
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to update task. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this task? This action cannot be undone.')) return;

        setDeleting(true);
        setError('');
        try {
            await deleteTask(task._id);
            onDeleted(task);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to delete task. Please try again.');
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50  bg-slate-900/10" onClick={onClose}>
            <aside className="absolute right-0 top-0 h-full w-full md:w-1/3 overflow-y-auto border-l border-slate-200 bg-white shadow-lg" onClick={(event) => event.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <input
                        id="detail-task-title"
                        value={values.title}
                        onChange={(event) => setField('title', event.target.value)}
                        placeholder="Untitled task"
                        required
                        className="min-w-0 flex-1 border-0 bg-transparent px-0 text-base font-semibold text-slate-900 outline-none focus:ring-0"
                    />
                    <button type="button" aria-label="Close" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <form className="space-y-4 px-5 py-4" onSubmit={handleSubmit}>
                    <div className="divide-y divide-slate-100">
                        <div className="flex items-center justify-between gap-6 py-3">
                            <span className="shrink-0 text-xs font-medium text-slate-500">Status</span>
                            <OptionMenu
                                options={statusOptions}
                                value={values.status}
                                onChange={(value) => setField('status', value)}
                                className="w-44"
                                renderValue={(option) => <span className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${option.dot}`} />{option.label}</span>}
                                renderOption={(option) => <span className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${option.dot}`} />{option.label}</span>}
                            />
                        </div>
                        <div className="flex items-center justify-between gap-6 py-3">
                            <span className="shrink-0 text-xs font-medium text-slate-500">Priority</span>
                            <OptionMenu
                                options={priorityOptions}
                                value={values.priority}
                                onChange={(value) => setField('priority', value)}
                                className="w-44"
                                renderValue={(option) => <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${option.style}`}>{option.label}</span>}
                                renderOption={(option) => <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${option.style}`}>{option.label}</span>}
                            />
                        </div>
                        <div className="flex items-center justify-between gap-6 py-3">
                            <span className="shrink-0 text-xs font-medium text-slate-500">Assignee</span>
                            <div className="w-44">
                                <OptionMenu
                                    options={assigneeOptions}
                                    value={values.assignee}
                                    onChange={(value) => setField('assignee', value)}
                                    renderValue={(option) => option.user ? <span className="flex min-w-0 items-center gap-2"><Avatar user={option.user} /><span className="truncate">{option.label}</span></span> : <span className="text-slate-500">Unassigned</span>}
                                    renderOption={(option) => option.user ? <span className="flex min-w-0 items-center gap-2"><Avatar user={option.user} className="h-7 w-7" /><span className="min-w-0"><span className="block truncate font-medium text-slate-700">{option.label}</span><span className="block truncate text-[11px] text-slate-400">{option.email}</span></span></span> : <span className="text-slate-500">Unassigned</span>}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="detail-task-description" className="mb-2 block text-xs font-semibold text-slate-700">Description</label>
                        <textarea ref={descriptionRef} id="detail-task-description" rows="1" value={values.description} onChange={(event) => setField('description', event.target.value)} className="max-h-48 w-full resize-none overflow-y-auto rounded-lg border border-slate-200 px-3 py-2 text-sm leading-5 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100" />
                    </div>

                    {error && <div role="alert" className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-xs text-red-600">{error}</div>}

                    <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                        <button type="button" onClick={onClose} disabled={submitting || deleting} className="rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">Cancel</button>
                        <button type="submit" disabled={!hasChanges || submitting || deleting} className="rounded-md bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>

                <section  className="border-t border-red-100 bg-red-50/40 px-5 py-4" aria-labelledby="danger-zone-heading">
                    <h2 id="danger-zone-heading" className="text-[11px] font-bold uppercase tracking-wide text-red-700">Danger Zone</h2>
                    <p className="mt-1 text-xs text-red-600">Delete this task permanently. Review carefully before continuing.</p>
                    <button type="button" onClick={handleDelete} disabled={deleting || submitting} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-red-300 bg-transparent px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="m19 6-1 14H6L5 6" />
                            <path d="M10 11v5M14 11v5" />
                        </svg>
                        {deleting ? 'Deleting...' : 'Delete Task'}
                    </button>
                </section>
            </aside>
        </div>
    );
};

export default TaskDetailPanel;
