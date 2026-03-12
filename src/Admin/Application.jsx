// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Trash2, Pencil, CheckCircle, XCircle } from "lucide-react";

// export default function Application() {

//   const [applications, setApplications] = useState([]);
//   const [filteredStatus, setFilteredStatus] = useState("all");
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const token = localStorage.getItem("token");

//   const fetchApplications = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("http://localhost:8800/application/all", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       console.log("applications", res.data);
//       setApplications(res.data);
//       console.log("applications", res.data);
//       setError("");
//     } catch (err) {
//       setError("Failed to fetch applications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8800/application/delete/${id}`);
//       fetchApplications();
//     } catch (err) {
//       alert("Delete Failed");
//     }
//   };

//   const updateStatus = async (id, status) => {
//     try {
//       await axios.post(
//         `http://localhost:8800/application/update/${id}`,
//         { status }
//       );
//       fetchApplications();
//     } catch (err) {
//       alert("Status Update Failed");
//     }
//   };

//   // ================= FILTERING =================
//   const filteredApplications = applications
//     .filter(app =>
//       filteredStatus === "all" ? true : app.status === filteredStatus
//     )
//     .filter(app =>
//       app.jobId?.name?.toLowerCase().includes(search.toLowerCase())
//     );

//   const pendingCount = applications.filter(a => a.status === "pending").length;
//   const acceptedCount = applications.filter(a => a.status === "accepted").length;
//   const rejectedCount = applications.filter(a => a.status === "rejected").length;

//   return (
//     <div className=" p-6 bg-gray-100 min-h-screen">

//       <h1 className="text-3xl font-bold mb-6">Application Management</h1>

//       {/* ===== STATUS BUTTONS ===== */}
//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={() => setFilteredStatus("pending")}
//           className="bg-yellow-500 text-white px-4 py-2 rounded"
//         >
//           Pending ({pendingCount})
//         </button>

//         <button
//           onClick={() => setFilteredStatus("accepted")}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//         >
//           Accepted ({acceptedCount})
//         </button>

//         <button
//           onClick={() => setFilteredStatus("rejected")}
//           className="bg-red-600 text-white px-4 py-2 rounded"
//         >
//           Rejected ({rejectedCount})
//         </button>

//         <button
//           onClick={() => setFilteredStatus("all")}
//           className="bg-gray-600 text-white px-4 py-2 rounded"
//         >
//           All
//         </button>
//       </div>

//       {/* ===== SEARCH ===== */}
//       <input
//         type="text"
//         placeholder="Search by Job Name..."
//         className="p-2 border rounded w-1/3 mb-4"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {/* ===== TABLE ===== */}
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-3">User</th>
//               <th className="p-3">Job</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Applied At</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredApplications.map((app) => (
//               <tr key={app._id} className="border-t">
//                 <td className="p-3">{app.userId?.name}</td>
//                 <td className="p-3">{app.jobId?.name}</td>
//                 <td className="p-3 capitalize">{app.status}</td>
//                 <td className="p-3">
//                   {new Date(app.appliedAt).toLocaleDateString()}
//                 </td>

//                 <td className="p-3 flex gap-3">

//                   {/* Accept */}
//                   <CheckCircle
//                     size={18}
//                     className="text-green-600 cursor-pointer"
//                     onClick={() => updateStatus(app._id, "accepted")}
//                   />

//                   {/* Reject */}
//                   <XCircle
//                     size={18}
//                     className="text-red-600 cursor-pointer"
//                     onClick={() => updateStatus(app._id, "rejected")}
//                   />

//                   {/* Delete */}
//                   <Trash2
//                     size={18}
//                     className="text-gray-700 cursor-pointer"
//                     onClick={() => handleDelete(app._id)}
//                   />

//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Plus,
  Briefcase,
  MapPin,
  FileText,
  Edit,
  Trash2,
  Users,
  GraduationCap,
  X,
  IndianRupee,
  Calendar,
} from "lucide-react";

