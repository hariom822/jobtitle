import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard, Briefcase, Building2, FileText,
  Users, BookOpen, Clock, LogOut, User, ChevronDown,
  Newspaper,
} from "lucide-react";

export default function Header() {
  const [userdata, setUserdata] = useState(null);
  const [openUser, setOpenUser] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const id = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8800/users/oneuser/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserdata(res.data.user);
    } catch (error) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenUser(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const adminLinks = [
    { label: "Dashboard",     path: "/",              icon: LayoutDashboard },
    { label: "Jobs",          path: "/jobs",           icon: Briefcase },
    { label: "Companies",     path: "/companie",       icon: Building2 },
    { label: "Applications",  path: "/application",    icon: FileText },
    { label: "Candidates",    path: "/candidate",      icon: Users },
    { label: "All Posts",     path: "/alladitpost",    icon: BookOpen },
    { label: "Pending",       path: "/panding",        icon: Clock },
  ];

  const panelLabel = {
    admin:   "Admin Panel",
    companie: "Company Panel",
  };

  return (
    <>
      {/* ── Main Navbar ── */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Brand */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-7 h-7 bg-blue-700 rounded flex items-center justify-center">
              <Briefcase size={14} className="text-white" />
            </div>
            <span className="text-base font-bold text-gray-800">
              {panelLabel[role] || "JobPortal"}
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* All Posts Button */}
            <button
              onClick={() => navigate("/post")}
              className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded transition border
                ${location.pathname === "/post"
                  ? "bg-blue-700 text-white border-blue-700"
                  : "border-blue-600 text-blue-700 hover:bg-blue-50"}`}
            >
              <Newspaper size={14} />
              All Posts
            </button>

            {/* User Avatar + Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpenUser(!openUser)}
                className="flex items-center gap-2 border border-gray-200 rounded-full pl-1 pr-3 py-1 hover:bg-gray-50 transition"
              >
                <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {userdata?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-semibold text-gray-700 max-w-24 truncate hidden sm:block">
                  {userdata?.name}
                </span>
                <ChevronDown size={13} className="text-gray-400" />
              </button>

              {openUser && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-bold text-gray-800 truncate">{userdata?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{userdata?.email}</p>
                    <span className="inline-block mt-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full capitalize">
                      {userdata?.role}
                    </span>
                  </div>

                  {/* Menu Items */}
                  <ul className="py-1">
                    <li
                      onClick={() => { navigate("/profile"); setOpenUser(false); }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <User size={14} className="text-gray-400" />
                      Profile
                    </li>
                    <li
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer border-t border-gray-100"
                    >
                      <LogOut size={14} />
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Admin Sub-Nav ── */}
      {role === "admin" && (
        <div className="fixed top-14 left-0 w-full z-40 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-1 overflow-x-auto">
            {adminLinks.map(({ label, path, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-3 whitespace-nowrap border-b-2 transition
                    ${active
                      ? "border-blue-700 text-blue-700"
                      : "border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-300"}`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
