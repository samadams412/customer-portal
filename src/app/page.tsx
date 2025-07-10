import Link from "next/link"
import { Button } from "@/components/ui/button"
import HeroSection from "@/components/app-ui/home/HeroSection"
import PromoBanner from "@/components/app-ui/home/PromoBanner"
import WhyShopWithUs from "@/components/app-ui/home/WhyShopWithUs"
import Footer from "@/components/app-ui/home/Footer"
// import HomePageAnimation from '@/components/app-ui/HomePageAnimation';
// import { images } from '@/components/ui/images';

export default function Home() {
  return (
    <main className="">
      <PromoBanner/>
      <HeroSection/>
      <WhyShopWithUs/>
      <Footer/>
    </main>
  )
}
