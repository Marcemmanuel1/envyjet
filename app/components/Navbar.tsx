'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu,
  FiX,
  FiGlobe,
  FiPhone,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

interface NavbarProps {
  transparent?: boolean;
}

const Navbar = ({ transparent = true }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!transparent) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [transparent]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const menuItems = [
    { label: 'WHY ENVYJET', href: '/why-envyjet' },
    { label: 'NECTAR', href: '/nectar' },
    { label: 'SHARED FLIGHTS', href: '/shared-flights' },
    { label: 'EMPTY LEGS', href: '/empty-legs' },
    { label: 'CONTACT US', href: '/contact' }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
        className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg py-4'
          : 'bg-transparent py-8'
          }`}
        style={{ fontFamily: 'Century Gothic, sans-serif' }}
      >
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* Logo et bouton menu mobile côte à côte */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Menu Mobile Button - à côté du logo */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="lg:hidden relative z-60"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <FiMenu
                size={24}
                className={isScrolled ? 'text-[#193650]' : 'text-white'}
              />
            </motion.button>

            {/* Logo */}
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <img
                src={isScrolled ? "/images/logo_mobile.png" : "/images/logo_footer.png"}
                alt="EnvyJet"
                className="h-10 sm:h-12 w-auto transition-all duration-300 filter brightness-100"
              />
            </motion.a>
          </div>

          {/* Menu Desktop */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {menuItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                whileHover={{ y: -2 }}
                className={`font-medium transition-colors duration-300 relative group ${isScrolled ? 'text-[#193650] hover:text-[#a98c2f]' : 'text-white/90 hover:text-white'
                  }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${isScrolled ? 'bg-[#a98c2f]' : 'bg-white'
                  }`}></span>
              </motion.a>
            ))}

            {/* Section Login/Join */}
            <div className="flex items-center space-x-3 ml-4">
              <motion.a
                href="/login"
                whileHover={{ scale: 1.05 }}
                className={`transition-colors font-medium ${isScrolled ? 'text-[#193650] hover:text-[#a98c2f]' : 'text-white/90 hover:text-white'
                  }`}
              >
                Login
              </motion.a>
              <span className={isScrolled ? 'text-[#969696]' : 'text-white/60'}>/</span>
              <motion.a
                href="/join"
                whileHover={{ scale: 1.05, backgroundColor: "#a98c2f" }}
                className="text-[#d3a936] px-4 xl:px-6 py-2 border bg-none border-[#d3a936] font-medium hover:text-white hover:shadow-lg transition-all duration-300 text-nowrap"
              >
                Join
              </motion.a>
            </div>

            {/* Icônes supplémentaires */}
            <div className="flex items-center space-x-4 ml-4 border-l border-gray-300 pl-4">
              {/* Numéro de téléphone */}
              <motion.a
                href="tel:+2250759102503"
                whileHover={{ scale: 1.05 }}
                className={`flex items-center space-x-2 transition-colors ${isScrolled ? 'text-[#193650] hover:text-[#a98c2f]' : 'text-white/90 hover:text-white'
                  }`}
              >
                <FiPhone size={18} />
                <span className="font-medium text-sm hidden xl:block">+225 0759102503</span>
              </motion.a>

              {/* Icône WhatsApp */}
              <motion.a
                href="https://wa.me/+2250759102503"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`transition-colors ${isScrolled ? 'text-[#25D366] hover:text-[#128C7E]' : 'text-[#25D366] hover:text-[#128C7E]'
                  }`}
                aria-label="Contact us on WhatsApp"
              >
                <FaWhatsapp size={20} />
              </motion.a>

              {/* Icône Globe pour traduction */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                className={`transition-colors ${isScrolled ? 'text-[#193650] hover:text-[#a98c2f]' : 'text-white/90 hover:text-white'
                  }`}
                aria-label="Language selection"
              >
                <FiGlobe size={18} />
              </motion.button>
            </div>
          </div>

          {/* Version Mobile */}
          <div className="flex lg:hidden items-center space-x-3">
            {/* Numéro de téléphone (icône seulement) */}
            <motion.a
              href="tel:+2250759102503"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-colors ${isScrolled ? 'text-[#193650] hover:text-[#a98c2f]' : 'text-white/90 hover:text-white'
                }`}
            >
              <FiPhone size={18} />
            </motion.a>

            {/* Icône WhatsApp */}
            <motion.a
              href="https://wa.me/+2250759102503"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-colors ${isScrolled ? 'text-[#25D366] hover:text-[#128C7E]' : 'text-[#25D366] hover:text-[#128C7E]'
                }`}
              aria-label="Contact us on WhatsApp"
            >
              <FaWhatsapp size={18} />
            </motion.a>

            {/* Icône Globe pour traduction */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-colors ${isScrolled ? 'text-[#193650] hover:text-[#a98c2f]' : 'text-white/90 hover:text-white'
                }`}
              aria-label="Language selection"
            >
              <FiGlobe size={18} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
            exit={{
              opacity: 0,
              x: '-100%',
              transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
            className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-[#193650] shadow-2xl lg:hidden"
            style={{
              fontFamily: 'Century Gothic, sans-serif',
              borderRadius: 0,
              margin: 0
            }}
          >
            <div className="flex flex-col h-full p-6">
              {/* En-tête du menu */}
              <div className="flex justify-between items-center mb-8">

                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/80 hover:text-white p-2"
                >
                  <FiX size={20} />
                </motion.button>

                <img
                  src="/images/logo_footer.png"
                  alt="EnvyJet"
                  className="h-8 w-auto"
                />
              </div>

              {/* Items du menu */}
              <div className="flex flex-col space-y-1">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    whileHover={{
                      x: 8,
                      backgroundColor: 'rgba(169,140,47,0.15)',
                    }}
                    className="flex justify-between items-center text-lg text-white/90 hover:text-white py-3 px-4 border-b border-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="font-medium">{item.label}</span>
                  </motion.a>
                ))}
              </div>

              {/* Section des icônes dans le menu mobile */}
              <div className="py-6 border-b border-white/10">
                <div className="flex justify-center space-x-6">
                  <motion.a
                    href="tel:+2250759102503"
                    whileHover={{ scale: 1.2 }}
                    className="text-white/80 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <FiPhone size={22} />
                  </motion.a>

                  <motion.a
                    href="https://wa.me/+2250759102503"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-[#25D366] hover:text-[#128C7E] transition-colors"
                    aria-label="Contact us on WhatsApp"
                  >
                    <FaWhatsapp size={22} />
                  </motion.a>

                  <motion.button
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label="Language selection"
                  >
                    <FiGlobe size={22} />
                  </motion.button>
                </div>

                <motion.a
                  href="tel:+2250759102503"
                  className="block text-center text-white/70 hover:text-white mt-3 text-sm font-medium"
                >
                  +225 0759102503
                </motion.a>
              </div>

              {/* Boutons d'action */}
              <div className="mt-auto pt-6 border-t border-white/10">
                <a
                  href="/login"
                  className="block text-center text-white/90 hover:text-white py-3 border border-white/20 transition-all duration-300 font-medium mb-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </a>
                <a
                  href="/join"
                  className="block text-center bg-[#d3a936] text-white py-3 font-medium transition-all duration-300 hover:bg-[#a98c2f]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join
                </a>
                <p className="text-center mt-4 text-white/40 text-xs">
                  Luxury in the skies
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;