import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Habits from "./pages/Habits";




function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/home"
          element={
            <RequireAuth>
              <AppLayout>
                <Home />
              </AppLayout>
            </RequireAuth>
          }
        />

        {/* placeholders for next pages */}
        <Route
          path="/projects"
          element={
            <RequireAuth>
              <AppLayout>
                <Projects/>
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <RequireAuth>
              <AppLayout>
              <ProjectDetails />
              </AppLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/habits"
          element={
            <RequireAuth>
              <Habits />
            </RequireAuth>
          }
        />

        <Route
          path="/tasks"
          element={
            <RequireAuth>
              <div style={{ padding: 24 }}>Tasks page (next)</div>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
