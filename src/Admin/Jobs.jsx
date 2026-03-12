import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, Search, Briefcase, MapPin, IndianRupee, SlidersHorizontal, X } from "lucide-react";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({ name: "", description: "", location: "", salary: "" });

  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8800/job/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/job/add", formData);
      fetchJobs();
      setAddOpen(false);
      setFormData({ name: "", description: "", location: "", salary: "" });
    } catch (err) { alert("Add Job Failed"); }
  };

  const handleEditOpen = (job) => {
    setFormData(job);
    setEditId(job._id);
    setEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8800/job/update/${editId}`, formData);
      fetchJobs();
      setFormData({ name: "", description: "", location: "", salary: "" });
      setEditOpen(false);
    } catch (err) { alert("Update Failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await axios.delete(`http://localhost:8800/job/delete/${id}`);
      fetchJobs();
    } catch (err) { alert("Delete Failed"); }
  };

  const openAddModal = () => {
    setFormData({ name: "", description: "", location: "", salary: "" });
    setAddOpen(true);
  };

const filteredJobs = jobs
  .filter(job => (job.name || "").toLowerCase().includes(search.toLowerCase()))
  .sort((a, b) =>
    sortOrder === "asc"
      ? (a.name || "").localeCompare(b.name || "")
      : (b.name || "").localeCompare(a.name || "")
  );
  return (
    <div className="bg-gray-100 min-h-screen pt-28 pb-10">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 mb-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase size={20} className="text-blue-700" />
            <h1 className="text-lg font-bold text-gray-800">Jobs Management</h1>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-0.5 rounded-full">
              {filteredJobs.length} Jobs
            </span>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2 rounded transition"
          >
            <Plus size={15} />
            Add Job
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">

        {/* Search + Sort */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 flex-1 min-w-48 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-100 bg-white">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search job by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 bg-white">
            <SlidersHorizontal size={14} className="text-gray-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="text-sm outline-none text-gray-700 bg-transparent cursor-pointer"
            >
              <option value="asc">Name A–Z</option>
              <option value="desc">Name Z–A</option>
            </select>
          </div>
        </div>

        {/* States */}
        {loading && <div className="text-center py-10 text-sm text-gray-500">Loading jobs...</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded mb-4">{error}</div>}

        {/* Table */}
        {!loading && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Job Title", "Location", "Salary", "Job Type", "Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-400 text-sm">
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job._id} className="border-b border-gray-100 hover:bg-gray-50 transition">

                      {/* Job Title */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                            <Briefcase size={13} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{job.name || job.title}</p>
                            {job.experience && <p className="text-xs text-gray-400">{job.experience}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <MapPin size={12} className="text-gray-400" />
                          {job.location || "—"}
                        </span>
                      </td>

                      {/* Salary */}
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <IndianRupee size={12} className="text-gray-400" />
                          {job.salary || "—"}
                        </span>
                      </td>

                      {/* Job Type */}
                      <td className="px-4 py-3">
                        {job.jobtype ? (
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border
                            ${job.jobtype === "Full Time" ? "bg-green-50 text-green-700 border-green-200" :
                              job.jobtype === "Part Time" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                              job.jobtype === "Internship" ? "bg-blue-50 text-blue-700 border-blue-200" :
                              "bg-purple-50 text-purple-700 border-purple-200"}`}>
                            {job.jobtype}
                          </span>
                        ) : <span className="text-gray-400">—</span>}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditOpen(job)}
                            className="flex items-center gap-1 text-xs font-semibold text-gray-600 border border-gray-300 px-2.5 py-1.5 rounded hover:bg-gray-50 transition"
                          >
                            <Pencil size={11} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="flex items-center gap-1 text-xs font-semibold text-red-600 border border-red-200 px-2.5 py-1.5 rounded hover:bg-red-50 transition"
                          >
                            <Trash2 size={11} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {addOpen && (
        <JobModal
          title="Add Job"
          onClose={() => setAddOpen(false)}
          onSubmit={handleAdd}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {/* Edit Modal */}
      {editOpen && (
        <JobModal
          title="Edit Job"
          onClose={() => setEditOpen(false)}
          onSubmit={handleUpdate}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </div>
  );
}

// ── Modal ──
function JobModal({ title, onClose, onSubmit, formData, setFormData }) {
  const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 bg-white placeholder-gray-400";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-bold text-gray-800">{title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">Fill in job details below</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded transition">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} id="job-form">
          <div className="px-6 py-5 flex flex-col gap-4">

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior React Developer"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Mumbai, Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Salary (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 50000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe the role and responsibilities..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={inputCls + " resize-none"}
                required
              />
            </div>

          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="job-form"
            className="px-6 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition"
          >
            Save Job
          </button>
        </div>
      </div>
    </div>
  );
}
