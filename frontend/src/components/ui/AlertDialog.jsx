import { useEffect, useRef } from 'react';

const AlertDialog = ({ open, title, description, onCancel, onConfirm, confirming = false }) => {
    const confirmButtonRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        confirmButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !confirming) onCancel();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, confirming, onCancel]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !confirming) onCancel();
            }}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
            >
                <h2 id="alert-dialog-title" className="text-base font-semibold text-slate-900">{title}</h2>
                <p id="alert-dialog-description" className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                <div className="mt-6 flex justify-end gap-2">
                    <button type="button" onClick={onCancel} disabled={confirming} className="rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
                        Cancel
                    </button>
                    <button ref={confirmButtonRef} type="button" onClick={onConfirm} disabled={confirming} className="rounded-md bg-red-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
                        {confirming ? 'Deleting...' : 'Delete Task'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertDialog;