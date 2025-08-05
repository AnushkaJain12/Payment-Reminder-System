import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6 text-black">Welcome to Payment Reminder App</h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/register")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
        <button
          onClick={() => navigate("/login")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Home;