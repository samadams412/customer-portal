import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-3">Page Not Found</h2>
      <Link
        href="/products"
        className="text-secondary hover:underline text-lg"
      >
        Go back to Products
      </Link>
    </div>
  )
}
