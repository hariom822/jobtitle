import React,{useEffect,useState} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
CheckCircle,
XCircle,
Trash2,
User,
Mail,
MapPin,
Briefcase
} from "lucide-react";
import API from "../api"
export default function JobApplications(){

const {jobId} = useParams();
const token = localStorage.getItem("token");

const [applications,setApplications] = useState([]);
const [filter,setFilter] = useState("all");

useEffect(()=>{
fetchApps();
},[]);

const fetchApps = async()=>{

const res = await axios.get(
`${API}/application/jobapplications/${jobId}`,
{headers:{Authorization:`Bearer ${token}`}}
);

setApplications(res.data);

};

const updateStatus = async(id,status)=>{

await axios.post(
`${API}/application/update/${id}`,
{status},
{headers:{Authorization:`Bearer ${token}`}}
);

fetchApps();

};

const deleteApplication = async(id)=>{

if(!window.confirm("Delete Application?")) return;

await axios.delete(
`${API}/application/delete/${id}`,
{headers:{Authorization:`Bearer ${token}`}}
);

fetchApps();

};

const filteredApplications =
filter === "all"
? applications
: applications.filter(app=>app.status===filter);

const pendingCount = applications.filter(a=>a.status==="pending").length;
const acceptedCount = applications.filter(a=>a.status==="accepted").length;
const rejectedCount = applications.filter(a=>a.status==="rejected").length;

return(

<div className="p-10 mt-14 bg-gray-50 min-h-screen">

<h1 className="text-3xl font-semibold mb-8">
Job Applications
</h1>

{/* FILTER TABS */}

<div className="flex gap-8 border-b pb-3 mb-8 text-lg">

<button
onClick={()=>setFilter("pending")}
className={`font-semibold pb-2 ${
filter==="pending"
? "border-b-2 border-black"
: "text-gray-500"
}`}
>
Pending ({pendingCount})
</button>

<button
onClick={()=>setFilter("accepted")}
className={`font-semibold pb-2 ${
filter==="accepted"
? "border-b-2 border-black"
: "text-gray-500"
}`}
>
Accepted ({acceptedCount})
</button>

<button
onClick={()=>setFilter("rejected")}
className={`font-semibold pb-2 ${
filter==="rejected"
? "border-b-2 border-black"
: "text-gray-500"
}`}
>
Rejected ({rejectedCount})
</button>

<button
onClick={()=>setFilter("all")}
className={`font-semibold pb-2 ${
filter==="all"
? "border-b-2 border-black"
: "text-gray-500"
}`}
>
All
</button>

</div>

{/* APPLICATION LIST */}

<div className="grid gap-6">

{filteredApplications.map(app=>(

<div
key={app._id}
className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition"
>

<h2 className="text-xl font-semibold mb-4">
Candidate Information
</h2>

<div className="grid grid-cols-2 gap-4 text-sm">

<p className="flex items-center gap-2">
<User size={16}/>
<b>Name :</b> {app.userId?.name}
</p>

<p className="flex items-center gap-2">
<Mail size={16}/>
<b>Email :</b> {app.userId?.email}
</p>

<p className="flex items-center gap-2">
<Briefcase size={16}/>
<b>Job :</b> {app.jobId?.name}
</p>

<p className="flex items-center gap-2">
<MapPin size={16}/>
<b>Location :</b> {app.jobId?.location}
</p>

<p>
<b>Status :</b>
<span className={`ml-2 font-semibold ${
app.status==="accepted"
? "text-green-600"
: app.status==="rejected"
? "text-red-600"
: "text-yellow-600"
}`}>
{app.status}
</span>
</p>

<p>
<b>Applied :</b>
{new Date(app.createdAt).toLocaleDateString()}
</p>

</div>

{/* RESUME */}

{app.resume && (

<div className="mt-4">

<a
href={app.resume}
target="_blank"
rel="noreferrer"
className="text-blue-600 text-sm underline"
>
View Resume
</a>

</div>

)}

{/* ACTION BUTTONS */}

<div className="flex gap-3 mt-6">

<button
onClick={()=>updateStatus(app._id,"accepted")}
className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-green-50"
>
<CheckCircle size={18}/>
Accept
</button>

<button
onClick={()=>updateStatus(app._id,"rejected")}
className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-red-50"
>
<XCircle size={18}/>
Reject
</button>

<button
onClick={()=>deleteApplication(app._id)}
className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100"
>
<Trash2 size={18}/>
Delete
</button>

</div>

</div>

))}

</div>

</div>

);

}