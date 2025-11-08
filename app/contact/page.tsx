'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// =============================================================================
// DONNÉES DES BUREAUX
// =============================================================================

const OFFICE_LOCATIONS = [
  {
    city: "Londres",
    phone: "+44 20 7946 0958",
    address: "London City Airport, Royal Docks",
    fullAddress: "London City Airport, Royal Docks, London E16 2PX",
    image: "/images/londre.avif"
  },
  {
    city: "Abidjan",
    phone: "+225 27 22 58 42 00",
    address: "Plateau, Boulevard de la République",
    fullAddress: "Plateau, Boulevard de la République, Abidjan, Côte d'Ivoire",
    image: "/images/catedrale.jpg"
  },
  {
    city: "Lomé",
    phone: "+228 22 21 45 67",
    address: "Lomé-Tokoin Airport, Zone Aéroportuaire",
    fullAddress: "Lomé-Tokoin Airport, Zone Aéroportuaire, Lomé, Togo",
    image: "/images/lome.jpg"
  }
];

// =============================================================================
// DONNÉES DES SERVICES DE CHARTER
// =============================================================================

const CHARTER_SERVICES = [
  {
    title: "Personal Charter",
    email: "sales@envyjet.com"
  },
  {
    title: "Group Charter",
    email: "commercialjetsales@envyjet.com"
  },
  {
    title: "Emergency Charter",
    email: "rescue@envyjet.com"
  },
  {
    title: "Corporate Charter",
    email: "corporate@envyjet.com"
  }
];

const OTHER_ENQUIRIES = [
  {
    title: "General Enquiries",
    email: "info@envyjet.com"
  },
  {
    title: "Press and Media",
    email: "press@envyjet.com"
  },
  {
    title: "Partnerships",
    email: "partnerships@envyjet.com"
  },
  {
    title: "Operators",
    email: "operations@envyjet.com"
  }
];

// =============================================================================
// DONNÉES DES RÉSEAUX SOCIAUX
// =============================================================================

const SOCIAL_MEDIA = [
  {
    name: "Facebook",
    icon: <FiFacebook size={24} />,
    url: "https://facebook.com/envyjet"
  },
  {
    name: "Twitter",
    icon: <FiTwitter size={24} />,
    url: "https://twitter.com/envyjet"
  },
  {
    name: "Instagram",
    icon: <FiInstagram size={24} />,
    url: "https://instagram.com/envyjet"
  },
  {
    name: "LinkedIn",
    icon: <FiLinkedin size={24} />,
    url: "https://linkedin.com/company/envyjet"
  }
];

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================

export default function ContactUs() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden" style={{ margin: 0, padding: 0, fontFamily: 'Century Gothic, sans-serif' }}>

      <Navbar />

      {/* Section Hero */}
      <section
        className="relative min-h-[60vh] flex items-center justify-center w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/bg-contact.jpg')" }}
      >
        {/* Superposition sombre */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-6xl font-light mb-6"
            style={{ fontFamily: 'Century Gothic, sans-serif' }}
          >
            Contact Us
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl lg:text-2xl text-white/90 font-light"
            style={{ fontFamily: 'Century Gothic, sans-serif' }}
          >
            Get in touch with EnvyJet - Excellence in private aviation
          </motion.p>
        </div>
      </section>


      {/* Section des bureaux */}
      <section className="py-16 bg-white w-full">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-light text-[#193650] mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              Our Offices
            </h2>
            <p className="text-[#969696] text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              Visit us at any of our global locations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {OFFICE_LOCATIONS.map((office, index) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white border border-[#969696]/20 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={office.image}
                    alt={`EnvyJet Office in ${office.city}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder-office.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-medium text-[#193650] mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                    {office.city}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FiPhone className="text-[#a98c2f]" size={18} />
                      <span className="text-[#193650] text-sm" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                        {office.phone}
                      </span>
                    </div>

                    <div className="flex items-start space-x-3">
                      <FiMapPin className="text-[#a98c2f] mt-1" size={18} />
                      <div>
                        <p className="text-[#193650] text-sm font-medium" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                          {office.address}
                        </p>
                        <p className="text-[#969696] text-xs mt-1" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                          {office.fullAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Private Jet Charter Enquiries */}
      <section className="py-16 bg-[#f8f8f8] w-full">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-light text-[#193650] mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              Private Jet Charter Enquiries
            </h2>
            <p className="text-[#969696] text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              Contact our specialized teams for your private aviation needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Charter Services */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-[#969696]/20 p-6"
            >
              <h3 className="text-2xl font-medium text-[#193650] mb-6" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                Charter Services
              </h3>

              <div className="space-y-4">
                {CHARTER_SERVICES.map((service, index) => (
                  <div key={service.title} className="border-b border-[#969696]/10 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="text-lg font-medium text-[#193650] mb-2" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                      {service.title}
                    </h4>
                    <div className="flex items-center space-x-3">
                      <FiMail className="text-[#a98c2f]" size={16} />
                      <a
                        href={`mailto:${service.email}`}
                        className="text-[#193650] text-sm hover:text-[#a98c2f] transition-colors"
                        style={{ fontFamily: 'Century Gothic, sans-serif' }}
                      >
                        {service.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Other Enquiries */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-[#969696]/20 p-6"
            >
              <h3 className="text-2xl font-medium text-[#193650] mb-6" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                Other Enquiries
              </h3>

              <div className="space-y-4">
                {OTHER_ENQUIRIES.map((enquiry, index) => (
                  <div key={enquiry.title} className="border-b border-[#969696]/10 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="text-lg font-medium text-[#193650] mb-2" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                      {enquiry.title}
                    </h4>
                    <div className="flex items-center space-x-3">
                      <FiMail className="text-[#a98c2f]" size={16} />
                      <a
                        href={`mailto:${enquiry.email}`}
                        className="text-[#193650] text-sm hover:text-[#a98c2f] transition-colors"
                        style={{ fontFamily: 'Century Gothic, sans-serif' }}
                      >
                        {enquiry.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Follow us on social media */}
      <section className="py-16 bg-white w-full">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-light text-[#193650] mb-6" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              Follow us on social media
            </h2>
            <p className="text-[#969696] text-lg mb-8" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              Stay connected with EnvyJet
            </p>

            <div className="flex justify-center space-x-6">
              {SOCIAL_MEDIA.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, color: "#a98c2f" }}
                  className="text-[#193650] hover:text-[#a98c2f] transition-all duration-300 p-3 border border-[#969696]/20 hover:border-[#a98c2f]"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}