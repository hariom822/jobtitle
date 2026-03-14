import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Mail, Phone, Camera, UserCircle2, ChevronRight, Briefcase,
  Building2, FileText, LogOut,
} from "lucide-react";
import API from "../api"
export default function CandidateSidebar() {
  const [candidate, setCandidate] = useState(null);
  const [fullInfo, setFullInfo] = useState(null);

  const userId = localStorage.getItem("userId");
  const candidateId = localStorage.getItem("candidateId");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const userRes = await axios.get(
        `${API}/users/oneuser/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const user = userRes.data.user;
      setCandidate(user);
      const email = user?.email;
      if (email) {
        const fullRes = await axios.get(
          `${API}/fullinfo/oneemail/${email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFullInfo(fullRes.data.full);
        localStorage.setItem("fullinfoId", fullRes.data.full._id);
      }
    } catch (error) {
      console.log("Sidebar fetch error", error);
    }
  };

  const handleImageClick = () => { if (fileInputRef.current) fileInputRef.current.click(); };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!candidateId) { alert("Candidate ID missing"); return; }
    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("candidateId", candidateId);
    try {
      const res = await axios.post(
        `${API}/fullinfo/upload-profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      setFullInfo(res.data.profile);
      alert("Image uploaded successfully");
    } catch (error) {
      console.log("Upload error", error);
      alert("Image upload failed");
    }
  };

  const profileFields = [
    candidate?.name, candidate?.email, candidate?.phone,
    fullInfo?.profileImage, fullInfo?.skills, fullInfo?.resume,
  ];
  const filled = profileFields.filter(Boolean).length;
  const percent = Math.round((filled / profileFields.length) * 100);

  return (
    <div className="w-64 flex-shrink-0  ">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-20">

        {/* Top blue banner */}
        <div className="h-16 bg-blue-400" />

        {/* Profile Image */}
        <div className="px-5 pb-4 relative">
          <div
            onClick={handleImageClick}
            className="w-20 h-20 rounded-full border-4 border-white overflow-hidden cursor-pointer -mt-10 bg-gray-100 relative group"
          >
            <img
              src={fullInfo?.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREh8TIFWYXVR4v4TeSVn20PTQ5WNaF5IteeQ&s"}
              alt="profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <Camera size={16} className="text-white" />
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />

          {/* Name + Email */}
          <h2 className="mt-2 text-sm font-bold text-gray-800 truncate">
            {candidate?.name || "Your Name"}
          </h2>
          <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 truncate">
            <Mail size={11} className="flex-shrink-0" />
            {candidate?.email || "email@example.com"}
          </p>
          {candidate?.phone && (
            <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <Phone size={11} className="flex-shrink-0" />
              {candidate.phone}
            </p>
          )}
        </div>

        {/* Profile Completion */}
        <div className="px-5 pb-4 border-t border-gray-100 pt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-gray-600">Profile Completion</span>
            <span className="text-xs font-bold text-blue-500">{percent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          {percent < 100 && (
            <p className="text-xs text-gray-400 mt-1">Complete your profile to get more visibility</p>
          )}
        </div>

        {/* Complete Profile Button */}
        <div className="px-5 pb-4">
          <button
            onClick={() => navigate("/fullprofile")}
            className="w-full flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded transition"
          >
            <UserCircle2 size={14} />
            Complete Profile
          </button>
        </div>

        {/* Navigation Links */}
        <div className="border-t border-gray-100">
          {[
            { icon: Briefcase, label: "My Post", path: "/mypost" },
            { icon: Building2, label: "Browse Companies", path: "/candidate/allcompanies" },
          ].map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="w-full flex items-center justify-between px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition border-b border-gray-50 last:border-0"
            >
              <span className="flex items-center gap-2.5">
                <Icon size={15} className="text-gray-400" />
                {label}
              </span>
              <ChevronRight size={13} className="text-gray-300" />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
