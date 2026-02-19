const API_BASE = "http://localhost:8080/api";

export async function api(endpoint:string,options:RequestInit={}){
    const res = await fetch(`${API_BASE}${endpoint}`,{
        headers:{
            "Content-Type":"application/json",
        },
        credentials:"include",
        ...options,
    });
    let data;

    try{
        data=await res.json();
    }catch{
        throw new Error("Server did not return json")
    }
  

    if(!res.ok){ 
        console.log("Backend error:",data);
        throw new Error(data.message || "Request failed");}

    return data;
}