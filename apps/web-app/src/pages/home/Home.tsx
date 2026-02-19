import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
 
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-white border-b">
        <h1 className="text-xl font-bold text-slate-800">
          🏥 Clinical Intelligence System
        </h1>
 
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
 
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </header>
 
      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-6">
        <h2 className="text-4xl font-bold text-slate-900">
          Patient Appointment & Clinic Management Platform
        </h2>
 
        <p className="mt-4 text-lg text-slate-600 max-w-xl">
          Book appointments, manage patient records, and access clinical history
          securely from any branch.
        </p>
 
        <div className="mt-8 flex gap-4">
          <Link to="/login">
            <Button className="px-8 py-5 text-lg">
              Access Dashboard
            </Button>
          </Link>
 
          <Link to="/register">
            <Button
              variant="outline"
              className="px-8 py-5 text-lg"
            >
              New Patient Registration
            </Button>
          </Link>
        </div>
      </main>
 
      {/* Footer */}
      <footer className="py-4 text-center text-sm text-slate-500">
        © 2026 Clinical Intelligence System — Secure Healthcare Platform
      </footer>
    </div>
  );
}
 