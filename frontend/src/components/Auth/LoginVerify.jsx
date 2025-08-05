import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginVerify() {
    const [otp,setOtp] = useState("");
    const [message , setMessage] = useState("");
    const [loading , setLoading] = useState(false);

    const navigate = useNavigate();
    const email = localStorage.getItem("login-email");

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post("https://gdg-backend-reminder.onrender.com/api/login-verify",
                {   email ,
                    otp,
                }
            );

            localStorage.setItem("token" , res.data.token);
            setMessage("Login Successful !!");
            setLoading(false);

            navigate("/dashboard")
        }catch(err) 
        {
            setLoading(false);
            setMessage(err.response?.data?.message || "Verification failed" );

        }
    };



return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
            <h2 className="text-xl text-black font-semibold mb-4 text-center">Enter Login OTP</h2>
            <form onSubmit={handleVerify} className="space-y-4">
                <input
                 type="text"
                 placeholder="Enter OTP"
                 className="w-full px-4 py-2 border border-gray-300 rounded-md"
                 value={otp}
                 onChange={(e) => setOtp(e.target.value)}
                 required
                />
                <button 
                 type="submit"
                 className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                 disabled={loading}
                 >
                    {loading ? "Verifying...." : "Verify OTP"}
                 </button>
            </form>
            {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}


        </div>
    </div>


);
}

export default LoginVerify;