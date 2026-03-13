import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "./api"
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true)
  try {
    console.log(formData);
    console.log(API)
    const res = await axios.post(`${API}/users/login`, formData);
    console.log(res.data);
    setLoading(false)
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("userId", res.data.id);
    localStorage.setItem("email", res.data.email);
    if(res.data.condidateId) {
      localStorage.setItem("candidateId", res.data.condidateId);
    }
    if(res.data.companieId) {
      localStorage.setItem("companieId", res.data.companieId);
    }
    alert("Login Successful ✅");
     if (res.data.role === "candidate" || res.data.role === "employee") {
        navigate("/sidebarprofile/candidatejobs");
      } else if (res.data.role === "admin") {
        navigate("/");
      } else if (res.data.role === "companie") {
        navigate("/company/jobs");
      }
  } catch (error) {
    console.log(error);
    alert("Login Failed ❌");
    setLoading(false)
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[380px]">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
             {loading ? "Login Account..." : "Login"}
          </button>
        </form>
        <button onClick={() => navigate("/forget")} className="text-indigo-600 font-semibold ml-20 underline">
            Forgot password?
          </button>
        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have account?{" "}
          <button onClick={() => navigate("/signup")} className="text-indigo-600 font-semibold underline">
            Signup
          </button>
        </p>
      </div>
    </div>
  );
}