import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Trash2, Building2, Mail, Phone, X } from "lucide-react";
import API from "../api"
const STATUS_TABS = [
  { key: "all",      label: "All" },
  { key: "pending",  label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const statusBadge = (s) => {
  if (s === "pending")  return "bg-yellow-50 text-yellow-700 border border-yellow-200";
  if (s === "approved") return "bg-green-50 text-green-700 border border-green-200";
  if (s === "rejected") return "bg-red-50 text-red-600 border border-red-200";
  return "bg-gray-100 text-gray-600";
};

export default function CompaniesAdmin() {
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("all");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/companie/all`);
      setCompanies(res.data);
      setFiltered(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCompanies(); }, []);

  useEffect(() => {
    setFiltered(status === "all" ? companies : companies.filter(c => c.status === status));
  }, [status, companies]);

  const handleApprove = async (id) => {
    try {
      await axios.post(`${API}/companie/update/${id}`, { status: "approved" });
      fetchCompanies();
    } catch { alert("Approve Failed"); }
  };

  const openReject = (id) => { setSelectedId(id); setRejectOpen(true); };

  const handleReject = async () => {
    try {
      await axios.post(`${API}/companie/panding/${selectedId}`, { status: "rejected", rejectReason });
      setRejectOpen(false);
      setRejectReason("");
      fetchCompanies();
    } catch { alert("Reject Failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company?")) return;
    try {
      await axios.delete(`${API}/companie/delete/${id}`);
      fetchCompanies();
    } catch { alert("Delete Failed"); }
  };

  const counts = {
    all: companies.length,
    pending: companies.filter(c => c.status === "pending").length,
    approved: companies.filter(c => c.status === "approved").length,
    rejected: companies.filter(c => c.status === "rejected").length,
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-28 pb-10">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 mb-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-3">
          <Building2 size={20} className="text-blue-700" />
          <h1 className="text-lg font-bold text-gray-800">Company Approvals</h1>
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-0.5 rounded-full">
            {filtered.length} Companies
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">

        {/* Status Filter Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg p-1 mb-6 flex gap-1 w-fit">
          {STATUS_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatus(key)}
              className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded transition
                ${status === key
                  ? "bg-blue-700 text-white"
                  : "text-gray-600 hover:bg-gray-100"}`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                ${status === key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-10 text-sm text-gray-500">Loading companies...</div>}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white border border-dashed border-gray-300 rounded-lg py-20 text-center">
            <Building2 size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No companies found.</p>
          </div>
        )}

        {/* Company Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(company => (
            <div
              key={company._id}
              className="bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition p-5 flex flex-col"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {company.logo ? (
                    <img src={company.logo} alt="" className="w-9 h-9 rounded object-contain border border-gray-100 flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                      <Building2 size={16} className="text-blue-600" />
                    </div>
                  )}
                  <h2 className="text-sm font-bold text-gray-800 leading-tight">{company.companiename}</h2>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap capitalize ${statusBadge(company.status)}`}>
                  {company.status}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1 mb-3">
                <p className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Mail size={11} className="flex-shrink-0" />
                  {company.email}
                </p>
                {company.phone && (
                  <p className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Phone size={11} className="flex-shrink-0" />
                    {company.phone}
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
                {company.companydescription || "No description provided."}
              </p>

              {/* Reject Reason */}
              {company.status === "rejected" && company.rejectReason && (
                <div className="bg-red-50 border border-red-100 rounded px-3 py-2 mb-3">
                  <p className="text-xs text-red-600 font-semibold">Rejection Reason:</p>
                  <p className="text-xs text-red-500 mt-0.5">{company.rejectReason}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                <button
                  onClick={() => handleApprove(company._id)}
                  className="flex items-center gap-1 text-xs font-semibold text-green-700 border border-green-200 px-3 py-1.5 rounded hover:bg-green-50 transition flex-1 justify-center"
                >
                  <CheckCircle size={12} /> Approve
                </button>
                <button
                  onClick={() => openReject(company._id)}
                  className="flex items-center gap-1 text-xs font-semibold text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded hover:bg-yellow-50 transition flex-1 justify-center"
                >
                  <XCircle size={12} /> Reject
                </button>
                <button
                  onClick={() => handleDelete(company._id)}
                  className="flex items-center gap-1 text-xs font-semibold text-red-600 border border-red-200 px-2.5 py-1.5 rounded hover:bg-red-50 transition"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-base font-bold text-gray-800">Reject Company</h2>
                <p className="text-xs text-gray-500 mt-0.5">Provide a reason for rejection</p>
              </div>
              <button
                onClick={() => setRejectOpen(false)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Why are you rejecting this company?"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 resize-none"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              <button
                onClick={() => setRejectOpen(false)}
                className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-6 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition"
              >
                Reject Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
