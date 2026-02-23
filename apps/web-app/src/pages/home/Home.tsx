import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="dashboard-layout flex flex-col">
      <header className="top-navbar">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="CIS Logo" className="h-8 w-8" />
          <h1 className="navbar-title">
            Clinical Intelligence System
          </h1>
        </div>

        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </header>

      <main className="hero-section">
        <h2 className="hero-heading">
          Patient Appointment & Clinic Management Platform
        </h2>

        <p className="hero-subtext">
          Book appointments, manage patient records, and securely
          access clinical data across branches.
        </p>

        <div className="hero-actions">
          <Link to="/login">
            <Button size="lg">
              Access Dashboard
            </Button>
          </Link>

          <Link to="/register">
            <Button variant="outline" size="lg">
              Patient Registration
            </Button>
          </Link>
        </div>
      </main>

      <footer className="app-footer">
        © 2026 Clinical Intelligence System. Secure Healthcare Platform.
      </footer>
    </div>
  );
}
