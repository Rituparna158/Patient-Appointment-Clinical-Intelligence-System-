import { Link } from "react-router-dom";
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
 
      <p className="text-gray-500 mt-2">
        The page you are looking for does not exist.
      </p>
 
      <Link
        to="/"
        className="mt-4 text-blue-500 underline"
      >
        Go back home
      </Link>
    </div>
  );
}