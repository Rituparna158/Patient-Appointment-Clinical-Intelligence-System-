import type {User} from "@/types/auth.types";

interface AuthState{
    user: User | null;
    token:string | null
}

interface AuthActions{
    login:(user:User)=>void;
    logout:()=>void;
}
export type {AuthActions,AuthState}