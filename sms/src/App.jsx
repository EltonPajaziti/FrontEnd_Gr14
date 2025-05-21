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
import Professors from './Pages/Admin/Professors'; 
import Students from './Pages/Admin/Students';
import Courses from './Pages/Admin/Courses';
import Materials from './Pages/Admin/Materials';
import Enrollments from './Pages/Admin/Registrations';
import Schedule from './Pages/Admin/Schedule';
import ManageUsers from './Pages/Admin/ManageUsers'; 
import ProfessorDashboard from "./Pages/Professor/ProfessorDashboard";







function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/About" element={<About />} />
        <Route path="/EServices" element={<EServices />} />
        <Route path="/Study" element={<Study />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        <Route path="/student-materials" element={<StudentMaterials />} />
        <Route path="/student-courses" element={<StudentCourses />} />
        <Route path="/student-schedule" element={<StudentSchedule />} />
        <Route path="/student-exams" element={<StudentExams />} /> 
        <Route path="/Dashboard" element={<AdminDashboard />} />
        <Route path="/admin-add-user" element={<AddUser />} />
        <Route path="/admin-faculties" element={<Faculty />} />
        <Route path="/admin-departments" element={<Departments />} />
        <Route path="/admin-programs" element={<Programs />} />
        <Route path="/admin-users" element={<Users />} /> {/* Add this route */}
        <Route path="/admin-manage-users" element={<ManageUsers />} />
        <Route path="/admin-professors" element={<Professors />} /> {/* Add this route */}
        <Route path="/admin-students" element={<Students />} /> {/* Add this route */}
        <Route path="/admin-courses" element={<Courses />} /> {/* Add this route */}

        <Route path="/ProfessorDashboard" element={<ProfessorDashboard />} />

        <Route path="/admin-exams" element={<Exams />} />
        <Route path="/admin-grades" element={<Grades />} />
        <Route path="/admin-transcripts" element={<Transcripts />} />
        <Route path="/admin-scholarships" element={<Bursat />} />
        <Route path="/admin-faq" element={<FAQ />} />
        <Route path="/admin-settings" element={<Cilesimet />} />
        {/* <Route path="/student-materials" element={<StudentMaterials />} /> */}



      </Routes>
    </>
  );
}

export default App;