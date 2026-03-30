import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, Building2, MapPin, X, Plus, Globe, Phone, Mail, Lock } from "lucide-react";
import API from "../api"
export default function AllCompanies() {

  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [open, setOpen] = useState(false);

  const userid = localStorage.getItem("userId");

  const [form, setForm] = useState({
    companiename: "", email: "", phone: "", password: "",
    companydescription: "", companyaddress: "", website: "", logo: "", userId: userid,
  });

  const navigate = useNavigate();

  useEffect(() => { fetchCompanies(); }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${API}/companie/all`);
      const filterdata = res.data.filter(x => x.status === "approved");
      setCompanies(filterdata);
      setFiltered(filterdata);
    } catch (err) { console.log(err); }
  };

  const handleSearch = () => {
    let result = companies.filter(c =>
      c.companiename.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "az") result.sort((a, b) => a.companiename.localeCompare(b.companiename));
    if (sort === "za") result.sort((a, b) => b.companiename.localeCompare(a.companiename));
    setFiltered(result);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companiename || !form.email || !form.password) {
      alert("Please fill required fields");
      return;
    }
    try {
       console.log(form)
     const data= await axios.post(`${API}/companie/add`, form);
     console.log(data)
      alert("Company Created Successfully");
      setOpen(false);
      setForm({ companiename:"", email:"", phone:"", password:"", companydescription:"", companyaddress:"", website:"", logo:"", userId:"" });
      fetchCompanies();
    } catch (err) {
      if (err.response) alert(err.response.data.message);
      else alert("Server Error");
    }
  };

  const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 bg-white placeholder-gray-400";

  return (
    <div className="bg-gray-100 min-h-screen pt-16 pb-10">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 mb-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 size={20} className="text-blue-700" />
            <h1 className="text-lg font-bold text-gray-800">Companies</h1>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-0.5 rounded-full">
              {filtered.length} Listed
            </span>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2 rounded transition"
          >
            <Plus size={15} />
            Register Company
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">

        {/* Search + Sort Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 border border-gray-300 rounded px-3 py-2 min-w-64 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-100 bg-white">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search company by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); handleSearch(); }}
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-600 bg-white"
          >
            <option value="">Sort By</option>
            <option value="az">Name A–Z</option>
            <option value="za">Name Z–A</option>
          </select>
          <button
            onClick={handleSearch}
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2 rounded transition"
          >
            Search
          </button>
        </div>

        {/* Empty */}
        {filtered.length === 0 && (
          <div className="bg-white border border-dashed border-gray-300 rounded-lg py-20 text-center">
            <Building2 size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No companies found.</p>
          </div>
        )}

        {/* Company Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company) => (
            <div
              key={company._id}
              onClick={() => navigate(`/candidate/companyjobs/${company._id}`)}
              className="bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition cursor-pointer p-5 flex flex-col gap-3"
            >
              {/* Company Logo / Icon */}
              <div className="flex items-center gap-3">
                {company.logo ? (
                  <img src={company.logo} alt={company.companiename} className="w-10 h-10 rounded object-contain border border-gray-100" />
                ) : (
                  <div className="w-10 h-10 rounded bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <Building2 size={18} className="text-blue-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-sm font-bold text-gray-800 leading-tight">{company.companiename}</h2>
                  {company.website && (
                    <p className="text-xs text-blue-600 mt-0.5 truncate">{company.website}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              {company.companyaddress && (
                <p className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{company.companyaddress}</span>
                </p>
              )}

              {/* Description */}
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                {company.companydescription || "No description available."}
              </p>

              {/* Footer */}
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <span className="text-xs text-blue-700 font-semibold">View Jobs →</span>
                <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Approved
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Company Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl max-h-screen flex flex-col">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-base font-bold text-gray-800">Register Your Company</h2>
                <p className="text-xs text-gray-500 mt-0.5">Fill in details to register your company</p>
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
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">

                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input name="companiename" placeholder="e.g. Tata Consultancy Services" value={form.companiename} onChange={handleChange} className={inputCls} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input type="email" name="email" placeholder="company@email.com" value={form.email} onChange={handleChange} className={inputCls} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Phone
                    </label>
                    <input type="text" name="phone" placeholder="+91 XXXXXXXXXX" value={form.phone} onChange={handleChange} className={inputCls} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input type="password" name="password" placeholder="Create password" value={form.password} onChange={handleChange} className={inputCls} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Website</label>
                    <input type="text" name="website" placeholder="https://yourcompany.com" value={form.website} onChange={handleChange} className={inputCls} />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Logo URL</label>
                    <input type="text" name="logo" placeholder="https://logo-image-url.com" value={form.logo} onChange={handleChange} className={inputCls} />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Company Address</label>
                    <input type="text" name="companyaddress" placeholder="e.g. Mumbai, Maharashtra" value={form.companyaddress} onChange={handleChange} className={inputCls} />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                    <textarea name="companydescription" placeholder="Brief about your company..." value={form.companydescription} onChange={handleChange} rows={3} className={inputCls + " resize-none"} />
                  </div>

                </div>

                {/* Modal Footer inside form */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition"
                  >
                    Register Company
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
