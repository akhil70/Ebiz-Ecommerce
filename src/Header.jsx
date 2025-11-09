import React, { useState } from 'react';
import "./style.css"
import { ShoppingCart, Search, Menu, X, Truck, DollarSign, Award, ChevronLeft, ChevronRight } from 'lucide-react';

// Header Component
export  const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-orange-500">FAMMS</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-900 hover:text-orange-500 font-medium">Home</a>
            <div className="relative group">
              <button className="text-gray-700 hover:text-orange-500 font-medium">
                Pages
              </button>
              <div className="absolute hidden group-hover:block bg-white shadow-lg mt-2 py-2 w-48">
                <a href="#about" className="block px-4 py-2 hover:bg-orange-50">About</a>
                <a href="#testimonial" className="block px-4 py-2 hover:bg-orange-50">Testimonial</a>
              </div>
            </div>
            <a href="#products" className="text-gray-700 hover:text-orange-500 font-medium">Products</a>
            <a href="#blog" className="text-gray-700 hover:text-orange-500 font-medium">Blog</a>
            <a href="#contact" className="text-gray-700 hover:text-orange-500 font-medium">Contact</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-orange-500">
              <ShoppingCart className="w-6 h-6" />
            </button>
            <button className="text-gray-700 hover:text-orange-500">
              <Search className="w-6 h-6" />
            </button>
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <a href="#home" className="block py-2 text-gray-700 hover:text-orange-500">Home</a>
            <a href="#about" className="block py-2 text-gray-700 hover:text-orange-500">About</a>
            <a href="#products" className="block py-2 text-gray-700 hover:text-orange-500">Products</a>
            <a href="#blog" className="block py-2 text-gray-700 hover:text-orange-500">Blog</a>
            <a href="#contact" className="block py-2 text-gray-700 hover:text-orange-500">Contact</a>
          </div>
        )}
      </div>
    </header>
  );
};
