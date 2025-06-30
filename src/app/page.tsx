import Link from "next/link"
import { Button } from "@/components/ui/button"
// import HomePageAnimation from '@/components/app-ui/HomePageAnimation';
// import { images } from '@/components/ui/images';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-accentBrand text-foreground p-4">
      {/* <HomePageAnimation I={images} /> */}

      <h1 className="text-6xl sm:text-6xl md:text-6xl font-extrabold text-center mb-8 drop-shadow-xl leading-tight">
        Welcome to Your
        <p className="text-5xl text-primary">Grocery Portal</p>
      </h1>

      <p className="text-xl sm:text-xl text-center max-w-2xl mb-12 text-accent-brand">
        Discover amazing products tailored just for you. Start exploring our collection now!
      </p>

      <Link href="/products" passHref>
        <Button
          className="px-8 py-4  bg-black text-white  dark:bg-accent text-lg sm:text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          variant="actionGreen"
        >
          Shop Now
        </Button>
      </Link>
    </div>
  )
}
