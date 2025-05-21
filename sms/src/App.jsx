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
import Users from './Pages/Admin/Users'; 
import ManageUsers from './Pages/Admin/ManageUsers';
import Professors from './Pages/Admin/Professors'; 
import Students from './Pages/Admin/Students';
import Courses from './Pages/Admin/Courses';
import Enrollments from './Pages/Admin/Registrations';
<<<<<<< HEAD
import Schedule from './Pages/Admin/Schedule';
import ManageUsers from './Pages/Admin/ManageUsers'; 
import ProfessorDashboard from "./Pages/Professor/ProfessorDashboard";
import ProfessorGrades from './Pages/Professor/ProfessorGrades';
import ProfessorLecture from './Pages/Professor/ProfessorLecture';






=======
import Exams from './Pages/Admin/Exams';
import Bursat from './Pages/Admin/Bursat';
import FAQ from './Pages/Admin/FAQ';
import Cilesimet from './Pages/Admin/Cilesimet';
import StudentMaterials from './Pages/Student/StudentMaterials';
import StudentCourses from './Pages/Student/StudentCourses';
import StudentSchedule from './Pages/Student/StudentSchedule';
import StudentExams from "./Pages/Student/StudentExams"; 
import ProfessorDashboard from './Pages/Professors/ProfessorsDashboard';
import ProfessorStudents from './Pages/Professors/ProfessorsStudents';
import ProfessorCourses from './Pages/Professors/ProfessorsCourses';
import ProfessorMaterials from './Pages/Professors/ProfessorsMaterials';
import ProfessorSchedule from './Pages/Professors/ProfessorsSchedule';
import ProfessorsExams from './Pages/Professors/ProfessorsExams';
>>>>>>> main

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
        <Route path="/admin-users" element={<Users />} /> 
        <Route path="/admin-manage-users" element={<ManageUsers />} />
<<<<<<< HEAD
        <Route path="/admin-professors" element={<Professors />} /> {/* Add this route */}
        <Route path="/admin-students" element={<Students />} /> {/* Add this route */}
        <Route path="/admin-courses" element={<Courses />} /> {/* Add this route */}

        <Route path="/ProfessorDashboard" element={<ProfessorDashboard />} />

=======
        <Route path="/admin-professors" element={<Professors />} /> 
        <Route path="/admin-students" element={<Students />} />
        <Route path="/admin-courses" element={<Courses />} />
        <Route path="/admin-registrations" element={<Enrollments />} />
>>>>>>> main
        <Route path="/admin-exams" element={<Exams />} />
        <Route path="/admin-scholarships" element={<Bursat />} />
        <Route path="/admin-faq" element={<FAQ />} />
        <Route path="/admin-settings" element={<Cilesimet />} />
        {/* <Route path="/student-materials" element={<StudentMaterials />} /> */}
        <Route path="/professor-dashboard" element={<ProfessorDashboard/>} />
        <Route path="/professor-students" element={<ProfessorStudents/>} />
        <Route path="/professor-courses" element={<ProfessorCourses/>} />
        <Route path="/professor-materials" element={<ProfessorMaterials/>} />
        <Route path="/professor-schedule" element={<ProfessorSchedule/>} />
        <Route path="/professor-exams" element={<ProfessorsExams/>} />


      </Routes>
    </>
  );
}

export default App;