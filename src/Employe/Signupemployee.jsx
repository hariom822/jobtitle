import axios from "axios";
import { useState } from "react";
import { User, Mail, Phone, Lock, IndianRupee, CreditCard, Upload } from "lucide-react";

export default function EmployeeSignup(){

const [data,setData] = useState({
name:"",
email:"",
phone:"",
password:"",
salary:"",
menttype:"",
pannumbert:"",
status:"active"
});

const [profileimage,setProfileImage] = useState(null);
const [addherimage,setAddherImage] = useState(null);

const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

const handleChange=(e)=>{
setData({...data,[e.target.name]:e.target.value});
};

const handleSubmit= async(e)=>{
e.preventDefault();

setError("");

if(!data.name || !data.email || !data.phone || !data.password){
setError("Please fill all required fields");
return;
}

try{

setLoading(true);

const formData = new FormData();

Object.keys(data).forEach(key=>{
formData.append(key,data[key]);
});

formData.append("profileimage",profileimage);
formData.append("addherimage",addherimage);

await axios.post(
"http://localhost:8800/employe/",
formData,
{
headers:{
"Content-Type":"multipart/form-data"
}
}
);

alert("Employee Added Successfully");

setData({
name:"",
email:"",
phone:"",
password:"",
salary:"",
menttype:"",
pannumbert:"",
status:"active"
});

setProfileImage(null);
setAddherImage(null);

}catch(err){

console.log(err);
setError("Something went wrong. Try again.");

}finally{
setLoading(false);
}

};

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

<form
onSubmit={handleSubmit}
className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg"
>

<h2 className="text-2xl font-semibold mb-6 text-center">
Employee Signup
</h2>

{error && (
<p className="text-red-600 text-sm mb-4">
{error}
</p>
)}

{/* NAME */}

<div className="mb-4 flex items-center border rounded px-3 py-2">
<User size={18}/>
<input
type="text"
name="name"
placeholder="Full Name"
value={data.name}
onChange={handleChange}
className="ml-2 w-full outline-none"
/>
</div>

{/* EMAIL */}

<div className="mb-4 flex items-center border rounded px-3 py-2">
<Mail size={18}/>
<input
type="email"
name="email"
placeholder="Email"
value={data.email}
onChange={handleChange}
className="ml-2 w-full outline-none"
/>
</div>

{/* PHONE */}

<div className="mb-4 flex items-center border rounded px-3 py-2">
<Phone size={18}/>
<input
type="text"
name="phone"
placeholder="Phone"
value={data.phone}
onChange={handleChange}
className="ml-2 w-full outline-none"
/>
</div>

{/* PASSWORD */}

<div className="mb-4 flex items-center border rounded px-3 py-2">
<Lock size={18}/>
<input
type="password"
name="password"
placeholder="Password"
value={data.password}
onChange={handleChange}
className="ml-2 w-full outline-none"
/>
</div>

{/* SALARY */}

<div className="mb-4 flex items-center border rounded px-3 py-2">
<IndianRupee size={18}/>
<input
type="text"
name="salary"
placeholder="Salary"
value={data.salary}
onChange={handleChange}
className="ml-2 w-full outline-none"
/>
</div>

{/* EMPLOYMENT TYPE */}

<div className="mb-4">
<input
type="text"
name="menttype"
placeholder="Employment Type (Full Time / Part Time)"
value={data.menttype}
onChange={handleChange}
className="border rounded px-3 py-2 w-full"
/>
</div>

{/* PAN */}

<div className="mb-4 flex items-center border rounded px-3 py-2">
<CreditCard size={18}/>
<input
type="text"
name="pannumbert"
placeholder="PAN Number"
value={data.pannumbert}
onChange={handleChange}
className="ml-2 w-full outline-none"
/>
</div>

{/* PROFILE IMAGE */}

<div className="mb-4">

<label className="text-sm font-medium">
Profile Image
</label>

<div className="flex items-center gap-3 mt-1 border p-2 rounded">
<Upload size={18}/>
<input
type="file"
onChange={(e)=>setProfileImage(e.target.files[0])}
/>
</div>

</div>

{/* AADHAR IMAGE */}

<div className="mb-6">

<label className="text-sm font-medium">
Aadhar Image
</label>

<div className="flex items-center gap-3 mt-1 border p-2 rounded">
<Upload size={18}/>
<input
type="file"
onChange={(e)=>setAddherImage(e.target.files[0])}
/>
</div>

</div>

<button
type="submit"
disabled={loading}
className="w-full bg-black text-white py-2 rounded hover:opacity-90"
>

{loading ? "Submitting..." : "Signup Employee"}

</button>

</form>

</div>

);

}