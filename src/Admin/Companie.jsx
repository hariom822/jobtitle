import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, Search, Building2, X, SlidersHorizontal } from "lucide-react";
import API from "../api"
export default function Companie() {

  const initialState = {
    companiename: "", email: "", phone: "", password: "",
    companydescription: "", companyaddress: "", website: "", logo: ""
  };

  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/companie/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const filterdata = res.data.filter(x => x.status === "approved");
      setCompanies(filterdata);
      setError("");
    } catch (err) {
      setError("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/companie/add`, formData);
      fetchCompanies();
      setAddOpen(false);
      setFormData(initialState);
    } catch (err) { alert("Add Company Failed"); }
  };

  const handleEditOpen = (company) => {
    setFormData({ ...company, password: "" });
    setEditId(company._id);
    setEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/companie/update/${editId}`, formData);
      fetchCompanies();
      setEditOpen(false);
      setFormData(initialState);
    } catch (err) { alert("Update Failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company?")) return;
    try {
      await axios.delete(`${API}/companie/delete/${id}`);
      fetchCompanies();
    } catch (err) { alert("Delete Failed"); }
  };

  const filteredCompanies = companies
    .filter(c => c.companiename.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.companiename.localeCompare(b.companiename)
        : b.companiename.localeCompare(a.companiename)
    );

  return (
    <div className="bg-gray-100 min-h-screen pt-28 pb-10">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 mb-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 size={20} className="text-blue-700" />
            <h1 className="text-lg font-bold text-gray-800">Company Management</h1>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-0.5 rounded-full">
              {filteredCompanies.length} Companies
            </span>
          </div>
          <button
            onClick={() => { setFormData(initialState); setAddOpen(true); }}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2 rounded transition"
          >
            <Plus size={15} />
            Add Company
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
              placeholder="Search company by name..."
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
        {loading && (
          <div className="text-center py-10 text-sm text-gray-500">Loading companies...</div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded mb-4">{error}</div>
        )}

        {/* Table */}
        {!loading && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Company", "Email", "Phone", "Website", "Description", "Address", "Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400 text-sm">
                      No companies found.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((c) => (
                    <tr key={c._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      {/* Company Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {c.logo ? (
                            <img src={c.logo} alt="" className="w-7 h-7 rounded object-contain border border-gray-100 flex-shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                              <Building2 size={13} className="text-blue-600" />
                            </div>
                          )}
                          <span className="font-semibold text-gray-800">{c.companiename}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{c.email}</td>
                      <td className="px-4 py-3 text-gray-600">{c.phone || "—"}</td>
                      <td className="px-4 py-3">
                        {c.website
                          ? <a href={c.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate max-w-24 block">{c.website}</a>
                          : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-40">
                        <p className="line-clamp-2">{c.companydescription || "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-36">
                        <p className="line-clamp-2">{c.companyaddress || "—"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditOpen(c)}
                            className="flex items-center gap-1 text-xs font-semibold text-gray-600 border border-gray-300 px-2.5 py-1.5 rounded hover:bg-gray-50 transition"
                          >
                            <Pencil size={11} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
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
        <CompanyModal
          title="Add Company"
          onClose={() => setAddOpen(false)}
          onSubmit={handleAdd}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {/* Edit Modal */}
      {editOpen && (
        <CompanyModal
          title="Edit Company"
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
function CompanyModal({ title, onClose, onSubmit, formData, setFormData }) {
  const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 bg-white placeholder-gray-400";

  const fields = [
    { key: "companiename", placeholder: "Company Name", type: "text", required: true, full: true },
    { key: "email",        placeholder: "Email",         type: "email", required: true },
    { key: "phone",        placeholder: "Phone",         type: "text" },
    { key: "password",     placeholder: "Password",      type: "password" },
    { key: "website",      placeholder: "Website URL",   type: "text" },
    { key: "logo",         placeholder: "Logo URL",      type: "text" },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl max-h-screen flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-bold text-gray-800">{title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">Fill in the company details below</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded transition">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          <form onSubmit={onSubmit} id="company-form">
            <div className="grid grid-cols-2 gap-4">
              {fields.map(({ key, placeholder, type, required, full }) => (
                <div key={key} className={full ? "col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    {placeholder} {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    required={required}
                    className={inputCls}
                  />
                </div>
              ))}

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                <textarea
                  placeholder="Brief about the company..."
                  value={formData.companydescription}
                  onChange={(e) => setFormData({ ...formData, companydescription: e.target.value })}
                  rows={3}
                  className={inputCls + " resize-none"}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Address</label>
                <textarea
                  placeholder="Company address..."
                  value={formData.companyaddress}
                  onChange={(e) => setFormData({ ...formData, companyaddress: e.target.value })}
                  rows={2}
                  className={inputCls + " resize-none"}
                />
              </div>
            </div>
          </form>
        </div>

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
            form="company-form"
            className="px-6 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition"
          >
            Save Company
          </button>
        </div>
      </div>
    </div>
  );
}
