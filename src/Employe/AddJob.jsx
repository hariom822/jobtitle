import React,{useState} from "react";
import axios from "axios";
import { X,Briefcase,MapPin,IndianRupee,Clock } from "lucide-react";

export default function AddJob({companyId,onClose,onSuccess}){

const token = localStorage.getItem("token");

const [form,setForm] = useState({
name:"",
description:"",
location:"",
salary:"",
jobtype:"",
experience:"",
skills:"",
vacancies:""
});

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const handleSubmit=async(e)=>{
e.preventDefault();

try{

await axios.post(
"http://localhost:8800/job",
{
...form,
skills:form.skills.split(","),
companyid:companyId
},
{
headers:{Authorization:`Bearer ${token}`}
}
);

onSuccess();
onClose();

}catch(err){
console.log(err);
}

};

return(

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white w-[600px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-8 relative">

{/* CLOSE BUTTON */}

<button
onClick={onClose}
className="absolute right-5 top-5 text-gray-500 hover:text-black"
>
<X size={22}/>
</button>

<h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
<Briefcase size={22}/> Add New Job
</h2>

<form onSubmit={handleSubmit} className="grid gap-4">

<input
name="name"
placeholder="Job Title"
onChange={handleChange}
className="border p-3 rounded-lg"
/>

<textarea
name="description"
placeholder="Job Description"
onChange={handleChange}
className="border p-3 rounded-lg"
/>

<div className="grid grid-cols-2 gap-4">

<input
name="location"
placeholder="Location"
onChange={handleChange}
className="border p-3 rounded-lg"
/>

<input
name="salary"
placeholder="Salary"
onChange={handleChange}
className="border p-3 rounded-lg"
/>

</div>

<div className="grid grid-cols-2 gap-4">

<select
name="jobtype"
onChange={handleChange}
className="border p-3 rounded-lg"
>
<option value="">Job Type</option>
<option>Full Time</option>
<option>Part Time</option>
<option>Internship</option>
</select>

<input
name="experience"
placeholder="Experience (ex: 2 years)"
onChange={handleChange}
className="border p-3 rounded-lg"
/>

</div>

<input
name="skills"
placeholder="Skills (React,Node,MongoDB)"
onChange={handleChange}
className="border p-3 rounded-lg"
/>

<input
name="vacancies"
placeholder="Vacancies"
onChange={handleChange}
className="border p-3 rounded-lg"
/>

<button
type="submit"
className="bg-black text-white py-3 rounded-lg mt-2 hover:bg-gray-800"
>
Post Job
</button>

</form>

</div>

</div>

);

}