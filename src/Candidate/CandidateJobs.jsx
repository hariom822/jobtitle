import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Search, MapPin, IndianRupee, Briefcase, Building2,
  Upload, X, CheckCircle, Users, GraduationCap, Calendar,
  FileText, SlidersHorizontal,
} from "lucide-react";

import CandidateSidebar from "./SidebarProfile";
import API from "../api";

function JobTypeBadge({ type }) {

  const styles = {
    "Full Time": "bg-green-50 text-green-700 border border-green-200",
    "Part Time": "bg-yellow-50 text-yellow-700 border border-yellow-200",
    "Internship": "bg-blue-50 text-blue-700 border border-blue-200",
    "Contract": "bg-purple-50 text-purple-700 border border-purple-200",
  };

  return type ? (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${styles[type] || "bg-gray-100 text-gray-600 border border-gray-200"}`}>
      {type}
    </span>
  ) : null;

}

export default function CandidateJobs() {

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resume, setResume] = useState(null);

  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [sortType, setSortType] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  useEffect(() => {
    if (sortType) handleSearch();
  }, [sortType]);

  const fetchJobs = async () => {
    const res = await axios.get(`${API}/job/all`);
    setJobs(res.data);
    setFilteredJobs(res.data);
  };

  const fetchApplications = async () => {
    const res = await axios.get(
      `${API}/application/my/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setApplications(res.data);
  };

  const handleSearch = () => {

    let result = jobs.filter(job => {

      const titleMatch = searchTitle
        ? job.name.toLowerCase().includes(searchTitle.toLowerCase())
        : true;

      const locationMatch = searchLocation
        ? job.location.toLowerCase().includes(searchLocation.toLowerCase())
        : true;

      return titleMatch && locationMatch;

    });

    if (sortType === "az")
      result.sort((a, b) => a.name.localeCompare(b.name));

    if (sortType === "za")
      result.sort((a, b) => b.name.localeCompare(a.name));

    if (sortType === "salaryHigh")
      result.sort((a, b) => parseInt(b.salary) - parseInt(a.salary));

    if (sortType === "salaryLow")
      result.sort((a, b) => parseInt(a.salary) - parseInt(b.salary));

    setFilteredJobs(result);

  };

  const handleApply = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("jobId", selectedJob._id);
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
    setResume(null);

    fetchApplications();

  };

  const handleRemove = async (applicationId) => {

    await axios.delete(`${API}/application/delete/${applicationId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Application Removed ❌");

    fetchApplications();

  };

  const isApplied = (jobId) =>
    applications.find(app => app.jobId === jobId);

  return (

    <div className="bg-gray-100 min-h-screen pt-16 pb-10">

      {/* HEADER */}

      <div className="fixed top-16 left-0 w-full z-40">

        <div className="bg-white border-b border-gray-200 py-4 mb-6">

          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

            <div className="flex items-center gap-3">

              {/* MOBILE MENU */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-700 text-xl"
              >
                ☰
              </button>

              <Briefcase size={20} className="text-blue-400" />

              <h1 className="text-lg font-bold text-gray-800">
                Available Jobs
              </h1>

              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-0.5 rounded-full">
                {filteredJobs.length} Openings
              </span>

            </div>

            <button
              onClick={() => navigate("/candidate/allcompanies")}
              className="flex items-center gap-2 border border-blue-600 text-blue-700 hover:bg-blue-50 text-sm font-semibold px-5 py-2 rounded transition"
            >
              <Building2 size={15} />
              Browse Companies
            </button>

          </div>

        </div>

      </div>

      {/* MOBILE SIDEBAR */}

    {sidebarOpen && (

  <div className="fixed inset-0 z-50 flex">

    {/* SIDEBAR */}
    <div className="w-75 bg-white h-full shadow-lg p-4">

      <button
        onClick={() => setSidebarOpen(false)}
        className="mb-4 text-gray-600"
      >
        ✕ Close
      </button>

      <CandidateSidebar />

    </div>

    {/* BACKDROP */}
    <div
      className="flex-1 bg-black/40"
      onClick={() => setSidebarOpen(false)}
    />

  </div>

)}
      {/* CONTENT */}

      <div className="max-w-6xl mx-auto px-4 flex gap-5 items-start">

        {/* DESKTOP SIDEBAR */}

        <div className="hidden lg:block fixed mt-25">
          <CandidateSidebar />
        </div>

        {/* RIGHT CONTENT */}

        <div className="flex-1 min-w-0 ml-0 lg:ml-67 mt-25">

          {/* SEARCH BAR */}

          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-5 flex flex-wrap items-center gap-3">

            <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 flex-1">

              <MapPin size={14} className="text-gray-400" />

              <input
                type="text"
                placeholder="Location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 text-sm outline-none"
              />

            </div>

            <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 flex-1">

              <Search size={14} className="text-gray-400" />

              <input
                type="text"
                placeholder="Job title, skills..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 text-sm outline-none"
              />

            </div>

            <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2">

              <SlidersHorizontal size={14} className="text-gray-400" />

              <select
                value={sortType}
                onChange={(e) => {
                  setSortType(e.target.value);
                  handleSearch();
                }}
                className="text-sm outline-none"
              >

                <option value="">Sort By</option>
                <option value="az">Name A–Z</option>
                <option value="za">Name Z–A</option>
                <option value="salaryHigh">Salary High–Low</option>
                <option value="salaryLow">Salary Low–High</option>

              </select>

            </div>

            <button
              onClick={handleSearch}
              className="bg-blue-400 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded transition"
            >
              Search
            </button>

          </div>

          {/* JOB CARDS */}

          <div className="flex flex-col gap-3">

            {filteredJobs.map((job) => {

              const applied = isApplied(job._id);

              return (

                <div
                  key={job._id}
                  className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition p-5"
                >

                  <div className="flex items-start justify-between mb-2">

                    <h2 className="text-base font-bold text-blue-700">
                      {job.name}
                    </h2>

                    <div className="flex items-center gap-2">

                      <JobTypeBadge type={job.jobtype} />

                      {applied && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                          <CheckCircle size={11} />
                          Applied
                        </span>
                      )}

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-5 mb-3">

                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <IndianRupee size={13} />
                      {job.salary} / month
                    </span>

                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin size={13} />
                      {job.location}
                    </span>

                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {job.description}
                  </p>

                  <div className="border-t border-gray-100 pt-3 flex items-center justify-end ">

                    {applied ? (

                      <button
                        onClick={() => handleRemove(applied._id)}
                        className="flex items-center gap-1 text-xs font-semibold text-red-600 border border-red-200 px-4 py-1.5 rounded hover:bg-red-50"
                      >
                        <X size={13} />
                        Withdraw
                      </button>

                    ) : (

                      <button
                        onClick={() => setSelectedJob(job)}
                        className="flex items-center gap-1 text-xs font-semibold text-white bg-blue-400 hover:bg-blue-500 px-4 py-1.5 rounded"
                      >
                        <FileText size={13} />
                        Apply Now
                      </button>

                    )}

                  </div>

                </div>

              );

            })}

          </div>

        </div>

      </div>
      {selectedJob && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

    <div className="bg-white w-full max-w-md rounded-lg shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h2 className="text-base font-bold text-gray-800">
            Apply for this Job
          </h2>

          <p className="text-xs text-blue-700 font-semibold mt-0.5">
            {selectedJob.name}
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedJob(null);
            setResume(null);
          }}
          className="text-gray-400 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      </div>

      {/* Form */}

      <form onSubmit={handleApply}>

        <div className="px-6 py-5">

          <label className="block text-xs font-semibold text-gray-500 mb-2">
            Upload Resume *
          </label>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
            className="border border-gray-300 rounded w-full p-2"
            required
          />

        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">

          <button
            type="button"
            onClick={() => {
              setSelectedJob(null);
              setResume(null);
            }}
            className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 text-sm font-semibold text-white bg-blue-700 rounded"
          >
            Submit Application
          </button>

        </div>

      </form>

    </div>

  </div>
)}

    </div>

  );

}