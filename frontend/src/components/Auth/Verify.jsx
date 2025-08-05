import { useState } from "react";
import axios from "axios";

const Verify = ({email}) =>{
    const [otp,setOtp] = useState('');
    const [message,setMessage] = useState('');

    const handleVerify = async(e) => {
        e.preventDefault();
        try{
            const res = await axios.post('https://gdg-backend-reminder.onrender.com/api/verify',{
                email ,
                otp,
            });
            setMessage(res.data.message + 'You can now login!');
        } catch(err){
            setMessage(err.response?.data?.message || 'Verfication failed');
        }
    };

    return(
        <div>
            <h2 className="text-xl font-semibold mb-4">Enter OTP sent to {email}</h2>
            <form onSubmit={handleVerify} className="space-y-4">
                <input
                type="text"
                placeholder="Enter OTP"
                className="w-full border p-2 rounded"
                value={otp}
                onChange={(e)=> setOtp(e.target.value)}
                required
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
                    Verify
                </button>
            </form>
            {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}

        </div>
    );

};

export default Verify;