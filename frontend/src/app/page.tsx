import Experience from "@/components/landing/Experience";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Benefits from "@/components/landing/Benefits";
import HowItWorks from "@/components/landing/HowItWorks";
import CardShowcase from "@/components/landing/CardShowcase";
import Products from "@/components/landing/Products";
import Pricing from "@/components/landing/Pricing";
import ShareList from "@/components/landing/ShareList";
import Founder from "@/components/landing/Founder";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <Experience>
      <Nav />
      <Hero />
      <Benefits />
      <HowItWorks />
      <CardShowcase />
      <Products />
      <Pricing />
      <ShareList />
      <Founder />
      <Contact />
      <Footer />
    </Experience>
  );
}
