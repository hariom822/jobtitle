import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../api"

export default function Dashboard() {

  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    candidates: 0,
    companies: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });

  const [companies,setCompanies] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(()=>{
    fetchDashboardData();
  },[]);

  const fetchDashboardData = async()=>{

    try{

      const jobRes = await axios.get(`${API}/job/all`);

      const appRes = await axios.get(
        `${API}/application/all`,
        {headers:{Authorization:`Bearer ${token}`}}
      );

      const candidateRes = await axios.get(
        `${API}/candidate/all`
      );

      const companyRes = await axios.get(
        `${API}/companie/all`
      );

      const applications = appRes.data;
      const pending = applications.filter(a=>a.status==="pending").length;
      const accepted = applications.filter(a=>a.status==="accepted").length;
      const rejected = applications.filter(a=>a.status==="rejected").length;

      setStats({
        jobs:jobRes.data.length,
        applications:applications.length,
        candidates:candidateRes.data.length,
        companies:companyRes.data.length,
        pending,
        accepted,
        rejected
      });

      setCompanies(companyRes.data);

    }catch(error){
      console.log("Dashboard error",error);
    }

  };

  return (

  <div className="flex-1 bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 mt-27">

  {/* HEADER */}

  <div className="mb-8">

  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
  Admin Dashboard
  </h1>

  <p className="text-gray-500">
  Overview of jobs, candidates and companies
  </p>

  </div>


  {/* STATS */}

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

  <div className="bg-white p-6 rounded-xl border">
  <p className="text-gray-500 text-sm">Total Jobs</p>
  <h2 className="text-3xl font-bold mt-2">{stats.jobs}</h2>
  </div>

  <div className="bg-white p-6 rounded-xl border">
  <p className="text-gray-500 text-sm">Applications</p>
  <h2 className="text-3xl font-bold mt-2">{stats.applications}</h2>
  </div>

  <div className="bg-white p-6 rounded-xl border">
  <p className="text-gray-500 text-sm">Candidates</p>
  <h2 className="text-3xl font-bold mt-2">{stats.candidates}</h2>
  </div>

  <div className="bg-white p-6 rounded-xl border">
  <p className="text-gray-500 text-sm">Companies</p>
  <h2 className="text-3xl font-bold mt-2">{stats.companies}</h2>
  </div>

  </div>


  {/* APPLICATION STATUS */}

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

  <div className="bg-white border p-6 rounded-xl">
  <p className="text-gray-500 text-sm">Pending Applications</p>
  <h2 className="text-2xl font-bold mt-2 text-yellow-600">
  {stats.pending}
  </h2>
  </div>

  <div className="bg-white border p-6 rounded-xl">
  <p className="text-gray-500 text-sm">Accepted Applications</p>
  <h2 className="text-2xl font-bold mt-2 text-green-600">
  {stats.accepted}
  </h2>
  </div>

  <div className="bg-white border p-6 rounded-xl">
  <p className="text-gray-500 text-sm">Rejected Applications</p>
  <h2 className="text-2xl font-bold mt-2 text-red-600">
  {stats.rejected}
  </h2>
  </div>

  </div>


  {/* COMPANY TABLE */}

  <div className="bg-white border rounded-xl mt-10 overflow-x-auto">

  <div className="p-6 border-b">

  <h2 className="text-xl font-semibold">
  Registered Companies
  </h2>

  </div>

  <table className="w-full min-w-[600px]">

  <thead className="bg-gray-100 text-left">

  <tr>

  <th className="p-4">Company Name</th>

  <th className="p-4">Email</th>

  <th className="p-4">Phone</th>

  <th className="p-4">Address</th>

  </tr>

  </thead>

  <tbody>

  {companies.map(company=>(

  <tr key={company._id} className="border-t hover:bg-gray-50">

  <td className="p-4 font-medium">
  {company.companiename}
  </td>

  <td className="p-4 text-gray-600">
  {company.email}
  </td>

  <td className="p-4 text-gray-600">
  {company.phone || "-"}
  </td>

  <td className="p-4 text-gray-600">
  {company.companyaddress || "-"}
  </td>

  </tr>

  ))}

  </tbody>

  </table>

  </div>

  </div>

  );

}