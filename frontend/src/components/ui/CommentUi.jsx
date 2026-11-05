const getId = (value) => value?._id?.toString() || value?.toString();

const CommentUi = ({comments, commentError, commentSubmitting, commentDeletingId, commentText, canDeleteTask, deleting, handleCommentDelete, setCommentText, onDeleteTask, submitting, userId, taskId, handleCommentSubmit}) => {
    return (
        <div>
           <section className="border-t border-slate-200 px-5 py-4">
                <div className="flex flex-col items-center justify-between gap-3">
                    <div>
                       
                        <p className="mt-1 text-xs text-slate-400">Comments shared with this task</p>
                    </div>
                    
                    <div className="flex w-full overflow-y-auto">

                        {comments.length === 0 && !commentError && <p className="py-3 text-xs text-slate-400">No comments yet.</p>}

                        {comments.map((comment) => {
                            const canDeleteComment = getId(comment.author) === userId || canDeleteTask; // only allow deletion if the user is the author of the comment or has permission to delete the task itself (workspace owner)

                            return (

                                <div key={comment._id} className="group flex items-baseline gap-3 px-3 py-2">
                                    <div className="min-w-0 flex-1">
                                        <p className=" text-xs  font-medium text-slate-700 hover:text-indigo-600">
                                            {comment.text}
                                        </p>
                                        <span className="text-[11px] text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
                                    </div>
                                    {canDeleteComment && <button type="button"  onClick={() => handleCommentDelete(comment)} disabled={commentDeletingId === comment._id} aria-label={`Delete comment`} className="rounded p-1.5 text-slate-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 disabled:pointer-events-none">
                                       
                                    </button>}
                                </div>
                            )
                        })}

                    </div>
                </div>

                {commentError && <p role="alert" className="mt-3 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">{commentError}</p>}
            </section>
            <div className="flex  justify-between items-baseline">

            </div>
        </div>
    );
}

export default CommentUi;
                             
