import React,{useEffect,useState} from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
import { Heart,ArrowLeft } from "lucide-react";

export default function PostDetail(){

const {id} = useParams();
const navigate = useNavigate();

const [post,setPost] = useState(null);

useEffect(()=>{
fetchPost();
},[]);

const fetchPost = async()=>{

const res = await axios.get(`http://localhost:8800/post/one/${id}`);

setPost(res.data);

};

if(!post){
return <p className="p-10">Loading...</p>;
}

return(

<div className="p-10 mt-16 bg-gray-100 min-h-screen">

{/* BACK BUTTON */}

<button
onClick={()=>navigate("/post")}
className="flex items-center gap-2 mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
<ArrowLeft size={18}/>
All Posts
</button>

<div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

{/* IMAGE */}

{post.Image && (

<img
src={post.Image}
className="w-full h-96 object-cover"
alt=""
/>

)}

<div className="p-6">

{/* USER INFO */}

<div className="flex items-center gap-3 mb-4">

<div className="w-10 h-10 rounded-full bg-gray-300"/>

<div>

<p className="font-semibold text-lg">
{post.userId?.name}
</p>

<p className="text-sm text-gray-500">
{post.userId?.email}
</p>

<p className="text-sm text-gray-400">
{new Date(post.createdAt).toLocaleString()}
</p>

</div>

</div>

{/* TITLE */}

<h1 className="text-3xl font-bold mb-3">
{post.title}
</h1>

{/* DESCRIPTION */}

<p className="text-gray-800 mb-6">
{post.description}
</p>

{/* LIKES */}

<div className="flex items-center gap-2 mb-6">

<Heart className="text-red-500 fill-red-500" size={20}/>

<span className="font-semibold">
{post.likes?.length} Likes
</span>

</div>

{/* WHO LIKED */}

<div className="mb-6">

<h3 className="font-semibold mb-2">
Liked By
</h3>

{post.likes?.map((user)=>(
<div key={user._id} className="text-sm text-gray-700">

{user.name} ({user.email})

</div>
))}

</div>

{/* COMMENTS */}

<h3 className="font-bold text-lg mb-3">
Comments
</h3>

{post.Comment?.length === 0 && (
<p className="text-gray-500">No comments yet</p>
)}

{post.Comment?.map((c)=>(

<div key={c._id} className="border-b py-3">

<p className="font-semibold">
{c.userId?.name}
</p>

<p className="text-sm text-gray-500 mb-1">
{c.userId?.email}
</p>

<p className="text-gray-800">
{c.text}
</p>

</div>

))}

</div>

</div>

</div>

);

}