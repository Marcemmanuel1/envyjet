'use client';

import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function SharedCharterPage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden m-0 p-0 font-sans antialiased">

      <Navbar />

      {/* Hero Section Élégante */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(rgba(25, 54, 80, 0.8), rgba(25, 54, 80, 0.5)), url('/images/bg-shared-charter.webp')"
        }}
      >
        <div className="relative z-10 text-center text-white w-full px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-6xl lg:text-8xl xl:text-7xl font-light mb-8 tracking-wider font-serif">
              Shared Flights
            </h1>
            <div className="w-24 h-0.5 bg-[#d3a936] mx-auto mb-8"></div>
          </div>
        </div>
      </section>

      {/* Section Informations Raffinée */}
      <section className="py-24 bg-white w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

            {/* Texte informatif avec typographie améliorée */}
            <div className="space-y-10">
              <div className="space-y-8 text-[#193650]">
                <p className="text-xl leading-loose tracking-wide font-light">
                  Discover the exclusive EnvyJet experience with our shared jet flights. Enjoy luxury, convenience, and cost savings while traveling in style.
                </p>

                <p className="text-xl leading-loose tracking-wide font-light">
                  With our intuitive online platform, you can share costs with other passengers, offering you complete flexibility to plan your trips according to your preferences.
                </p>

                <p className="text-xl leading-loose tracking-wide font-light">
                  Our flights guarantee unparalleled privacy and comfort, with spacious cabins and personalized amenities to meet your needs.
                </p>

                <div className="border-l-4 border-[#d3a936] pl-6 py-2 bg-gradient-to-r from-[#f8f8f8] to-transparent">
                  <p className="text-lg leading-relaxed text-[#193650] italic">
                    Additionally, our cost-sharing approach makes the luxury of a private jet accessible at an affordable price for all participants.
                  </p>
                </div>
              </div>
            </div>

            {/* Section Avantages Élégante */}
            <div className="space-y-12">
              <div>
                <h3 className="text-3xl font-light text-[#193650] tracking-wider mb-2 font-serif">
                  BENEFITS OF SHARED FLIGHTS
                </h3>
                <div className="w-16 h-0.5 bg-[#d3a936] mb-8"></div>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                  <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                  <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300">
                    Save up to 75% compared to traditional charters
                  </span>
                </div>

                <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                  <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                  <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300">
                    Choose from a variety of aircraft types
                  </span>
                </div>

                <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                  <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                  <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300">
                    Book one-way charters instead of round-trip
                  </span>
                </div>

                <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                  <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                  <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300">
                    You have access to the entire aircraft
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA Sophistiquée */}
      <section className="py-24 bg-gradient-to-br from-[#193650] to-[#0f2438] w-full">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl lg:text-5xl font-light text-white tracking-wide mb-4 font-serif">
                EXPERIENCE LUXURY SHARED FLIGHTS
              </h2>
              <div className="w-20 h-0.5 bg-[#d3a936] mx-auto"></div>
            </div>

            <a
              href="/shared-flights"
              className="group bg-transparent border-2 border-[#d3a936] text-white px-6 py-5 font-light text-lg tracking-wider flex items-center justify-center space-x-4 mx-auto hover:bg-[#d3a936] transition-all duration-500 transform hover:scale-105 max-w-xs"
            >
              <span className="group-hover:tracking-widest transition-all text-xl duration-300">EXPLORE FLIGHTS</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}