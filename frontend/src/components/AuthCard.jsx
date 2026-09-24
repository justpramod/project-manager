import React from 'react';

const AuthCard = ({children}) => {
    return (
         <div className="bg-white p-10 rounded-2xl shadow-sm w-full max-w-md">
       {children} {/*for login and register form */}
    </div>
    );
}

export default AuthCard;
