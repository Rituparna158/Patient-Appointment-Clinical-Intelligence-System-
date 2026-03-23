import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold">403 - Unauthorized</h1>

      <p className="mt-2 text-muted-foreground">
        You do not have permission to access this page.
      </p>

      <Link to="/" className="mt-4 text-primary underline">
        Go back home
      </Link>
    </div>
  );
}



