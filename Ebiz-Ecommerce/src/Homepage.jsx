import React from "react";

import { Header } from "./Header";
import SubHeader from "./SubHeader";
import SliderSection from "./Components/Slidersection";
import WhyShopWithUs from "./Components/Whyshopwithus";
import ArrivalSection from "./Components/Arrivalsection";
import SubscribeSection from "./Components/Subscribesection";
import Footer from "./Components/Footer";
import ClientSection from "./Components/Clientsection";
import CategorySection from "./Components/Categortsection";
import LastFooter from "./Components/LastFooter";
import ProductCollections from "./Components/ProductCollections";
import SocialMediaGallery from "./Components/SocialMediaGallery";
import BrandSection from "./Components/BrandSection";

const HomePage = () => {
  return (
    <div className="font-sans text-gray-800">
      <Header />
      <SubHeader />

      <SliderSection />
      <WhyShopWithUs />
      <ProductCollections />
      <ArrivalSection />
      <CategorySection />
      <BrandSection />
      <SubscribeSection />
      <ClientSection />
      <SocialMediaGallery />
      <Footer />
      <LastFooter />

    </div>
  );
};

export default HomePage;

