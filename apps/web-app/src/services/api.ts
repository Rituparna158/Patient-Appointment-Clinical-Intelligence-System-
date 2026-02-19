const API_BASE = "http://localhost:4001/api";

export async function api(endpoint:string,options:RequestInit={}){
    const res = await fetch(`${API_BASE}${endpoint}`,{
        headers:{
            "Content-Type":"application/json",
        },
        credentials:"include",
        ...options,
    });
    const data = await res.json();

    if(!res.ok) throw new Error(data.message);

    return data;
}