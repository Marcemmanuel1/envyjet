"use client";

import React, { useState } from 'react';
import NavbarES from '../components/NavbarES';
import Footer from "../components/Footer";
import Link from 'next/link';

const OurPricingPage = () => {
  const [activeSection, setActiveSection] = useState<'pricing' | 'safety'>('pricing');

  return (
    <div className="min-h-screen bg-white">
      <NavbarES />

      {/* Section Hero */}
      <div
        className="relative bg-cover bg-center md:h-64 pt-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1600&h=400&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-800/50"></div>

        <div className="relative container px-4 md:px-0 mx-auto h-full flex flex-col justify-center">
          <h1 className="text-3xl text-center md:text-left md:text-2xl text-white mb-4">
            OUR PRICING & SAFETY
          </h1>
          <p className="text-lg text-white/90 max-w-full text-center md:text-left">
            Transparent pricing and uncompromising safety standards
          </p>
        </div>
      </div>

      {/* Navigation latérale et contenu */}
      <div className="container mx-auto px-4 md:px-0 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation latérale */}
          <div className="md:w-1/4">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <nav className="space-y-4">
                <Link
                  href="/why-envyjet"
                  className="block text-gray-700 hover:text-[#b8922e] transition-colors duration-200 py-2 border-b border-gray-200"
                >
                  Why EnvyJet
                </Link>

                <button
                  onClick={() => setActiveSection('pricing')}
                  className={`block w-full text-left transition-colors duration-200 py-2 border-b border-gray-200 ${activeSection === 'pricing'
                      ? 'text-[#b8922e] font-semibold'
                      : 'text-gray-700 hover:text-[#b8922e]'
                    }`}
                >
                  OUR PRICING
                </button>

                <Link
                  href="/nectar"
                  className="block text-gray-700 hover:text-[#b8922e] transition-colors duration-200 py-2 border-b border-gray-200"
                >
                  NECTAR
                </Link>

                <button
                  onClick={() => setActiveSection('safety')}
                  className={`block w-full text-left transition-colors duration-200 py-2 border-b border-gray-200 ${activeSection === 'safety'
                      ? 'text-[#b8922e] font-semibold'
                      : 'text-gray-700 hover:text-[#b8922e]'
                    }`}
                >
                  SAFETY
                </button>
              </nav>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="md:w-3/4">
            {activeSection === 'pricing' ? (
              <div className="space-y-8">
                <h2 className="text-2xl text-[#b8922e] mb-6">OUR PRICING</h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Competitive Booking Fees
                    </h3>
                    <p className="text-gray-700 mb-4">
                      With EnvyJet there are no upfront costs or hidden charges. Our booking fees are as follows:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                      <li>Competitive booking fees for all online charter request bookings.</li>
                      <li>Travel management fees for music tours and similar multi-leg itineraries are priced by arrangement.</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Charter Pricing
                    </h3>
                    <p className="text-gray-700 mb-4">
                      EnvyJet works with the leading operators to offer you the best selection and the most competitive prices for your itinerary. Quotes include landing fees, basic catering for Europe and taxes where required.
                    </p>
                    <p className="text-gray-700 mb-4">
                      There are no extra costs for taxiing time or fuel surcharges. Please contact the EnvyJet Team for information on additional charges such as de-icing.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Payment Options
                    </h3>
                    <p className="text-gray-700 mb-4">
                      EnvyJet accepts all major credit cards, debit cards and bank transfers. Flights can be paid for on or offline. All funds must be received and cleared before take-off.
                    </p>
                    <p className="text-gray-700">
                      Please view the Terms and Conditions for more information.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <h2 className="text-2xl text-[#b8922e] mb-6">SAFETY</h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Members' Safety
                    </h3>
                    <p className="text-gray-700 mb-4">
                      The safety of our members is of paramount importance. All EnvyJet operators are audited by their relevant aviation authority in order that they maintain a valid Air Operator Certificate, which is necessary to operate any aircraft for commercial charter.
                    </p>
                    <p className="text-gray-700 mb-4">
                      By law, and for the safety of our passengers, all the aircraft we charter on behalf of members are piloted by two commercial pilots who are fully trained and qualified for both the aircraft type they fly and for the airports they fly into.
                    </p>
                    <p className="text-gray-700">
                      EnvyJet displays an Air Operator Certificate (AOC), for every operator listed on the EnvyJet platform for members to inspect. In addition, EnvyJet also publishes the operator's insurance certificates, so our members can verify the level of liability insurance each aircraft operator carries on behalf of their passenger.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Operator Audits
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Operator audits cover a wide range of operations and maintenance procedures including crew training and aircraft maintenance as indicated below:
                    </p>
                    <ul className="list-disc list-inside space-y-3 text-gray-700">
                      <li><span className="font-semibold">Aircraft documentation checks</span> – to ensure all required certification and approvals are valid</li>
                      <li><span className="font-semibold">Crew training record checks</span> – to ensure that all crew are current and licensed for commercial operations</li>
                      <li><span className="font-semibold">Crew flight time limitations record checks</span> – to ensure that crew fatigue avoidance is observed</li>
                      <li><span className="font-semibold">Flight checks</span> – to observe and ensure that the correct flight operations and cabin procedures are undertaken</li>
                      <li><span className="font-semibold">Maintenance and engineering compliance checks</span> – to check compliance with approved maintenance procedures ensuring aircraft are safe to fly</li>
                      <li><span className="font-semibold">Manual checks</span> – validity of company operations manuals and documentation</li>
                      <li><span className="font-semibold">Management and financial robustness checks</span> – to ensure CAA-approved Postholder team is empowered and capable to undertake safe management of the entire business</li>
                      <li><span className="font-semibold">Ramp checks</span> – assess turnaround of company aircraft at any given airport and review operator auditing of handlers</li>
                      <li><span className="font-semibold">Operations checks</span> – to assess expertise of aircraft operations staff to undertake operational duties</li>
                      <li><span className="font-semibold">Quality checks</span> – to ensure that internal auditing process is robust and compliant</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OurPricingPage;