type Role= 
| "patient"
| "doctor"
| "admin"

interface User{
    role: string;
    roles(roles: any): unknown;
    id:string;
    email:string;

}

export type {Role,User}