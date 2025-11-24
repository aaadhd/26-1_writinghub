import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StudentApp from "./StudentApp.jsx";
import TeacherApp from "./TeacherApp.jsx";
import "./styles.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/student/*" element={<StudentApp />} />
        <Route path="/teacher" element={<TeacherApp />} />
        <Route path="/" element={<Navigate to="/student" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
