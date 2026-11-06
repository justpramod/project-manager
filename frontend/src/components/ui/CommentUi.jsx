const getId = (value) => value?._id?.toString() || value?.toString();

import { getImageUrl } from "../../utils/getImageUrl";
import TaskDangerZone from "./TaskDangerZone";

const formatRelativeTime = (dateValue) => {
    const date = new Date(dateValue);
    const differenceInSeconds = Math.round((date.getTime() - Date.now()) / 1000);

    if (Number.isNaN(differenceInSeconds)) return "Unknown time";

    const units = [
        ["year", 31536000],
        ["month", 2592000],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
        ["second", 1],
    ];
    const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: "always" });

    for (const [unit, secondsPerUnit] of units) {
        if (Math.abs(differenceInSeconds) >= secondsPerUnit || unit === "second") {
            return relativeTime.format(Math.round(differenceInSeconds / secondsPerUnit), unit);
        }
    }
};

const CommentUi = ({ comments, commentError, commentSubmitting, commentDeletingId, commentText, canDeleteTask, deleting, handleCommentDelete, setCommentText, onDeleteTask, submitting, userId, taskId, handleCommentSubmit }) => {
    return (
        <div className="flex min-h-full flex-col justify-between">
            <section className="border-t border-slate-200 px-5 py-4">
                <div className="flex flex-col items-center justify-between gap-3">

                    <div className="flex flex-col w-full overflow-y-auto ">

                        {comments.length === 0 && !commentError && <p className="py-3 text-xs text-slate-400">No comments yet.</p>}

                        {comments.map((comment) => {
                            const canDeleteComment = getId(comment.author) === userId || canDeleteTask; // only allow deletion if the user is the author of the comment or has permission to delete the task itself (workspace owner)

                            return (

                                <div key={comment._id} className="group flex  items-start gap-3 px-3 py-2">
                                    <img
                                        src={getImageUrl(comment.author?.avatarUrl)}
                                        alt=""
                                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                                    />
                                    <div className="min-w-0 flex-col gap-y-4 ">
                                        <div className="flex items-center gap-2">
                                            <p className=" font-semibold text-slate-800">
                                                {comment.author?.username || "Unknown user"}
                                            </p>
                                            <p className="text-[11px] text-slate-400">{formatRelativeTime(comment.createdAt)}</p>
                                        </div>

                                        <p className=" text-xs  font-medium text-slate-700 hover:text-indigo-600">
                                            {comment.text}
                                        </p>

                                    </div>
                                    {canDeleteComment && <button type="button" onClick={() => handleCommentDelete(comment)} disabled={commentDeletingId === comment._id} aria-label={`Delete comment`} className="rounded p-1.5 text-slate-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 disabled:pointer-events-none">

                                    </button>}
                                </div>
                            )
                        })}

                    </div>
                </div>

                {commentError && <p role="alert" className="mt-3 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">{commentError}</p>}
            </section>
            <form onSubmit={handleCommentSubmit} className="flex w-full items-center gap-2 border-t border-slate-200 px-3 py-2.5">
                <input
                    type="text"
                    name="commentText"
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Add a comment..."
                    aria-label="Add a comment"
                    disabled={commentSubmitting}
                    className="h-8 min-w-0 flex-1 rounded-md border border-slate-200 px-2.5 text-xs outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                />
                <button
                    className="h-8 shrink-0 rounded-md bg-indigo-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    type="submit"
                    disabled={!commentText.trim() || commentSubmitting}
                >
                    {commentSubmitting ? 'Sending...' : 'Send'}
                </button>
            </form>

            {canDeleteTask && (
                <TaskDangerZone
                    headingId="comments-danger-zone-heading"
                    onDeleteTask={onDeleteTask}
                    deleting={deleting}
                    submitting={submitting}
                />
            )}
           
        </div>
    );
}

export default CommentUi;

