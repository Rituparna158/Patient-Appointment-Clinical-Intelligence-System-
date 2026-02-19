type Role= 
| "patient"
| "doctor"
| "admin"

interface User{
    id:string;
    email:string;

}

export type {Role,User}