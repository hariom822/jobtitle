import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  MapPin,
  IndianRupee,
  Briefcase,
  Upload,
  X,
  CheckCircle,
  Clock,
  GraduationCap,
  Users,
  Calendar,
  FileText,
} from "lucide-react";
import API from "../api"
function JobTypeBadge({ type }) {
  const styles = {
    "Full Time":  "bg-green-50 text-green-700 border border-green-200",
    "Part Time":  "bg-yellow-50 text-yellow-700 border border-yellow-200",
    "Internship": "bg-blue-50 text-blue-700 border border-blue-200",
    "Contract":   "bg-purple-50 text-purple-700 border border-purple-200",
  };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${styles[type] || "bg-gray-100 text-gray-600 border border-gray-200"}`}>
      {type || "N/A"}
    </span>
  );
}

export default function CompanyJobsPublic() {
  const { id } = useParams();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/job/myjobs/${id}`);
      setJobs(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `${API}/application/my/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(res.data);
    } catch (err) { console.log(err); }
  };

  const isApplied = (jobId) => {
    return applications.find((app) => {
      if (typeof app.jobId === "object") return app.jobId._id === jobId;
      return app.jobId === jobId;
    });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) { alert("Please upload resume"); return; }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("jobId", selectedJob._id);
      formData.append("userId", userId);
      formData.append("resume", resume);
      await axios.post(`${API}/application/add`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert("Applied Successfully ✅");
      setSelectedJob(null);
      setResume(null);
      fetchApplications();
    } catch (err) {
      console.log(err);
      alert("Error applying job");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (applicationId) => {
    try {
      await axios.delete(`${API}/application/delete/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Application Removed ❌");
      fetchApplications();
    } catch (err) { console.log(err); }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-16 pb-10">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 mb-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase size={20} className="text-blue-700" />
            <h1 className="text-lg font-bold text-gray-800">Company Jobs</h1>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-0.5 rounded-full">
              {jobs.length} Openings
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">

        {/* Empty */}
        {jobs.length === 0 && (
          <div className="bg-white border border-dashed border-gray-300 rounded-lg py-20 text-center">
            <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No job openings available right now.</p>
          </div>
        )}

        {/* Job Cards */}
        <div className="flex flex-col gap-3">
          {jobs.map((job) => {
            const applied = isApplied(job._id);
            return (
              <div
                key={job._id}
                className="bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition p-5"
              >
                {/* Title Row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-base font-bold text-blue-700">{job.title}</h2>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <JobTypeBadge type={job.jobtype} />
                    {applied && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                        <CheckCircle size={11} />
                        Applied
                      </span>
                    )}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-5 mb-3">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <IndianRupee size={13} className="text-gray-400" />
                    {job.salary} / month
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={13} className="text-gray-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Briefcase size={13} className="text-gray-400" />
                    {job.experience || "Any Experience"}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
                  {job.description}
                </p>

                {/* Skills */}
                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <span key={skill} className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium px-3 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex flex-wrap gap-5 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      <b className="text-gray-700">{job.vacancies}</b>&nbsp;Vacancies
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap size={12} />
                      {job.education || "Any Education"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Deadline:&nbsp;
                      <b className="text-gray-700">
                        {job.deadline
                          ? new Date(job.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : "N/A"}
                      </b>
                    </span>
                  </div>

                  {/* Apply / Remove Button */}
                  {applied ? (
                    <button
                      onClick={() => handleRemove(applied._id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-200 px-4 py-1.5 rounded hover:bg-red-50 transition"
                    >
                      <X size={13} />
                      Withdraw
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 px-4 py-1.5 rounded transition"
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

      {/* Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-base font-bold text-gray-800">Apply for this Job</h2>
                <p className="text-xs text-blue-700 font-semibold mt-0.5">{selectedJob.title}</p>
              </div>
              <button
                onClick={() => { setSelectedJob(null); setResume(null); }}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleApply}>
              <div className="px-6 py-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Upload Resume <span className="text-red-500">*</span>
                </label>

                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  {resume ? (
                    <span className="text-sm font-semibold text-blue-700">{resume.name}</span>
                  ) : (
                    <>
                      <span className="text-sm text-gray-500">Click to upload resume</span>
                      <span className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX supported</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setResume(e.target.files[0])}
                  />
                </label>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => { setSelectedJob(null); setResume(null); }}
                  className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Applying..." : "Submit Application"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
