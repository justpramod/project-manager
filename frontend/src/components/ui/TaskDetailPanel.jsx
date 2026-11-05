import { useContext, useEffect, useRef, useState } from "react";
import { deleteAttachment, deleteTask, getAttachments, updateTask, uploadAttachment, deleteComment, getComments, createComment } from "../../api/taskApi";
import { authContext } from "../../contexts/AuthContext";
import { getImageUrl } from "../../utils/getImageUrl";
import { socket } from "../../utils/socket";
import AlertDialog from './AlertDialog';

import AttachmentUI from "./AttachmentUI";
import CommentUi from "./CommentUi";

const getAssigneeEmail = (assignee) => assignee?.email || '';

// IDs may arrive as strings, MongoDB objects, or populated user objects.
// Converting them here lets permission checks compare them reliably even if they get fetched in different times or ways.
const getId = (value) => value?._id?.toString() || value?.toString();

// default values for form filelds, to avoid uncontrolled component warnings when the task is first loaded.
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

  // small menu that can be used for status, priority, and assignee selection. 
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
    const { user } = useContext(authContext);
    const [values, setValues] = useState(getTaskValues(task));
    const [originalValues, setOriginalValues] = useState(getTaskValues(task));
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [error, setError] = useState('');

    const [attachments, setAttachments] = useState([]);
    const [attachmentError, setAttachmentError] = useState('');
    const [attachmentUploading, setAttachmentUploading] = useState(false);
    const [attachmentDeletingId, setAttachmentDeletingId] = useState(null); // Id of the attachment currently being deleted, to disable its delete button and show a loading state.
    const [activeTab, setActiveTab] = useState('attachments');
    // useRef used to reference the description textarea so we can adjust its height dynamically as the user types.
    const descriptionRef = useRef(null);

    const [comments, setComments] = useState([]);
    const [commentError, setCommentError] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [commentDeletingId, setCommentDeletingId] = useState(null);
    const [commentText, setCommentText] = useState('');
    


    useEffect(() => {
        // Replace the form values whenever the user opens a different task.
        const nextValues = getTaskValues(task);
        setValues(nextValues);
        setOriginalValues(nextValues);
        setSubmitting(false);
        setDeleting(false);
        setDeleteDialogOpen(false);
        setError('');

        setAttachments([]);
        setAttachmentError('');
        setAttachmentUploading(false);
        setAttachmentDeletingId(null);
        setActiveTab('attachments');
    }, [task]);

    // Fetch the attachments for the task whenever the task changes. If the task is deleted or closed, cancel any ongoing fetch to avoid setting state on an unmounted component.
    useEffect(() => {
        if (!task?._id) return;

        let cancelled = false;
        setAttachmentError('');
        getAttachments(task._id)
            .then((response) => {
                if (!cancelled) setAttachments(response.data.attachments ?? []);
            })
            .catch((err) => {
                if (!cancelled) setAttachmentError(err?.response?.data?.message || 'Failed to load attachments.');
            });
        
        setCommentError('');
        getComments(task._id)
            .then((response) => {
                if (!cancelled) setComments(response.data.comments ?? []);
            })
            .catch((err) => {
                if (!cancelled) setCommentError(err?.response?.data?.message || 'Failed to load comments.');
            });

        return () => {
            cancelled = true;
        };
    }, [task?._id]);

    useEffect(() => {
        // Let the description grow with its content without showing empty space.
        const descriptionInput = descriptionRef.current;
        if (!descriptionInput) return;

        descriptionInput.style.height = 'auto';
        descriptionInput.style.height = `${descriptionInput.scrollHeight}px`;
    }, [values.description]);

    useEffect(() => {
        // Escape closes the panel; remove the listener when the panel changes/unmounts.
        if (!task) return;

        const downKeyHandler = (event) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', downKeyHandler);
        return () => document.removeEventListener('keydown', downKeyHandler);
    }, [task, onClose]);

    useEffect(() => {
        if (!task?._id) return;

        const joinTaskRoom = () => socket.emit('joinTask', task._id);
        // When a new attachment is added, add it to the list if it's not already there. When an attachment is deleted, remove it from the list.
        const onAttachmentAdded = (attachment) => {
            setAttachments((currentAttachments) => currentAttachments.some((current) => current._id === attachment._id)
                ? currentAttachments
                : [...currentAttachments, attachment]);
        };
        const onAttachmentDeleted = (attachmentId) => {
            setAttachments((currentAttachments) => currentAttachments.filter(({ _id }) => _id !== attachmentId));
        };

        socket.on('connect', joinTaskRoom);
        socket.on('newAttachment', onAttachmentAdded);
        socket.on('deleteAttachment', onAttachmentDeleted);
        if (socket.connected) joinTaskRoom();

        return () => {
            socket.off('connect', joinTaskRoom);
            socket.off('newAttachment', onAttachmentAdded);
            socket.off('deleteAttachment', onAttachmentDeleted);
            if (socket.connected) socket.emit('leaveTask', task._id);
        };
    }, [task?._id]);

    if (!task) return null;

    // Determine if the user has made any changes to the form fields.
    const hasChanges = Object.keys(originalValues).some(
        (field) => values[field] !== originalValues[field]
    );

    const userId = getId(user);
    const taskCreatorId = getId(task.createdBy);
    const isWorkspaceOwner = members.some((member) => (
        getId(member.user) === userId && member.role === 'owner'
    ));
    const canDeleteTask = userId === taskCreatorId || isWorkspaceOwner;
    // Update one field while preserving the rest of the form.
    const setField = (field, value) => {
        setValues((currentValues) => ({ ...currentValues, [field]: value }));
    };

    const assigneeOptions = [
        { value: '', label: 'Unassigned' },
        ...members.map((member) => {
            // If the member is a populated user object, use its email and username. If it's just an ID or email, use that as the label.
            const user = member.user ?? member;
            return { value: user.email, label: user.username || user.email, email: user.email, user };
        }),
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!hasChanges || !values.title.trim()) return;

        // Send only fields that changed, which avoids overwriting newer server data.
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
        if (!canDeleteTask) return;

        setDeleting(true);
        setError('');
        try {
            await deleteTask(task._id);
            onDeleted(task);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to delete task. Please try again.');
            setDeleting(false);
            setDeleteDialogOpen(false);
        }
    };

    const handleAttachmentUpload = async (event) => {
        // Get the first file from the file input. If no file is selected or an upload is already in progress, do nothing.
        const file = event.target.files?.[0]; 
        // Clear the file input so the same file can be uploaded again if needed.
        event.target.value = '';
        if (!file || attachmentUploading) return;

        setAttachmentUploading(true);
        setAttachmentError('');
        try {
            const response = await uploadAttachment(task._id, file);
            setAttachments((currentAttachments) => currentAttachments.some(({ _id }) => _id === response.data.attachment._id)
                ? currentAttachments // If the attachment already exists in the list, don't add it again.
                : [...currentAttachments, response.data.attachment]);
        } catch (err) {
            setAttachmentError(err?.response?.data?.message || 'Failed to upload attachment.');
        } finally {
            setAttachmentUploading(false);
        }
    };

    const handleAttachmentDelete = async (attachment) => {
        if (getId(attachment.uploadedBy) !== userId || attachmentDeletingId) return;

        setAttachmentDeletingId(attachment._id);
        setAttachmentError('');
        try {
            await deleteAttachment(task._id, attachment._id);
            setAttachments((currentAttachments) => currentAttachments.filter(({ _id }) => _id !== attachment._id));
        } catch (err) {
            setAttachmentError(err?.response?.data?.message || 'Failed to delete attachment.');
        } finally {
            setAttachmentDeletingId(null);
        }
    };

  const handleCommentSubmit = async (event) =>{

    const text = event.target.value.trim();

    if(!text || commentSubmitting) return; // If the comment is empty or a submission is already in progress, do nothing.

    setCommentSubmitting(true);
    setCommentError('');

    try{
        const response = await createComment(task._id, text);
        setComments((currentComments) => [...currentComments, response.data.comment]);
        setCommentText(''); // Clear the comment input after successful submission.
    } catch(err){
        setCommentError(err?.response?.data?.message || 'Failed to add comment.');
    } finally {
        setCommentSubmitting(false);
    }

  }

  const handleCommentDelete = async (comment) =>{

    if(getId(comment.createdBy) !== userId || commentDeletingId) return; // If the user is not the creator of the comment or a deletion is already in progress, do nothing.

    setCommentDeletingId(comment._id);
    setCommentError('');

    try{
        await deleteComment(task._id, comment._id);
        setComments((currentComments) => currentComments.filter(({ _id}) => _id !== comment._id));
    } catch(err) {
        setCommentError(err?.response?.data?.message || 'Failed to delete comment.');
    }
    finally {
        setCommentDeletingId(null);
    }

  }

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
                        <textarea ref={descriptionRef} id="detail-task-description" rows="1" value={values.description} onChange={(event) => setField('description', event.target.value)} className="max-h-48 w-full resize-none overflow-y-auto border-0 bg-transparent px-0 py-0 text-sm leading-5 text-slate-900 outline-none focus:ring-0" />
                    </div>

                    {error && <div role="alert" className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-xs text-red-600">{error}</div>}
                
                    <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                        <button type="button" onClick={onClose} disabled={submitting || deleting} className="rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">Cancel</button>
                        <button type="submit" disabled={!hasChanges || submitting || deleting} className="rounded-md bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'Saving...' : 'Save'}</button> 
                    </div>
                </form>

                <div className="border-t border-slate-200 px-5 pt-4">
                    <div className="flex gap-6 border-b border-slate-200" role="tablist" aria-label="Task details">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'comments'}
                            onClick={() => setActiveTab('comments')}
                            className={`border-b-2 pb-2 text-xs font-semibold ${activeTab === 'comments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            Comments
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'attachments'}
                            onClick={() => setActiveTab('attachments')}
                            className={`border-b-2 pb-2 text-xs font-semibold ${activeTab === 'attachments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            Attachments
                        </button>
                    </div>
                </div>

                {activeTab === 'attachments' && (
                    <AttachmentUI
                        attachments={attachments}
                        attachmentUploading={attachmentUploading}
                        attachmentError={attachmentError}
                        attachmentDeletingId={attachmentDeletingId}
                        apiBaseUrl={import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')}
                        canDeleteTask={canDeleteTask}
                        deleting={deleting}
                        handleAttachmentDelete={handleAttachmentDelete}
                        handleAttachmentUpload={handleAttachmentUpload}
                        onDeleteTask={() => setDeleteDialogOpen(true)}
                        submitting={submitting}
                        userId={userId}
                    />
                )}

                {
                    activeTab === 'comments' && (
                        <CommentUi
                            comments = {comments}
                            commentError = {commentError}
                            commentSubmitting = {commentSubmitting}
                            commentDeletingId = {commentDeletingId}
                            commentText = {commentText}
                            canDeleteTask = {canDeleteTask}
                            deleting = {deleting}
                            handleCommentDelete = {handleCommentDelete}
                            setCommentText = {setCommentText}
                            onDeleteTask = {() => setDeleteDialogOpen(true)}
                            submitting = {submitting}
                            userId = {userId}
                            taskId = {task._id}
                            handleCommentSubmit = {handleCommentSubmit}
                        />
                    )
                }
            </aside>
            <AlertDialog
                open={deleteDialogOpen}
                title="Delete this task?"
                description="This action cannot be undone. The task and its details will be permanently deleted."
                onCancel={() => setDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                confirming={deleting}
            />
        </div>
    );
};

export default TaskDetailPanel;
