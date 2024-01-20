import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/register/Register"; 
import Header from "./components/header/Header";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import { RecoverPassword } from "./components/recoverPassword/RecoverPassword";
import SetNewPassword from "./components/recoverPassword/SetNewPassword";

function App() {
  return (
    <>
      <Router>
        <div>
          <Header />

          <Routes> 
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recoverPassword" element={<RecoverPassword />} />
            <Route path="/setNewPassword" element={<SetNewPassword />} />

          </Routes>
        </div>
      </Router> 
     <ToastContainer />
    </>
  );
}

export default App;
