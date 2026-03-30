import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import {
  MapPin, IndianRupee, Briefcase, ArrowLeft,
  Users, GraduationCap, Calendar, CheckCircle, X, FileText
} from "lucide-react";

import CandidateSidebar from "./SidebarProfile";
import API from "../api";

export default function FullJob() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchJob();
    fetchApplications();
  }, [id]);

  const fetchJob = async () => {
    const res = await axios.get(`${API}/job/onejob/${id}`);
    setJob(res.data);
    console.log(res.data)
  };

  const fetchApplications = async () => {
    const res = await axios.get(`${API}/application/my/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setApplications(res.data);
  };

  const applied = applications.find(app => app.jobId === id);

  const handleApply = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("jobId", job._id);
    formData.append("userId", userId);
    formData.append("resume", resume);

    await axios.post(`${API}/application/add`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    alert("Applied Successfully ✅");
    setSelectedJob(null);
    fetchApplications();
  };

  const handleRemove = async () => {
    await axios.delete(`${API}/application/delete/${applied._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Application Removed ❌");
    fetchApplications();
  };

  if (!job) return <div className="text-center mt-20">Loading...</div>;

  return (

    <div className="bg-gray-100 min-h-screen pt-16 pb-10">

      {/* HEADER SAME */}
      <div className="fixed top-16 left-0 w-full z-40 bg-white border-b py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-xl"
            >
              ☰
            </button>

            <h1 className="text-lg font-bold text-gray-800">
              Job Details
            </h1>

          </div>

        </div>
      </div>

      {/* SIDEBAR MOBILE */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 bg-white p-4">
            <button onClick={() => setSidebarOpen(false)}>✕</button>
            <CandidateSidebar />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 flex gap-5">

        {/* SIDEBAR */}
        <div className="hidden lg:block fixed mt-25">
          <CandidateSidebar />
        </div>

     <div className="flex-1 ml-0 lg:ml-67 mt-25 max-w-5xl">

  {/* 🔙 BACK BUTTON */}
  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 text-blue-700 font-semibold mb-5"
  >
    ← Back
  </button>

  {/* MAIN CARD */}
  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">

    {/* TITLE */}
    <h1 className="text-2xl font-bold text-blue-700 mb-3">
      {job?.title}
    </h1>

    {/* BASIC INFO */}
    <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">

      <span>📍 {job?.location}</span>
      <span>💰 ₹{job?.salary}</span>
      <span>💼 {job?.jobtype}</span>
      <span>🧠 {job?.experience}</span>

    </div>

    {/* DESCRIPTION */}
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Job Description
      </h2>

      <p className="text-gray-600 text-sm leading-relaxed">
        {job?.description}
      </p>
    </div>

    {/* GRID DETAILS */}
    <div className="grid md:grid-cols-2 gap-6 mb-6">

      {/* JOB DETAILS */}
      <div className="bg-gray-50 p-5 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-3">
          Job Details
        </h3>

        <p className="text-sm mb-2">👥 Vacancies: {job?.vacancies}</p>
        <p className="text-sm mb-2">🎓 Education: {job?.education}</p>
        <p className="text-sm mb-2">📅 Deadline: {
          job?.deadline 
          ? new Date(job.deadline).toDateString() 
          : "No deadline"
        }</p>
        <p className="text-sm">📌 Status: {job?.status}</p>
      </div>

      {/* COMPANY DETAILS */}
      <div className="bg-gray-50 p-5 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-3">
          Company Info
        </h3>

        <p className="text-sm mb-2">
          🏢 {job?.companyid?.companiename || "Not Available"}
        </p>

        <p className="text-sm mb-2">
          📧 {job?.companyid?.email || "No Email"}
        </p>

        <p className="text-sm">
          📞 {job?.companyid?.phone || "No Phone"}
        </p>
      </div>

    </div>

    {/* SKILLS */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Skills Required
      </h3>

      <div className="flex flex-wrap gap-2">
        {job?.skills?.map((s, i) => (
          <span
            key={i}
            className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs rounded-full"
          >
            {s}
          </span>
        ))}
      </div>
    </div>

    {/* APPLY / CANCEL */}
    {applied ? (
      <button
        onClick={handleRemove}
        className="w-full flex items-center justify-center gap-2 text-red-600 border border-red-200 py-3 rounded-lg hover:bg-red-50 transition"
      >
        ❌ Cancel Application
      </button>
    ) : (
      <button
        onClick={() => setSelectedJob(job)}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        📄 Apply Now
      </button>
    )}

  </div>

</div>

      </div>

      {/* APPLY MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-lg w-full max-w-md">

            <h2 className="font-bold mb-4">Apply for Job</h2>

            <form onSubmit={handleApply}>

              <input
                type="file"
                required
                onChange={(e) => setResume(e.target.files[0])}
                className="border p-2 w-full mb-4"
              />

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="border px-4 py-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-700 text-white px-5 py-2"
                >
                  Submit
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}