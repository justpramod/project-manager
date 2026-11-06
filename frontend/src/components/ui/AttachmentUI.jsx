const getId = (value) => value?._id?.toString() || value?.toString();
import TaskDangerZone from "./TaskDangerZone";

const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const AttachmentUI = ({
    apiBaseUrl,
    attachmentUploading,
    attachmentDeletingId,
    attachmentError,
    attachments,
    canDeleteTask,
    deleting,
    handleAttachmentDelete,
    handleAttachmentUpload,
    onDeleteTask,
    submitting,
    userId,
}) => {
    return (
        <div className="flex min-h-full flex-col justify-between">


            <section className="border-t border-slate-200 px-5 py-4" >
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 id="attachments-heading" className="text-sm font-semibold text-slate-800">Attachments</h2>
                        <p className="mt-1 text-xs text-slate-400">Files shared with this task</p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 has-disabled:opacity-60">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        {attachmentUploading ? 'Uploading...' : 'Add file'}
                        <input type="file" className="sr-only" onChange={handleAttachmentUpload} disabled={attachmentUploading} />
                    </label>
                </div>

                {attachmentError && <p role="alert" className="mt-3 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">{attachmentError}</p>}

                <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
                    {attachments.length === 0 && !attachmentError && <p className="py-3 text-xs text-slate-400">No attachments yet.</p>}
                    {attachments.map((attachment) => {
                        const canDeleteAttachment = getId(attachment.uploadedBy) === userId;
                        return (
                            <div key={attachment._id} className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-slate-400" aria-hidden="true">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <path d="M14 2v6h6M8 13h8M8 17h5" />
                                </svg>
                                <div className="min-w-0 flex-1">
                                    <a href={`${apiBaseUrl}${attachment.url}`} target="_blank" rel="noreferrer" className="block truncate text-xs font-medium text-slate-700 hover:text-indigo-600">
                                        {attachment.filename}
                                    </a>
                                    <span className="text-[11px] text-slate-400">{formatFileSize(attachment.size)}</span>
                                </div>
                                {canDeleteAttachment && <button type="button" onClick={() => handleAttachmentDelete(attachment)} disabled={attachmentDeletingId === attachment._id} aria-label={`Delete ${attachment.filename}`} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" />
                                    </svg>
                                </button>
                                }
                            </div>
                        );
                    })}

                </div>
            </section>

            {canDeleteTask && (
                <TaskDangerZone
                    onDeleteTask={onDeleteTask}
                    deleting={deleting}
                    submitting={submitting}
                />
            )}
        </div>
    );
};
export default AttachmentUI;
