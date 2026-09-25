const WorkspaceCard = ({ workspace, currentUserId }) => {

    const currentUserMember = workspace.members.find((member) => member.user === currentUserId);

    const role = currentUserMember ? currentUserMember.role : 'member';
    const isOwner = role === 'owner';

    const memberCount = workspace.members.length;

    const dateObj = new Date(workspace.updatedAt);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className='bg-white border rounded-xl p-6 shadow-sm hover:shadow-md ransition-shadow cursor-pointer flex flex-col h-full"'>

            {/* top section */}
            <div className='flex justify-between items-start mb-2'>
                <h3 className='text-lg font-bold text-gray-900' >{workspace.name}</h3>

                <span className={`px-2 py-1 rounded-full text-xs ${isOwner ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {role}
                </span>
            </div>
            {/* middle section */}
            <p className="text-sm text-gray-500"> {memberCount}{memberCount === 1 ? 'member' : 'members'}</p>

            <div className="flex grow mt-6"></div>

            {/* bottom section */}
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center mt-auto">
                <span className="text-sm text-gray-400">Updated {formattedDate}</span>

                <button className="text-sm font-medium text-[#4338CA] flex items-center gap-1 hover:text-indigo-800 transition-colors">
                    Open
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

        </div>
    );
}

export default WorkspaceCard;
