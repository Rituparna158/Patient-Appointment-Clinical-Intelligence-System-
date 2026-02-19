type Role= 
| "patient"
| "doctor"
| "admin"

interface User{
    id:string;
    name:string;
    role:Role;
}

export type {Role,User}