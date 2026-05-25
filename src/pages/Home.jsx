import HeroSection from "../components/home/HeroSection";
import MarqueeStrip from "../components/home/MarqueeStrip";
import FeaturedPosts from "../components/home/FeaturedPosts";
import WhyPinkPages from "../components/home/WhyPinkPages";
import StatsBanner from "../components/home/StatsBanner";
import CTABanner from "../components/home/CTABanner";
import WaveDivider from "../components/home/WaveDivider";
import { Helmet } from "react-helmet-async";

function Home() {
  return (
    <>
      <Helmet>
        <title>Home | PinkPages</title>
      </Helmet>
      <HeroSection />
      {/* <WaveDivider topColor="#FCF5EE" bottomColor="#f9a8d4" /> */}
      <MarqueeStrip />
      {/* <WaveDivider topColor="#f9a8d4" bottomColor="#FCF5EE" /> */}
      <FeaturedPosts />
      <WaveDivider topColor="#FCF5EE" bottomColor="white" flip />
      <WhyPinkPages />
      <WaveDivider topColor="#FCF5EE" bottomColor="white" />
      <StatsBanner />
      {/* <WaveDivider topColor="#f472b6" bottomColor="#FCF5EE" flip /> */}
      <CTABanner />
    </>
  );
}

export default Home;
