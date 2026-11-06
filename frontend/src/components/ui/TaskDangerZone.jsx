const TaskDangerZone = ({ onDeleteTask, deleting, submitting, headingId = 'danger-zone-heading' }) => {
    return (
        <section className="border-t border-red-100 bg-red-50/40 px-5 py-4" aria-labelledby={headingId}>
            <h2 id={headingId} className="text-[11px] font-bold uppercase tracking-wide text-red-700">Danger Zone</h2>
            <p className="mt-1 text-xs text-red-600">Delete this task permanently. Review carefully before continuing.</p>
            <button
                type="button"
                onClick={onDeleteTask}
                disabled={deleting || submitting}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-red-300 bg-transparent px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="m19 6-1 14H6L5 6" />
                    <path d="M10 11v5M14 11v5" />
                </svg>
                {deleting ? 'Deleting...' : 'Delete Task'}
            </button>
        </section>
    );
};

export default TaskDangerZone;
