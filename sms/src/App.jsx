import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import About from './Pages/About';
import EServices from './Pages/EServices';
import Study from './Pages/Study';
import Footer from './Components/Footer';
import Login from './Pages/Login';
import StudentDashboard from './Pages/Student/StudentDashboard';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AddUser from './Pages/Admin/AddUser';
import Faculty from './Pages/Admin/Faculty';
import Departments from './Pages/Admin/Departments';
import Programs from './Pages/Admin/Programs';
import Users from './Pages/Admin/Users'; // Add this import for the Users page
import ManageUsers from './Pages/Admin/ManageUsers'; 

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/EServices" element={<EServices />} />
        <Route path="/Study" element={<Study />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        <Route path="/Dashboard" element={<AdminDashboard />} />
        <Route path="/admin-add-user" element={<AddUser />} />
        <Route path="/admin-faculties" element={<Faculty />} />
        <Route path="/admin-departments" element={<Departments />} />
        <Route path="/admin-programs" element={<Programs />} />
        <Route path="/admin-users" element={<Users />} /> {/* Add this route */}
        <Route path="/admin-manage-users" element={<ManageUsers />} />
      </Routes>
    </>
  );
}

export default App;