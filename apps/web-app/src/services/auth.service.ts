import { api } from "./api";
 
export const AuthService = {
  // Register API
  register(data: {
    full_name: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
    date_of_birth: string;
  }) {
    return api("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
 
  // Login API
  login(email: string, password: string) {
    return api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
 
  // Logout API
  logout() {
    return api("/auth/logout", {
      method: "POST",
    });
  },
 
  // Current logged-in user
  me() {
    return api("/auth/me");
  },

  forgotPassword(email: string) {
    return api("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword(otp:string,newPassword:string) {
    return api("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({otp,newPassword }),
    });
  },
};
 