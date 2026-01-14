'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// Données pour les photos de la galerie
const GALLERY_IMAGES = [
  {
    src: "/images/interieur-deux.webp",
    alt: "Nectar Luxury Experience"
  },
  {
    src: "/images/interieur-huit.webp",
    alt: "Nectar Partner Hotel"
  },
  {
    src: "/images/interieur-trois.webp",
    alt: "Nectar Yacht Service"
  },
  {
    src: "/images/service-empty-legs.webp",
    alt: "Nectar Concierge"
  },
  {
    src: "/images/service-shared-flights.webp",
    alt: "Nectar Points Redemption"
  },
  {
    src: "/images/service-private-jet.webp",
    alt: "Nectar Member Benefits"
  }
];

// Données pour les partenaires Nectar
const NECTAR_PARTNERS = [
  {
    name: "Mandarin Oriental",
    description: "Luxury hotels and resorts worldwide"
  },
  {
    name: "Premium Yacht Charter",
    description: "Exclusive yacht rental services"
  },
  {
    name: "Luxury Retail Partners",
    description: "High-end products and services"
  },
  {
    name: "VIP Concierge Services",
    description: "Personalized travel and lifestyle services"
  }
];

export default function NectarPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden" style={{ margin: 0, padding: 0, fontFamily: 'Century Gothic, sans-serif' }}>

      <Navbar />

      {/* Hero Section Nectar avec image de background */}
      <section className="relative min-h-[70vh] flex items-center justify-center w-full">
        {/* Image de background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/bg-nectar.webp')",
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 text-center text-white w-full max-w-7xl px-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-7xl font-light mb-8"
          >
            Envyjet | <span className='text-7xl font-normal'>Nectar</span>
          </motion.h1>
        </div>
      </section>

      {/* Section Informations Nectar */}
      <section className="py-20 bg-white">
        <div className="w-full max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Texte informatif */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-4xl lg:text-5xl font-light text-[#193650] tracking-tight">
                What is <span className="text-[#a98c2f]">Nectar</span>?
              </h2>

              <div className="space-y-6 text-[#193650]">
                <p className="text-xl leading-relaxed font-light">
                  <strong className="font-semibold">Nectar is Envyjet's frequent-flyer points programme.</strong> Envyjet members can now use our Nectar programme like any other concierge service – taking advantage of booking hotels, yachts, products and services within the Nectar partner collective and earning Nectar points for these bookings.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <FiCheckCircle className="text-[#a98c2f] mt-1 flex-shrink-0" size={24} />
                    <p className="text-lg font-light">As an Envyjet member, you collect Nectar points whenever you fly with us or book any of our Nectar partners.</p>
                  </div>

                  <div className="flex items-start space-x-4">
                    <FiCheckCircle className="text-[#a98c2f] mt-1 flex-shrink-0" size={24} />
                    <p className="text-lg font-light">You don't need to book an accompanying flight to purchase any of our Nectar partner services or use the concierge service.</p>
                  </div>

                  <div className="flex items-start space-x-4">
                    <FiCheckCircle className="text-[#a98c2f] mt-1 flex-shrink-0" size={24} />
                    <p className="text-lg font-light">Once you have collected a minimum of 10,000 points, you can either spend these on a flight, or on a booking with our Nectar partner network.</p>
                  </div>
                </div>

                <div className="bg-[#f5f5f5] p-8 border border-[#e0e0e0]">
                  <h3 className="text-2xl font-medium text-[#a98c2f] mb-4">Examples:</h3>
                  <ul className="space-y-3 text-[#193650]">
                    <li className="flex items-center space-x-3">
                      <FiArrowRight className="text-[#a98c2f]" size={20} />
                      <span className="text-lg font-light">Fly from London to Nice – earn Nectar points.</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <FiArrowRight className="text-[#a98c2f]" size={20} />
                      <span className="text-lg font-light">Book Mandarin Oriental London for two nights through Nectar and use your points to reduce the cost of your room rate.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#193650] text-white p-8">
                  <p className="font-medium text-lg">
                    You will still earn Nectar points on every new booking, even if redeeming points.
                  </p>
                  <p className="mt-4 text-lg font-light">
                    It's free to become an Envyjet member and start accessing exclusive member benefits as well as our complimentary Nectar concierge service.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Partenaires Nectar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h3 className="text-3xl lg:text-4xl font-light text-[#193650] text-center tracking-tight">
                Nectar Partner Network
              </h3>

              <div className="grid grid-cols-1 gap-6">
                {NECTAR_PARTNERS.map((partner, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white border border-[#e0e0e0] p-8 hover:shadow-lg transition-all duration-300"
                  >
                    <h4 className="text-2xl font-medium text-[#a98c2f] mb-3">
                      {partner.name}
                    </h4>
                    <p className="text-[#193650] text-lg font-light">
                      {partner.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Points d'avantages */}
              <div className="bg-[#f5f5f5] p-8 border border-[#e0e0e0]">
                <h4 className="text-2xl font-medium text-[#193650] mb-6 text-center">
                  Key Benefits
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#a98c2f] text-white flex items-center justify-center">
                      <span className="font-bold text-lg">1</span>
                    </div>
                    <span className="text-[#193650] text-lg font-light">No flight required for partner bookings</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#a98c2f] text-white flex items-center justify-center">
                      <span className="font-bold text-lg">2</span>
                    </div>
                    <span className="text-[#193650] text-lg font-light">Earn points even when spending points</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#a98c2f] text-white flex items-center justify-center">
                      <span className="font-bold text-lg">3</span>
                    </div>
                    <span className="text-[#193650] text-lg font-light">Complimentary concierge service</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Galerie Photo */}
      <section className="py-20 bg-[#f5f5f5]">
        <div className="w-full max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-light text-[#193650] mb-6 tracking-tight">
              Nectar <span className="text-[#a98c2f]">Experience</span>
            </h2>
            <p className="text-[#666] text-xl font-light tracking-wide">
              Discover the luxury lifestyle with Nectar
            </p>
          </motion.div>

          {/* Grille avec images réelles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GALLERY_IMAGES.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="aspect-square overflow-hidden bg-white border border-[#e0e0e0] cursor-pointer hover:shadow-xl transition-all duration-300 group"
                onClick={() => setSelectedImage(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>

          {/* Modal pour l'image agrandie */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-5xl max-h-full">
                <img
                  src={selectedImage}
                  alt="Enlarged view"
                  className="max-w-full max-h-full object-contain"
                />
                <button
                  className="absolute top-4 right-4 text-white text-3xl bg-black/70 w-12 h-12 flex items-center justify-center hover:bg-black/90 transition-colors duration-200"
                  onClick={() => setSelectedImage(null)}
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}