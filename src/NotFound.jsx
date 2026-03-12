import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound(){

const navigate = useNavigate();

return(

<div className="flex flex-col items-center justify-center h-screen bg-gray-100">

<h1 className="text-7xl font-bold text-blue-600 mb-4">
404
</h1>

<h2 className="text-2xl font-semibold mb-2">
Page Not Found
</h2>

<p className="text-gray-500 mb-6">
The page you are looking for does not exist.
</p>

<div className="flex gap-4">

<button
onClick={()=>navigate(-1)}
className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
>
<ArrowLeft size={18}/>
Go Back
</button>

<button
onClick={()=>navigate("/post")}
className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
<Home size={18}/>
Home
</button>

</div>

</div>

);

}