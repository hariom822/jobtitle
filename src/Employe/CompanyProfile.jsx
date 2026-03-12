import React,{useState,useEffect} from "react";
import axios from "axios";

export default function CompanyProfile(){

const companyId = localStorage.getItem("companyId");
const token = localStorage.getItem("token");

const [data,setData] = useState({
companiename:"",
email:"",
phone:"",
companydescription:"",
companyaddress:""
});

useEffect(()=>{
fetchCompany();
},[]);

const fetchCompany = async()=>{

try{

const res = await axios.get(
`http://localhost:8800/company/${companyId}`,
{headers:{Authorization:`Bearer ${token}`}}
);

setData(res.data);

}catch(err){
console.log(err);
}

};

const handleChange=(e)=>{
setData({...data,[e.target.name]:e.target.value});
};

const handleUpdate = async()=>{

try{

await axios.put(
`http://localhost:8800/company/update/${companyId}`,
data,
{headers:{Authorization:`Bearer ${token}`}}
);

alert("Company updated");

}catch(err){
console.log(err);
}

};

return(

<div className="p-8 mt-16">

<h2 className="text-2xl font-bold mb-4">
Company Profile
</h2>

<input
name="companiename"
value={data.companiename}
onChange={handleChange}
placeholder="Company Name"
className="border p-2 w-full mb-3"
/>

<input
name="phone"
value={data.phone}
onChange={handleChange}
placeholder="Phone"
className="border p-2 w-full mb-3"
/>

<textarea
name="companydescription"
value={data.companydescription}
onChange={handleChange}
placeholder="Description"
className="border p-2 w-full mb-3"
/>

<input
name="companyaddress"
value={data.companyaddress}
onChange={handleChange}
placeholder="Address"
className="border p-2 w-full mb-3"
/>

<button
onClick={handleUpdate}
className="bg-blue-600 text-white px-4 py-2 rounded"
>
Update Company
</button>

</div>

);

}