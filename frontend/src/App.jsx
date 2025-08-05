import Register from "./components/Auth/Register"
import { BrowserRouter as Router , Routes , Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import LoginVerify from "./components/Auth/LoginVerify" ;
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  return (
   <Router>
   <div className="min-h-screen bg-gray-100 p-8">
    <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/register" element={<Register/>} />
     <Route path="/login" element={<Login />} />
     <Route path="/verify" element={<LoginVerify />} />
     <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    
   </div>
   </Router>
  )
}

export default App;
