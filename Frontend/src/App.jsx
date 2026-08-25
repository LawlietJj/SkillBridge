import Login from './Pages/Login.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import Mentors from './Pages/Mentors.jsx'
import Project from './Pages/Project.jsx'
import SkillPath from './Pages/SkillPath.jsx'
import Navbar from './Components/Navbar';
import { Routes, Route,useLocation } from 'react-router-dom';


function App() {

  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
     <div className="min-h-screen bg-slate-50">
        {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/skill-path" element={<SkillPath />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/projects" element={<Project />} />
      </Routes>
    </div>
  );
}

export default App;
