const BrandingPannel = () => {
    return (
        <div className='w-1/3 bg-[#4338CA] text-white flex flex-col justify-between p-12'>
                {/* top */}
                <header className='flex items-center text-3xl gap-2 m-5'>
                    <img
                        src="../../projectLogo.png"
                        alt="Loading animation"
                        width="80"
                        height="80"
                    ></img>

                    <h1>Project Hub</h1>
                </header>
                {/* middle */}
                <main className='max-w-md'>
                    <h1 className='text-5xl font-extrabold leading-tight mb-4'>Manage proejcts, track tasks, collaborate seamlessly.</h1>
                    <p className='text-blue-200 text-lg'>The Modern workspace designed to keep cross-functional team aligned, productive, and shipping on schedule. </p>
                </main>
                {/* copyright wala */}
                <footer className='text-purple-300 text-sm'>
                    &copy; 2026 ProjectHub Inc. All rights reserved.
                </footer>
            </div>
    );
}

export default BrandingPannel;
