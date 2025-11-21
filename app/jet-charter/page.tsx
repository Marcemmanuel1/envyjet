'use client';

import React, { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function JetCharterPage() {
  const [activeSection, setActiveSection] = useState<'business' | 'leisure'>('business');

  return (
    <div className="w-full min-h-screen overflow-x-hidden m-0 p-0 font-sans antialiased">

      <Navbar />

      {/* Hero Section */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(rgba(25, 54, 80, 0.6), rgba(25, 54, 80, 0.8)), url('/images/bg-empty-shared.jpg')"
        }}
      >
        <div className="relative z-10 text-center text-white w-full px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl lg:text-8xl xl:text-9xl font-light mb-8 tracking-wider font-serif">
              Private Jet Charter
            </h1>
            <div className="w-24 h-0.5 bg-[#d3a936] mx-auto mb-8"></div>
          </div>
        </div>
      </section>

      {/* Section Boutons de Navigation */}
      <section className="py-16 bg-white w-full">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <button
              onClick={() => setActiveSection('business')}
              className={`group px-12 py-6 font-light text-lg tracking-wider flex items-center justify-center space-x-4 transition-all duration-500 transform hover:scale-105 min-w-[280px] ${activeSection === 'business'
                ? 'bg-[#d3a936] text-white border-2 border-[#d3a936]'
                : 'bg-transparent border-2 border-[#193650] text-[#193650] hover:bg-[#193650] hover:text-white'
                }`}
            >
              <span className="group-hover:tracking-widest transition-all duration-300">BUSINESS FLIGHTS</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button
              onClick={() => setActiveSection('leisure')}
              className={`group px-12 py-6 font-light text-lg tracking-wider flex items-center justify-center space-x-4 transition-all duration-500 transform hover:scale-105 min-w-[280px] ${activeSection === 'leisure'
                ? 'bg-[#d3a936] text-white border-2 border-[#d3a936]'
                : 'bg-transparent border-2 border-[#193650] text-[#193650] hover:bg-[#193650] hover:text-white'
                }`}
            >
              <span className="group-hover:tracking-widest transition-all duration-300">LEISURE TRIP</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Section Contenu Dynamique */}
      <section className="py-24 bg-white w-full">
        <div className="max-w-7xl mx-auto px-6">
          {activeSection === 'business' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              {/* Texte informatif avec typographie améliorée */}
              <div className="space-y-10">
                <div className="space-y-8 text-[#193650]">
                  <p className="text-xl leading-loose tracking-wide font-light">
                    Embark on exclusivity with our private jet charter services. We promise you a sophisticated travel experience, tailored to meet your highest expectations.
                  </p>

                  <p className="text-xl leading-loose tracking-wide font-light">
                    From your point of departure to your final destination, you can relax in complete tranquility, knowing that every detail is attended to with meticulous care. Upon your arrival at the airport, you will be pampered by seamless procedures and a dedicated staff entirely at your service.
                  </p>

                  <p className="text-xl leading-loose tracking-wide font-light">
                    Personally welcomed by your pilot, you will embark on a serene flight aboard a private jet reserved exclusively for you, offering you the pinnacle of luxury in private travel.
                  </p>

                  <p className="text-xl leading-loose tracking-wide font-light">
                    With us, every journey becomes an unforgettable experience, where comfort, elegance, and exceptional service combine to create lasting memories.
                  </p>
                </div>
              </div>

              {/* Section Avantages Élégante */}
              <div className="space-y-12">
                <div>
                  <h3 className="text-3xl font-light text-[#193650] tracking-wider mb-2 font-serif">
                    BUSINESS ADVANTAGES
                  </h3>
                  <div className="w-16 h-0.5 bg-[#d3a936] mb-8"></div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                    <div>
                      <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300 block mb-2">
                        Luxury and Comfort
                      </span>
                      <p className="text-sm text-[#193650] font-light leading-relaxed">
                        Flying should be a pleasure, and we will make your rental experience as luxurious and comfortable as possible.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                    <div>
                      <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300 block mb-2">
                        Discretion and Security
                      </span>
                      <p className="text-sm text-[#193650] font-light leading-relaxed">
                        Chartering a private jet guarantees your privacy. We will work closely with your security provider on all aspects of your charter.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                    <div>
                      <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300 block mb-2">
                        Create Your Own Schedule
                      </span>
                      <p className="text-sm text-[#193650] font-light leading-relaxed">
                        Travel according to your bespoke schedule; whatever your requirements, we will create the private jet charter that suits you.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                    <div>
                      <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300 block mb-2">
                        Access to a Greater Number of Airports
                      </span>
                      <p className="text-sm text-[#193650] font-light leading-relaxed">
                        Reach a remote location or simply arrive closer to your final destination than a regular service would allow.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                    <div>
                      <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300 block mb-2">
                        Global Coverage
                      </span>
                      <p className="text-sm text-[#193650] font-light leading-relaxed">
                        No matter where you wish to fly from, our international network provides you with local knowledge on a global scale.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                    <div>
                      <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300 block mb-2">
                        Cost-Effectiveness
                      </span>
                      <p className="text-sm text-[#193650] font-light leading-relaxed">
                        Our reputation and expertise in the industry enable us to find you the best private jet rental prices, ensuring that you always receive the most cost-effective solution.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                    <div>
                      <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300 block mb-2">
                        Diverse Selection of Aircraft
                      </span>
                      <p className="text-sm text-[#193650] font-light leading-relaxed">
                        With access to over 60,000 aircraft and 120 different types of planes, we will always provide you with the aircraft that meets your needs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                    <div>
                      <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300 block mb-2">
                        Personal Account Manager
                      </span>
                      <p className="text-sm text-[#193650] font-light leading-relaxed">
                        Your dedicated charter expert is available 24/7 to assist you with any requirements you may have, from organizing onboard catering to preparing minor modifications to your flight.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'leisure' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              {/* Texte informatif avec typographie améliorée */}
              <div className="space-y-10">
                <div className="space-y-8 text-[#193650]">
                  <p className="text-xl leading-loose tracking-wide font-light">
                    Private jet charters eliminate the stress associated with commercial air travel.
                  </p>

                  <p className="text-xl leading-loose tracking-wide font-light">
                    Whether you are traveling alone, in a small group, or with family, the generous interior of a private jet cabin affords luxurious comfort and complete privacy during the flight.
                  </p>

                  <p className="text-xl leading-loose tracking-wide font-light">
                    Utilizing a private jet to reach a holiday destination also ensures the additional advantage of access to private terminals for expedited security checks, thereby allowing for more time to fully enjoy your vacation.
                  </p>

                  <p className="text-xl leading-loose tracking-wide font-light">
                    With the capability to access a greater number of destinations worldwide and enhanced customization potential, private jets provide you with the ultimate travel experience for your leisure escapades.
                  </p>
                </div>
              </div>

              {/* Section Avantages Élégante */}
              <div className="space-y-12">
                <div>
                  <h3 className="text-3xl font-light text-[#193650] tracking-wider mb-2 font-serif">
                    LEISURE BENEFITS
                  </h3>
                  <div className="w-16 h-0.5 bg-[#d3a936] mb-8"></div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                    <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300">
                      Stress-free travel experience
                    </span>
                  </div>

                  <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                    <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300">
                      Complete privacy and luxurious comfort
                    </span>
                  </div>

                  <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                    <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300">
                      Expedited security checks through private terminals
                    </span>
                  </div>

                  <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                    <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300">
                      Access to more destinations worldwide
                    </span>
                  </div>

                  <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                    <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300">
                      Enhanced customization for your travel needs
                    </span>
                  </div>

                  <div className="flex items-start space-x-6 group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-3 h-3 bg-[#d3a936] mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                    <span className="text-lg text-[#193650] tracking-wide font-light group-hover:text-[#a98c2f] transition-colors duration-300">
                      More time to enjoy your vacation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section CTA Sophistiquée */}
      <section className="py-24 bg-gradient-to-br from-[#193650] to-[#0f2438] w-full">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl lg:text-5xl font-light text-white tracking-wide mb-4 font-serif">
                EXPERIENCE LUXURY AIR TRAVEL
              </h2>
              <div className="w-20 h-0.5 bg-[#d3a936] mx-auto"></div>
            </div>

            <a
              href="/"
              className="group bg-transparent border-2 border-[#d3a936] text-white px-16 py-5 font-light text-lg tracking-wider flex items-center justify-center space-x-4 mx-auto hover:bg-[#d3a936] transition-all duration-500 transform hover:scale-105 max-w-xs"
            >
              <span className="group-hover:tracking-widest transition-all duration-300">INQUIRE NOW</span>
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