import { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [message , setMessage] = useState("");
    const [loading , setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSetOtp = async(e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try{
            const res= await axios.post("https://gdg-backend-reminder.onrender.com/api/login" , {
                email ,
            });
            console.log(res.data);
            setMessage(res.data.message);
            setLoading(false);

            localStorage.setItem("login-email" , email);
            navigate("/verify");
        }catch(err){
            console.error(err.response);
            setLoading(false);
            setMessage(err.response?.data?.message || "Something went wrong");
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl text-black font-semibold mb-4 text-center">Login via Email OTP</h2>
                <form onSubmit={handleSetOtp} className="space-y-4">
                    <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    required
                    />
                    <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    disabled={loading}
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
            </div>
        </div>
    );
}

export default Login ;
