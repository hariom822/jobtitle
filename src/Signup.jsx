import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "./api"
export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    workstatus: "fresher", 
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWorkStatus = (status) => {
    setFormData({ ...formData, workstatus: status });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        `${API}/candidate/add`,
        formData
      );

      alert("Signup Successful ✅");
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        workstatus: "fresher",
      });
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Create Your Account
        </h2>

        {/* Work Status Section */}
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Work Status
        </h3>

        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Experienced Card */}
          <div
            onClick={() => handleWorkStatus("experienced")}
            className={`cursor-pointer border-2 rounded-2xl p-5 transition duration-300 ${
              formData.workstatus === "experienced"
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-400"
            }`}
          >
            <h4 className="font-bold text-lg text-gray-800">
              I'm experienced
            </h4>
            <p className="text-sm text-gray-600 mt-2">
              I have work experience (excluding internships)
            </p>
          </div>

          {/* Fresher Card */}
          <div
            onClick={() => handleWorkStatus("fresher")}
            className={`cursor-pointer border-2 rounded-2xl p-5 transition duration-300 ${
              formData.workstatus === "fresher"
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-400"
            }`}
          >
            <h4 className="font-bold text-lg text-gray-800">
              I'm a fresher
            </h4>
            <p className="text-sm text-gray-600 mt-2">
              I am a student / Haven't worked after graduation
            </p>
          </div>
        </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition duration-300"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
         
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have account?{" "}
          <a href="/login" className="text-indigo-600 font-semibold underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}