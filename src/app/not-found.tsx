import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 text-center">
      <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-3">Page Not Found</h2>
      <Link href="/products" className="text-blue-600 dark:text-blue-400 hover:underline text-lg">
        Go back to Products
      </Link>
    </div>
  );
}
