import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [reminders, setReminders] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  // Form fields
  const [paymentName, setPaymentName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("bills");
  const [dueDate, setDueDate] = useState("");

  const token = localStorage.getItem("token");

  // Fetch Reminders
  const fetchReminders = async () => {
    try {
      const res = await axios.get(
        "https://gdg-backend-reminder.onrender.com/api/reminders",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setReminders(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to fetch reminders");
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [token]);

  // Add Reminder
  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://gdg-backend-reminder.onrender.com/api/reminders",
        {
          paymentName,
          description,
          amount,
          category,
          dueDate,
        },
        {
          headers: { Authorization: token },
        }
      );
      setMessage("Reminder Added!");
      setPaymentName("");
      setDescription("");
      setAmount("");
      setCategory("bills");
      setDueDate("");
      fetchReminders(); // Refresh list
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding reminder");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-black text-3xl font-bold mb-6">Reminder Dashboard</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Add Reminder Form */}
      <form
        onSubmit={handleAddReminder}
        className="bg-white p-6 rounded shadow mb-8 max-w-xl"
      >
        <h2 className="text-black text-xl font-semibold mb-4">Add a New Reminder</h2>

        <input
          type="text"
          placeholder="Payment Name"
          value={paymentName}
          onChange={(e) => setPaymentName(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="bills">Bills</option>
          <option value="subscription">Subscription</option>
          <option value="loan">Loan</option>
          <option value="tax">Tax</option>
          <option value="other">Other</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Reminder
        </button>
        {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
      </form>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or category"
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
        className="mb-4 p-2 border rounded w-full max-w-md"
      />

      {/* Reminder List */}
      <div className=" text-black max-w-3xl">
        {reminders.length === 0 ? (
          <p>No reminders yet.</p>
        ) : (
          <ul className="space-y-4">
            {reminders
              .filter(
                (r) =>
                  r.paymentName.toLowerCase().includes(search) ||
                  r.category.toLowerCase().includes(search)
              )
              .map((reminder) => (
                <li key={reminder._id} className="bg-white p-4 rounded shadow">
                  <h3 className="text-xl font-semibold">
                    {reminder.paymentName}
                  </h3>
                  <p>Description: {reminder.description || "N/A"}</p>
                  <p>Amount: ₹{reminder.amount}</p>
                  <p>Category: {reminder.category}</p>
                  <p>Status: {reminder.status}</p>
                  <p>
                    Due: {new Date(reminder.dueDate).toLocaleDateString()}
                  </p>

                  {/* Status Select */}
                  <select
                    value={reminder.status}
                    onChange={async (e) => {
                      try {
                        const updatedStatus = e.target.value;
                        await axios.patch(
                          `https://gdg-backend-reminder.onrender.com/api/reminders/${reminder._id}/status`,
                          { status: updatedStatus },
                          {
                            headers: { Authorization: token },
                          }
                        );
                        fetchReminders();
                      } catch (err) {
                        setMessage("Failed to update status.");
                      }
                    }}
                    className="mt-2 p-2 border rounded bg-gray-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* Delete Button */}
                  <button
                    onClick={async () => {
                      try {
                        await axios.delete(
                          `https://gdg-backend-reminder.onrender.com/api/reminders/${reminder._id}`,
                          {
                            headers: { Authorization: token },
                          }
                        );
                        fetchReminders();
                      } catch (err) {
                        setMessage("Failed to delete reminder.");
                      }
                    }}
                    className="mt-2 ml-4 text-white bg-blue-600 hover:bg-blue-800 text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
