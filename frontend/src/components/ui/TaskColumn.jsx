import TaskCard from "./TaskCard";
const TaskColumn = ({ title, status, tasks = [] , total, loading, error, onAddTask }) => {

    return (
     
        (
            <div className='flex flex-1 flex-col'>

                <div className='flex w-full justify-between'>
                    <div className='gap-3 flex'>
                        <h2 className='font-bold'>{title}</h2>
                        <div className=' text-slate-900 bg-slate-200 h-5 w-6 px-2  justify-center  rounded-3xl text-sm' >{total}</div>
                    </div>

                    <div className=''>
                        <button type="button" className='text-slate-600 cursor-pointer' onClick={() => onAddTask(status)} aria-label={`Create ${title} task`}>

                            <svg xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="black"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M12 5v14" />
                                <path d="M5 12h14" />
                            </svg>

                        </button>

                    </div>

                </div>

                {
                    loading && <div className="py-8 text-center text-sm text-slate-500">Loading...</div>
                }
                
                    <div className="mt-4 flex flex-col gap-3">
                {
                        !loading && !error && tasks.length > 0 &&
                    tasks.map((task) => (

                         <TaskCard 
                         key={task._id}
                        task={task}
                         />
                    ))
                }
                {!loading && !error && tasks.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                        No {title.toLowerCase()} tasks yet
                    </div>
                )}
                    </div>
                   
                    
                
                {
                    error && <h2 className="text-red-500"> {error}</h2>
                }

    
            </div>

        )

    );
}

export default TaskColumn;
