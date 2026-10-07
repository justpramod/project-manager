import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WorkspacePage from './pages/WorkspacePage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import Settings from './pages/Settings';
import Calendar from './pages/calendar';
import WorkspaceDetailPage from './pages/WorkspaceDetailPage';


function App() 
{
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element= {<ProtectedRoute> <Layout /> </ProtectedRoute>}>
        <Route path="/workspace" element= {<WorkspacePage />} />
        <Route path='/workspace/:workspaceId' element= {<WorkspaceDetailPage />} />
        <Route path="/settings" element= {<Settings />}/>
        <Route path="/calendar" element = {<Calendar/>}/>

        </Route>
    
      </Routes>
    </BrowserRouter>
  );
}

export default App;