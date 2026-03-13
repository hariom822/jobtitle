import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"
export default function Profile() {

const navigate = useNavigate();

const [userdata,setUserdata] = useState(null);
const [loading,setLoading] = useState(true);
const [aditpopup,setAditPopup] = useState(false);

const [updatedata,setUpdateData] = useState({
name:"",
email:"",
phone:"",
theme:"light"
});

const id = localStorage.getItem("userId");
const role=localStorage.getItem("role")
useEffect(()=>{

const token = localStorage.getItem("token");

if(!token){
navigate("/login");
return;
}

fetchUser();

},[]);


const fetchUser = async()=>{

try{

const token = localStorage.getItem("token");

const res = await axios.get(
`${API}/users/oneuser/${id}`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setUserdata(res.data.user);

/* important part */
setUpdateData({
name:res.data.user.name || "",
email:res.data.user.email || "",
phone:res.data.user.phone || "",
theme:res.data.user.theme || "light"
});

}
catch(error){
console.log(error);
}
finally{
setLoading(false);
}

};


const profileadit = async()=>{

try{

const token = localStorage.getItem("token");

await axios.post(
`${API}/users/update/${id}`,
updatedata,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

alert("Profile Updated ✅");

setAditPopup(false);

fetchUser();

}
catch(err){
alert("Update failed");
}

};


const logout = ()=>{
localStorage.removeItem("token");
localStorage.removeItem("userId");
navigate("/login");
};


if(loading){
return(
<div className="flex justify-center items-center h-screen">
Loading Profile...
</div>
);
}


return(

<div className="min-h-screen mt-15 flex items-center justify-center bg-gray-100 p-6">

<div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

{/* Header */}

<div className="bg-indigo-600 text-white text-center py-8">

<div className="w-20 h-20 bg-white text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto">

{userdata?.name?.charAt(0).toUpperCase()}

</div>

<h2 className="mt-3 text-xl font-semibold">
{userdata?.name}
</h2>

<p className="text-sm opacity-80">
{userdata?.email}
</p>

<span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-white text-indigo-600 capitalize">
{role || "user"}
</span>

</div>

{/* Info */}

<div className="p-6 space-y-3 text-sm">

<div className="flex justify-between">
<span className="font-medium">Phone</span>
<span>{userdata?.phone || "N/A"}</span>
</div>

<div className="flex justify-between">
<span className="font-medium">Theme</span>
<span className="capitalize">{userdata?.theme}</span>
</div>

</div>

{/* Buttons */}

<div className="p-6 border-t space-y-3">

<button
onClick={()=>setAditPopup(true)}
className="w-full py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
>
✏️ Update Profile
</button>

<button
onClick={()=>navigate("/reset")}
className="w-full py-2 border border-yellow-500 text-yellow-600 rounded-lg hover:bg-yellow-50"
>
🔐 Reset Password
</button>

<button
onClick={logout}
className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
>
🚪 Logout
</button>

<button
onClick={()=>navigate("/")}
className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
>
🏠 Dashboard
</button>

</div>

</div>


{/* EDIT MODAL */}

{aditpopup && (

<div className="fixed inset-0  bg-opacity-40 flex justify-center items-center">

<div className="bg-white w-96 rounded-xl p-6 shadow-lg">

<h3 className="text-lg font-semibold mb-4">
Update Profile
</h3>

<div className="space-y-3">

<input
type="text"
placeholder="Name"
value={updatedata.name}
onChange={(e)=>setUpdateData({...updatedata,name:e.target.value})}
className="w-full border p-2 rounded"
/>

<input
type="email"
placeholder="Email"
value={updatedata.email}
onChange={(e)=>setUpdateData({...updatedata,email:e.target.value})}
className="w-full border p-2 rounded"
/>

<input
type="text"
placeholder="Phone"
value={updatedata.phone}
onChange={(e)=>setUpdateData({...updatedata,phone:e.target.value})}
className="w-full border p-2 rounded"
/>

<select
value={updatedata.theme}
onChange={(e)=>setUpdateData({...updatedata,theme:e.target.value})}
className="w-full border p-2 rounded"
>

<option value="light">Light</option>
<option value="dark">Dark</option>

</select>

</div>

<div className="flex gap-3 mt-5">

<button
onClick={profileadit}
className="flex-1 bg-indigo-600 text-white py-2 rounded"
>
Save
</button>

<button
onClick={()=>setAditPopup(false)}
className="flex-1 bg-gray-400 text-white py-2 rounded"
>
Cancel
</button>

</div>

</div>

</div>

)}

</div>

);

}