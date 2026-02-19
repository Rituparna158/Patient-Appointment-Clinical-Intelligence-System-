import {create} from "zustand";

import type {AuthState,AuthActions} from "./auth.types";

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>((set)=>({
    user:null,
    token:null,

    login:(user)=>
        set({
            user,
        }),
    
    logout:()=>
        set({
            user:null,
            token:null,
        })

}));
export {useAuthStore};