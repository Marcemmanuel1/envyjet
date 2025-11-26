"use client";

import React, { useState } from 'react';
import NavbarES from '../components/NavbarES';
import Footer from "../components/Footer";
import Link from 'next/link';

const TeamPage = () => {
  const [activeSection, setActiveSection] = useState<'team' | 'contact'>('team');

  const teamMembers = [
    {
      name: "James Farley",
      position: "Co-CEO",
      description: "James is responsible for Victor's global P&L oversight and ensuring that the consumer and commercial objectives and respective KPIs and monitoring functions are correctly set and met across the organisation. In addition, he is responsible for the brand and marketing team, leading business transformation and driving cross-departmental efficiencies. James has a background in corporate finance advisory for TMT ventures and was involved in securing early-stage financing for Victor in 2010. He joined in 2012 as the first Head of Product, to help shape the business' consumer and trade offerings, and has also served as Head of CRM, Head of Data and Head of Strategy & Planning over his time at Victor."
    },
    {
      name: "Toby Edwards",
      position: "Co-CEO",
      description: "Following a career in recruitment, Toby joined Victor as the first Member Services Executive in July 2012. Over more than seven years he has built and trained the sales, operations and flight management teams in the UK and has also recruited for the US team. In 2018, he took on the Managing Director role for the Europe, Asia-Pacific and Middle East & North Africa regions. In addition to his responsibility to the UK-based sales, operations and flight management teams, Toby helps drive revenue and operational efficiency across the organisation. He leads the business development department to deliver new revenue streams in verticals such as group charter, and also works alongside marketing to establish commercial partnerships for Alto - the first loyalty programme in jet charter - bringing brands Sixt, Golf Traveller and Corinthia Hotels into the Alto ecosystem."
    },
    {
      name: "Stuart Manning",
      position: "Finance Director",
      description: "Stuart Manning joined Victor as Finance Director in February 2020 responsible for supplying strategic frameworks and guidance, identifying revenue opportunities, and leading the finance team. Stuart is an ACCA- qualified accountant and an experienced Finance Director having worked for private equity through to FTSE 250 companies across a variety of sectors: Software, Technology and Property. Prior to joining Victor, he helped develop start-up businesses. Stuart moved to the UK from Durban, South Africa and now lives in Hertfordshire with his family."
    },
    {
      name: "Tom Hill",
      position: "Director of Commercial Jets",
      description: "Tom joined Victor's operations team in 2015 and progressed to head up the commercial jet team within four years. Specialising in aircraft charter for groups of 18 passengers or more, Tom works with a broad range of clients across verticals including corporates, sports, and entertainment, as well as private groups requiring bespoke services including repatriation and relocation. Tom often travels the world to meet clients before departure, providing the high-touch service that complex itineraries involving multiple stakeholders and passengers require, and ensuring that every flight is a faultless experience."
    },
    {
      name: "Davide Paladino",
      position: "Vice President of Sales",
      description: "Having begun his career in asset management in the private banking sector in Switzerland, Davide travelled the world as cabin crew for the national airline. After a second stint in private banking on the advisory side and a degree in management, Davide moved into private aviation and joined Victor in 2015. Progressing quickly to Vice President of Sales, Davide leads with a customer-centric approach, using the feedback loops he has established with his clients to not only improve the sales function but to advise on the wider business."
    },
    {
      name: "Eugene Kostrikov",
      position: "Head of Development",
      description: "After graduating from the Moscow State Institute of International Relations in 2012, Eugene launched a collective buying start-up where he became acquainted with the creative power provided by software development. He then joined Victor in 2014 as a junior developer to help create the initial Victor platform and by 2018 had progressed to become the Head of Development. Eugene is passionate about leveraging technology to deliver solutions that ensure Victor consumers and operators continue to enjoy the best and most innovative experience available in the marketplace."
    }
  ];

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
            OUR TEAM
          </h1>
          <p className="text-lg text-white/90 max-w-full text-center md:text-left">
            Meet the experienced professionals behind our success
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
                <button
                  onClick={() => setActiveSection('team')}
                  className={`block w-full text-left transition-colors duration-200 py-2 border-b border-gray-200 ${activeSection === 'team'
                      ? 'text-[#b8922e] font-semibold'
                      : 'text-gray-700 hover:text-[#b8922e]'
                    }`}
                >
                  TEAM
                </button>

                <Link
                  href="/contact"
                  className="block text-gray-700 hover:text-[#b8922e] transition-colors duration-200 py-2 border-b border-gray-200"
                >
                  CONTACT
                </Link>
              </nav>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="md:w-3/4">
            {activeSection === 'team' ? (
              <div className="space-y-8">
                <h2 className="text-2xl text-[#b8922e] mb-6">OUR LEADERSHIP TEAM</h2>

                <div className="space-y-8">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-2xl text-gray-600 font-semibold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-[#b8922e] font-medium">{member.position}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {member.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">
                  Redirecting to contact page...
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-[#b8922e] text-white px-6 py-3 rounded-lg hover:bg-[#a58327] transition-colors duration-200"
                >
                  Go to Contact Page
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TeamPage;