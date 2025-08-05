import {useState} from "react" ;
import axios from "axios" ;
import Verify from "./Verify" ;

const Register = () => {

    const [email, setEmail] = useState('');
    const [step, setStep] = useState('register') ;
    const [message , setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('https://gdg-backend-reminder.onrender.com/api/register' ,
            {email} );
            setMessage(res.data.message);
            setStep('verify');

        } catch(err) {
            setMessage(err.response?.data?.message || 'Error occurred');
        }
    };

    return(
        <div className="p-6 max-w-md mx-auto">
            {step === 'register'? (
                <>
                <h2 className=" text-black text-2xl font-semibold mb-4">Register</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                     type="email"
                     placeholder="Enter your email"
                     className="w-full border p-2 rounded"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
                        Send OTP
                    </button>
                </form>
                {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
                </>
            ):(
                <Verify email={email} />

            )}

            
        </div>
    );
};

export default Register;