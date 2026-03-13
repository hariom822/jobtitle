import React from "react";
import { Link } from "react-router-dom";
import API from "../api"
export default function EmployeeDashboard(){

return(

<div className="p-8 mt-15">

<h1 className="text-3xl font-bold mb-6">
Company Dashboard
</h1>

<div className="grid grid-cols-3 gap-6">

<Link to="/employee/company">
<div className="bg-white shadow p-6 rounded-xl cursor-pointer">
<h2 className="font-semibold text-lg">
Company Profile
</h2>
<p className="text-gray-500">
View or update company details
</p>
</div>
</Link>

<Link to="/employee/jobs">
<div className="bg-white shadow p-6 rounded-xl cursor-pointer">
<h2 className="font-semibold text-lg">
Manage Jobs
</h2>
<p className="text-gray-500">
Add or manage job posts
</p>
</div>
</Link>

<Link to="/employee/applications">
<div className="bg-white shadow p-6 rounded-xl cursor-pointer">
<h2 className="font-semibold text-lg">
Applications
</h2>
<p className="text-gray-500">
See who applied for jobs
</p>
</div>
</Link>

</div>

</div>

);

}