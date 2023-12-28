import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/register/Register"; 
import Header from "./components/header/Header";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <>
      <Router>
        <div>
          <Header />

          <Routes> 
            <Route path="/" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />

          </Routes>
        </div>
      </Router> 
     <ToastContainer />
    </>
  );
}

export default App;
