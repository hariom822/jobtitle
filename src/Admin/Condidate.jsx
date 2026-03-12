import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Search, Users, X, Mail, Phone } from "lucide-react";

export default function Candidate() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const token = localStorage.getItem("token");

  useEffect(() => { fetchCandidates(); }, []);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:8800/candidate/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(res.data);
    } catch (error) { console.log("Fetch error", error); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this candidate?")) return;
    try {
      await axios.delete(`http://localhost:8800/candidate/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCandidates();
    } catch (error) { alert("Delete failed"); }
  };

  const openEdit = (candidate) => {
    setSelectedCandidate(candidate);
    setFormData({ name: candidate.name, email: candidate.email, phone: candidate.phone || "" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8800/candidate/update/${selectedCandidate._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Candidate updated");
      setSelectedCandidate(null);
      fetchCandidates();
    } catch (error) { alert("Update failed"); }
  };

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 bg-white placeholder-gray-400";

  return (
    <div className="bg-gray-100 min-h-screen pt-28 pb-10">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 mb-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-blue-700" />
            <h1 className="text-lg font-bold text-gray-800">Candidate Management</h1>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-0.5 rounded-full">
              {filteredCandidates.length} Candidates
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">

        {/* Search Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-5 flex items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 flex-1 max-w-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-100 bg-white">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Candidate", "Email", "Phone", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-gray-400 text-sm">
                    No candidates found.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => (
                  <tr key={candidate._id} className="border-b border-gray-100 hover:bg-gray-50 transition">

                    {/* Name with avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-700 text-xs font-bold">
                            {candidate.name?.charAt(0)?.toUpperCase() || "C"}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-800">{candidate.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Mail size={12} className="text-gray-400" />
                        {candidate.email}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <Phone size={12} className="text-gray-400" />
                        {candidate.phone || "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(candidate)}
                          className="flex items-center gap-1 text-xs font-semibold text-gray-600 border border-gray-300 px-2.5 py-1.5 rounded hover:bg-gray-50 transition"
                        >
                          <Pencil size={11} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(candidate._id)}
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
      </div>

      {/* Edit Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-base font-bold text-gray-800">Edit Candidate</h2>
                <p className="text-xs text-gray-500 mt-0.5">Update candidate details below</p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdate} id="candidate-form">
              <div className="px-6 py-5 flex flex-col gap-4">

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Candidate name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputCls}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputCls}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={inputCls}
                  />
                </div>

              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="candidate-form"
                className="px-6 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition"
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
