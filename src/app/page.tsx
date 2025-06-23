// src/app/page.tsx
import Link from "next/link"; // Import Link for navigation
import { Button } from "@/components/ui/button"; // Assuming this is your Shadcn UI Button
import HomePageAnimation from '@/components/ui/homePageAnimation'; //Adding product animation
import { images } from '@/components/ui/images';


export default function Home() {
  return (
    // Use Tailwind flexbox utilities to center content vertically and horizontally
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 p-4">
      <HomePageAnimation I ={images}/>
      <h1 className="text-6xl sm:text-6xl md:text-6xl font-extrabold text-center mb-8 drop-shadow-xl leading-tight">
        Welcome to Your
      <p className="text-5xl text-blue-600 dark:text-blue-400">Grocery Portal</p>
      </h1>
      <p className="text-xl sm:text-xl text-center max-w-2xl mb-12 text-gray-700 dark:text-gray-300">
        Discover amazing products tailored just for you. Start exploring our collection now!
      </p>

      {/* Wrap the Button with Next.js Link for client-side navigation */}
      <Link href="/products" passHref>
        {/* Use Shadcn UI Button component and apply Tailwind classes for sizing and visual appeal */}
        <Button
          className="px-8 py-4 text-lg sm:text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105
                     bg-blue-600 text-white hover:bg-blue-700
                     dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Shop Now
        </Button>
      </Link>
    </div>
  );
}
