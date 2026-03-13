import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api"
export default function FullProfile() {

  const candidateId = localStorage.getItem("candidateId");
  const token = localStorage.getItem("token");
  const infoId = localStorage.getItem("fullinfoId");
  console.log("candidateId in full profile", candidateId);
  // console.log("token in full profile", token);

  const initialState = {
    dateOfBirth: "",
    gender: "",
    education: {
      degree: "",
      university: "",
      passingYear: "",
      percentage: ""
    },
    experience: [],
    skills: [],
    linkedin: "",
    github: "",
    portfolio: "",
    bio: "",
    profileImage: ""
  };

  const [formData, setFormData] = useState(initialState);
  const [prevData, setPrevData] = useState(initialState);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

 
  const [modalType, setModalType] = useState(null); 
  const [modalIndex, setModalIndex] = useState(null); 
  const [modalForm, setModalForm] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
     fetchFullInfo();
  }, []);

  const fetchFullInfo = async () => {
    try {
      console.log("Fetching full info for infoId:", infoId);
      const res = await axios.get(
        `${API}/fullinfo/one/${infoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
     console.log("fetched full info", res.data);
      if (res.data) {
        setFormData({
          ...initialState,
          ...res.data,
           _id: res.data._id, 
          education: {
            ...initialState.education,
            ...(res.data.education || {})
          },
          experience: res.data.experience || [],
          skills: res.data.skills || []
        });
        setPrevData({
          ...initialState,
          ...res.data,
           _id: res.data._id, 
          education: {
            ...initialState.education,
            ...(res.data.education || {})
          },
          experience: res.data.experience || [],
          skills: res.data.skills || []
        });
      }
      console.log("fetched full info", res.data);
    } catch (error) {
      console.log("No existing profile found");
    }
  };

  // ================= SKILLS =================
  const addSkill = () => {
    if (!skillInput.trim()) return;

    if (formData.skills.includes(skillInput.trim())) {
      setSkillInput("");
      return;
    }

    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, skillInput.trim()]
    }));

    setSkillInput("");
  };

  const removeSkill = async (index) => {
  const skill = formData.skills[index];

  try {
    await axios.post(
      `${API}/fullinfo/delete-profile/${infoId}`,
      { skill },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    fetchFullInfo();

  } catch (error) {
    console.log(error);
  }
};

  const addExperience = () => {
    openModal('experience', null);
  };

 const removeExperience = async (index) => {
  const expId = formData.experience[index]._id;

  try {
    await axios.post(
      `${API}/fullinfo/delete-profile/${infoId}`,
      { experienceId: expId },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    fetchFullInfo();

  } catch (error) {
    console.log(error);
  }
};

  

  const handleSave = async () => {
    try {
      setLoading(true);

      console.log("Saving profile................payload:", modalForm);
      console.log("infoId:", infoId);
      // always use the generic save route – it will create if missing or update existing
      const res = await axios.post(
        `${API}/fullinfo/update/${infoId}`,
        modalForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Saved profile:", res.data);
      alert("Profile Saved Successfully");
      fetchFullInfo(); // reload data
    } catch (error) {
      console.log(error);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, index = null) => {
    setModalType(type);
    setModalIndex(index);
    if (type === 'personal') {
      setModalForm({
        dateOfBirth: formData.dateOfBirth || '',
        gender: formData.gender || ''
      });
    } else if (type === 'education') {
      setModalForm({
        ...formData.education
      });
    } else if (type === 'experience') {
      if (index !== null) {
        setModalForm({ ...formData.experience[index] });
      } else {
        setModalForm({
          companyName: '',
          role: '',
          startDate: '',
          endDate: '',
          description: ''
        });
      }
    } else if (type === 'skill') {
      if (index !== null) {
        setModalForm({ name: formData.skills[index] });
      } else {
        setModalForm({ name: '' });
      }
    } else if (type === 'additional') {
      const field = index;
      setModalForm({ field, value: formData[field] || '' });
    }
  };

  const closeModal = () => {
    setModalType(null);
    setModalIndex(null);
    setModalForm({});
  };

  const saveModal = async () => {
    if (modalType === 'personal') {
      setFormData(prev => ({
        ...prev,
        dateOfBirth: modalForm.dateOfBirth,
        gender: modalForm.gender
      }));
    } else if (modalType === 'education') {
      setFormData(prev => ({
        ...prev,
        education: { ...prev.education, ...modalForm }
      }));
    } else if (modalType === "experience") {

  // EDIT
  if (modalIndex !== null) {
    await editExperience(modalIndex);
  }
  else {

    const updatedExperience = [...formData.experience, modalForm];

    setFormData(prev => ({
      ...prev,
      experience: updatedExperience
    }));

  }

} else if (modalType === "skill") {

  // EDIT
  if (modalIndex !== null) {
    await editSkill(modalIndex);
  }

  // ADD
  else {

    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, modalForm.name]
    }));

  }

} else if (modalType === 'additional') {
      setFormData(prev => ({ ...prev, [modalIndex]: modalForm.value }));
    }
    await handleSave();
    closeModal();
  };
const editSkill = async (index) => {

  try {

    await axios.post(
      `${API}/fullinfo/edit-profile/${infoId}`,
      {
        index,
        skill: modalForm.name
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    fetchFullInfo();

  } catch (error) {
    console.log(error);
  }

};
const editExperience = async (index) => {

  try {

    await axios.post(
      `${API}/fullinfo/edit-profile/${infoId}`,
      {
        experienceId: formData.experience[index]._id,
        ...modalForm
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    fetchFullInfo();

  } catch (error) {
    console.log(error);
  }

};
const handleFieldDelete = async (field) => {
  try {
    setLoading(true);

    await axios.post(
      `${API}/fullinfo/delete-profile/${infoId}`,
      { field },   // ✅ sirf field bhejna hai
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    fetchFullInfo(); // refresh data from backend

  } catch (error) {
    console.error(error);
    alert("Error deleting field");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="space-y-6 mt-15 p-10">

      {/* PERSONAL INFO CARD */}
     <div className="bg-white shadow rounded-xl p-6">
  <h2 className="text-xl font-bold mb-4">Personal Information</h2>

  <div className="border border-gray-200 shadow-sm p-5 rounded-lg bg-white">
    <div className="grid grid-cols-2 gap-y-3 text-sm">

      {/* Date of Birth */}
      <span className="text-gray-500 font-bold">Date of Birth:</span>
      <span className="text-gray-800">
        {prevData.dateOfBirth
          ? new Date(prevData.dateOfBirth).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : <span className="text-gray-400">(Not set)</span>}
      </span>

      {/* Gender */}
      <span className="text-gray-500 font-bold">Gender:</span>
      <span className="text-gray-800">
        {prevData.gender || <span className="text-gray-400">(Not set)</span>}
      </span>

    </div>
  </div>

  <button
    type="button"
    onClick={() => openModal("personal")}
    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
  >
    {prevData.dateOfBirth || prevData.gender ? "Edit" : "Add"}
  </button>
</div>

      {/* EDUCATION CARD */}
   <div className="bg-white shadow rounded-xl p-6">
  <h2 className="text-xl font-bold mb-4">Education</h2>

  {prevData.education?.degree ? (
    <div className="border border-gray-200 shadow-sm p-5 rounded-lg bg-white">
      
      <div className="grid grid-cols-2 gap-y-2 text-sm">

        <span className="text-gray-500 font-bold">Degree:</span>
        <span className="text-gray-800">
          {prevData.education.degree || "-"}
        </span>

        <span className="text-gray-500 font-bold">University:</span>
        <span className="text-gray-800">
          {prevData.education.university || "-"}
        </span>

        <span className="text-gray-500 font-bold">Passing Year:</span>
        <span className="text-gray-800">
          {prevData.education.passingYear || "-"}
        </span>

        <span className="text-gray-500 font-bold">Percentage:</span>
        <span className="text-gray-800">
          {prevData.education.percentage ? `${prevData.education.percentage}%` : "-"}
        </span>

      </div>

    </div>
  ) : (
    <p className="text-gray-400">No education added</p>
  )}

  <button
    type="button"
    onClick={() => openModal("education")}
    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
  >
    {prevData.education?.degree ? "Edit" : "Add"}
  </button>
</div>

      {/* EXPERIENCE CARDS */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Experience</h2>
<div className="space-y-4">
  {formData.experience.map((exp, index) => (
    <div
      key={index}
      className="border border-gray-200 shadow-sm p-5 rounded-lg bg-white"
    >
      <div className="grid grid-cols-2 gap-y-2 text-sm">

        <span className="text-gray-500 font-bold">Company Name:</span>
        <span className="text-gray-800">
          {exp.companyName || "(Not Provided)"}
        </span>

        <span className="text-gray-500 font-bold">Role / Position:</span>
        <span className="text-gray-800">
          {exp.role || "-"}
        </span>

        <span className="text-gray-500 font-bold">Start Date:</span>
        <span className="text-gray-800">
          {new Date(exp.startDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>

        <span className="text-gray-500 font-bold">End Date:</span>
        <span className="text-gray-800">
          {new Date(exp.endDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>

        <span className="text-gray-500 font-bold">Description:</span>
        <span className="text-gray-800">
          {exp.description || "-"}
        </span>

      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={() => openModal("experience", index)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => removeExperience(index)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>

        <button
          type="button"
          onClick={addExperience}
          className="bg-blue-500 text-white px-3 py-1 rounded mt-4"
        >
          + Add Experience
        </button>
      </div>

      {/* SKILLS */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Skills</h2>

        <div className="space-y-3">
          {formData.skills.map((skill, index) => (
            <div
              key={index}
              className="flex justify-between items-center border p-3 rounded"
            >
              <span>{skill}</span>
              <div>
                <button
                  type="button"
                  onClick={() => openModal('skill', index)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removeSkill(index);
                  }}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => openModal('skill')}
          className="mt-4 bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Add Skill
        </button>
      </div>

      {/* ADDITIONAL INFO */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Additional Information</h2>

        <div className="space-y-4">
          {['linkedin','github','portfolio','bio'].map((field) => (
            <div
              key={field}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <span className="font-semibold capitalize">{field}:</span>
                <p className="text-sm">
                  {formData[field] || <span className="text-gray-400 ">(none)</span>}
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => openModal('additional', field)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  {formData[field] ? 'Edit' : 'Add'}
                </button>
                {formData[field] && (
                  <button
                    type="button"
                    onClick={() => handleFieldDelete(field)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL (add/edit) */}
      {modalType && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {modalType === 'experience'
                ? (modalIndex !== null ? 'Edit Experience' : 'Add Experience')
                : modalType === 'personal'
                ? 'Personal Information'
                : 'Education'}
            </h3>

            {/* form fields */}
            {modalType === 'personal' && (
              <>
                <label className="block mb-1">Date of Birth</label>
                <input
                  type="date"
                  className="border p-2 rounded w-full mb-3"
                  value={modalForm.dateOfBirth || ''}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, dateOfBirth: e.target.value })
                  }
                />
                <label className="block mb-1">Gender</label>
                <select
                  value={modalForm.gender || ''}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, gender: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-3"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </>
            )}

            {modalType === 'education' && (
              <>
                <label className="block mb-1">Degree</label>
                <input
                  type="text"
                  value={modalForm.degree || ''}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, degree: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <label className="block mb-1">University</label>
                <input
                  type="text"

                  value={modalForm.university || ''}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, university: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <label className="block mb-1">Passing Year</label>
                <input
                  type="number"
                  value={modalForm.passingYear || ''}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, passingYear: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <label className="block mb-1">Percentage</label>
                <input
                  type="number"
                  value={modalForm.percentage || ''}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, percentage: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-3"
                />
              </>
            )}

            {modalType === 'experience' && (
              <>
                <label className="block mb-1">Company Name</label>
                <input
                  type="text"
                  value={modalForm.companyName || ''}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, companyName: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <label className="block mb-1">Role</label>
                <input
                  type="text"
                  value={modalForm.role || ''}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, role: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <label className="block mb-1">Start Date</label>
                <input
                  type="date"
                  value={modalForm.startDate || ''}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, startDate: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <label className="block mb-1">End Date</label>
                <input
                  type="date"
                  value={modalForm.endDate || ''}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, endDate: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-2"
                />
                <label className="block mb-1">Description</label>
                <textarea
                  value={modalForm.description || ''}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, description: e.target.value }) //Education
                  }
                  className="border p-2 rounded w-full mb-3"
                />
              </>
            )}
            {modalType === 'additional' && (
  <>
    <label className="block mb-1 capitalize">
      {modalForm.field}
    </label>

    {modalForm.field === "bio" ? (
      <textarea
        value={modalForm.value || ""}
        onChange={(e) =>
          setModalForm({ ...modalForm, value: e.target.value })
        }
        className="border p-2 rounded w-full mb-3"
      />
    ) : (
      <input
        type="text"
        value={modalForm.value || ""}
        onChange={(e) =>
          setModalForm({ ...modalForm, value: e.target.value })
        }
        className="border p-2 rounded w-full mb-3"
      />
      
    )}
  </>
)}
            {modalType === 'skill' && (
              <>
                <label className="block mb-1">Skill</label>
                <input
                  type="text"
                  value={modalForm.name || ''}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, name: e.target.value })
                  }
                  className="border p-2 rounded w-full mb-3"
                />
              </>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveModal}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {modalType === 'experience' && modalIndex === null
                  ? 'Add'
                  : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVE BUTTON */}
      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>

    </div>
  );
}