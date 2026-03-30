
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

export default function Notification() {

const userid = localStorage.getItem("userId");
console.log("userid>>",userid)
const token = localStorage.getItem("token");

const [notifications,setNotifications] = useState([]);

useEffect(()=>{
fetchNotifications();
},[]);


const fetchNotifications = async()=>{
try{

const res = await axios.get(
`http://localhost:8800/notification/user/${userid}`,
{headers:{Authorization:`Bearer ${token}`}}
);
console.log(res.data)
setNotifications(res.data);

}catch(err){
console.log(err);
}
};


// mark as read
const markRead = async(id)=>{
try{

await axios.put(
`http://localhost:8800/notification/read/${id}`,
{},
{headers:{Authorization:`Bearer ${token}`}}
);

fetchNotifications();

}catch(err){
console.log(err);
}
};


return(

<div className="max-w-3xl mx-auto mt-20 p-6">

<h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
<Bell size={22}/>
Notifications
</h2>

{notifications.length===0 && (
<div className="text-gray-500 text-center mt-10">
No notifications yet
</div>
)}

<div className="space-y-3">

{notifications.map((n)=>(
<div
key={n._id}
onClick={()=>markRead(n._id)}
className={`p-4 border rounded-lg cursor-pointer transition
${n.isRead ? "bg-white" : "bg-blue-50"}
`}
>

<p className="font-medium text-gray-800">
{n.title}
</p>

<p className="text-sm text-gray-600 mt-1">
{n.message}
</p>

<p className="text-xs text-gray-400 mt-2">
{new Date(n.createdAt).toLocaleString()}
</p>

</div>
))}

</div>

</div>

);
}