function JobTypeBadge({ type }) {
  const styles = {
    "Full Time":  "bg-green-50 text-green-700 border border-green-200",
    "Part Time":  "bg-yellow-50 text-yellow-700 border border-yellow-200",
    "Internship": "bg-blue-50 text-blue-700 border border-blue-200",
    "Contract":   "bg-purple-50 text-purple-700 border border-purple-200",
  };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles[type] || "bg-gray-100 text-gray-600 border border-gray-200"}`}>
      {type || "N/A"}
    </span>
  );
}

export default function CompanyJobs() {
  const companieId = localStorage.getItem("companieId");
  const token = localStorage.getItem("token");

  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", location: "", salary: "",
    jobtype: "", experience: "", skills: "", education: "",
    vacancies: "", deadline: "",
  });

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/job/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(res.data);
    } catch (err) { console.log(err); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => {
    setForm({ title:"", description:"", location:"", salary:"", jobtype:"", experience:"", skills:"", education:"", vacancies:"", deadline:"" });
    setEditId(null);
    setOpen(true);
  };

  const openEdit = (job) => {
    setForm({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      salary: job.salary || "",
      jobtype: job.jobtype || "",
      experience: job.experience || "",
      skills: job.skills?.join(",") || "",
      education: job.education || "",
      vacancies: job.vacancies || "",
      deadline: job.deadline ? job.deadline.substring(0, 10) : "",
    });
    setEditId(job._id);
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.location || !form.salary) {
      alert("Please fill all required fields");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        salary: form.salary,
        jobtype: form.jobtype,
        experience: form.experience,
        skills: form.skills ? form.skills.split(",").map((s) => s.trim()) : [],
        education: form.education,
        vacancies: form.vacancies ? Number(form.vacancies) : 1,
        deadline: form.deadline,
        companyid: companieId,
      };
      if (editId) {
        await axios.post(`http://localhost:8800/job/update/${editId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post("http://localhost:8800/job/add", payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      setLoading(false);
      setOpen(false);
      setForm({ title:"", description:"", location:"", salary:"", jobtype:"", experience:"", skills:"", education:"", vacancies:"", deadline:"" });
      fetchJobs();
    } catch (err) {
      console.log(err.response?.data || err);
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await axios.delete(`http://localhost:8800/job/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchJobs();
    } catch (err) { console.log(err); }
  };

  const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 bg-white placeholder-gray-400";

  return (
    <div className="bg-gray-100 min-h-screen pt-27 pb-10">

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 py-4 mb-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase size={20} className="text-blue-700" />
            <h1 className="text-lg font-bold text-gray-800">Manage Job Postings</h1>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-0.5 rounded-full">
              {jobs.length} Active
            </span>
          </div>
          
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Jobs Posted", value: jobs.length },
            { label: "Total Vacancies", value: jobs.reduce((a, j) => a + (Number(j.vacancies) || 0), 0) },
            { label: "Job Types", value: [...new Set(jobs.map((j) => j.jobtype).filter(Boolean))].length },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {jobs.length === 0 && (
          <div className="bg-white border border-dashed border-gray-300 rounded-lg py-20 text-center">
            <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No jobs posted yet. Click <b>Post a Job</b> to get started.</p>
          </div>
        )}

        {/* Job Cards */}
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition p-5"
            >
              {/* Title Row */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base font-bold text-blue-700 cursor-pointer hover:underline">
                  {job.title}
                </h3>
                <JobTypeBadge type={job.jobtype} />
              </div>

              {/* Meta Info */}
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

                {/* Actions */}
                <div className="flex gap-2">
                  <Link to={`/company/jobapplications/${job._id}`}>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 border border-blue-600 px-3 py-1.5 rounded hover:bg-blue-50 transition">
                      <Users size={13} />
                      Applications
                    </button>
                  </Link>
                  <button
                    onClick={() => openEdit(job)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition"
                  >
                    <Edit size={13} />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteJob(job._id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-200 px-3 py-1.5 rounded hover:bg-red-50 transition"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl max-h-screen flex flex-col">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-t-lg">
              <div>
                <h2 className="text-base font-bold text-gray-800">
                  {editId ? "Edit Job Posting" : "Post a New Job"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editId ? "Update the details below" : "Fill in details to post this job"}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto px-6 py-5 flex-1">
              <div className="grid grid-cols-2 gap-4">

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input name="title" placeholder="e.g. Senior React Developer" value={form.title} onChange={handleChange} className={inputCls} />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea name="description" placeholder="Describe the role and responsibilities..." value={form.description} onChange={handleChange} rows={3} className={inputCls + " resize-none"} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input name="location" placeholder="e.g. Mumbai, Remote" value={form.location} onChange={handleChange} className={inputCls} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Salary (₹) <span className="text-red-500">*</span>
                  </label>
                  <input name="salary" placeholder="e.g. 50000" value={form.salary} onChange={handleChange} className={inputCls} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Job Type</label>
                  <select name="jobtype" value={form.jobtype} onChange={handleChange} className={inputCls}>
                    <option value="">Select Job Type</option>
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Experience</label>
                  <input name="experience" placeholder="e.g. 2-4 years" value={form.experience} onChange={handleChange} className={inputCls} />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Skills</label>
                  <input name="skills" placeholder="e.g. React, Node.js, MongoDB (comma separated)" value={form.skills} onChange={handleChange} className={inputCls} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Education</label>
                  <input name="education" placeholder="e.g. B.Tech, Any Graduate" value={form.education} onChange={handleChange} className={inputCls} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Vacancies</label>
                  <input name="vacancies" placeholder="e.g. 3" value={form.vacancies} onChange={handleChange} className={inputCls} />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Application Deadline</label>
                  <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className={inputCls} />
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : editId ? "Update Job" : "Post Job"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
