import { getImageUrl } from "../../utils/getImageUrl";

const TaskCard = ({ task, title }) => {

    const priority = task?.priority || 'medium';
    const priorityStyles = {
        high: 'bg-red-100 text-red-700',
        medium: 'bg-amber-100 text-amber-700',
        low: 'bg-emerald-50 text-emerald-700',
    };

    const assignee = task?.assignee;
    const assigneeName = assignee?.name || assignee?.username || 'Unassigned';
    const taskDate = task?.updatedAt || task?.createdAt;

    const dateLabel = taskDate
        ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
            Math.round((new Date(taskDate).getTime() - Date.now()) / 86400000),
            'day'
        )
        : 'recently';

    return (
        <div className=" rounded-xl border border-slate-200  bg-slate-50 px-3 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-3">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${priorityStyles[priority] || priorityStyles.medium}`}>
                    {priority}
                </span>
                <span className="text-[11px] text-slate-400">
                    {task?.status === 'done' ? `Done ${dateLabel}` : `${task?.updatedAt ? 'Updated' : 'Created'} ${dateLabel}`}
                </span>
            </div>

            <h3 className="mt-3 text-lg font-semibold  text-slate-800">
                {task?.title || title || 'Untitled task'}
            </h3>

            <div className="mt-2.5 flex items-center gap-3 text-[11px] text-slate-500">
                <img src={getImageUrl(assignee?.avatarUrl)} alt="" className="h-6 w-6 rounded-full object-cover" />
                <span>{assigneeName}</span>
            </div>
        </div>
    );
}

export default TaskCard;
