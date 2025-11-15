import React from "react";

import { Header } from "./Header";
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
const HomePage = () => {
  return (
    <div className="font-sans text-gray-800">
      <Header/>
      <SliderSection/>
      <WhyShopWithUs/>
      <ProductCollections />
      <ArrivalSection/>
      <CategorySection/>
      <SubscribeSection/>
      <ClientSection/>
      <SocialMediaGallery />
      <Footer/>
      <LastFooter />
     
    </div>
  );
};

export default HomePage;
