import { useState } from 'react'
import './App.css'
import { useAuth } from './hooks/useAuth'

function App() {
 const {user, loading} = useAuth();
 if(loading) return <p> Loading............Loading.............Loading</p>
 return <p> { user ? `LoggedIn as ${user.username}`: 'Not logged in'}</p>;

}
export default App
