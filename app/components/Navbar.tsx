'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu,
  FiX,
  FiGlobe,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

interface NavbarProps {
  transparent?: boolean;
}

const Navbar = ({ transparent = true }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  // Gestion du scroll pour l'effet de transparence
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

  // Blocage du scroll quand un menu est ouvert
  useEffect(() => {
    document.body.style.overflow = (isMobileMenuOpen || isDesktopMenuOpen) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen, isDesktopMenuOpen]);

  const menuItems = [
    { label: 'WHY ENVYJET', href: '/why-envyjet' },
    { label: 'NECTAR', href: '/nectar' },
    { label: 'SHARED FLIGHTS', href: '#' },
    { label: 'EMPTY LEGS', href: '/empty-legs' }
  ];

  const burgerMenuItems = [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Our Pricing', href: '/our-pricing' },
    { label: 'Team', href: '#' },
    { label: 'Group Charter', href: '/group-charter' },
    { label: 'Medevac', href: '/medevac' },
    //{ label: 'Destinations', href: '/destinations' }
  ];

  // Tous les liens combinés pour le menu mobile
  const allMobileMenuItems = [...menuItems, ...burgerMenuItems];

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
          ? 'bg-white/95 backdrop-blur-lg shadow-lg py-4 md:pt-4 md:pb-8'
          : 'bg-transparent py-8'
          }`}
        style={{ fontFamily: 'Century Gothic, sans-serif' }}
      >
        <div className="max-w-7xl md:max-w-full mx-auto px-2 sm:px-3 lg:px-4 flex justify-between items-center">
          {/* Logo et menu burger */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Bouton menu burger desktop */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="hidden lg:flex relative z-60"
              onClick={() => setIsDesktopMenuOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu
                size={28}
                className={isScrolled ? 'text-[#193650]' : 'text-white'}
              />
            </motion.button>

            {/* Bouton menu mobile */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="lg:hidden relative z-60"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
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
                src={isScrolled ? "/images/logo_mobile.webp" : "/images/logo_footer.webp"}
                alt="EnvyJet"
                className="h-10 sm:h-12 w-auto transition-all duration-300 filter brightness-100"
              />
            </motion.a>
          </div>

          {/* Navigation desktop  */}
          <div className="hidden lg:flex items-center flex-1 justify-between ml-8">
            {/* Menu principal avec plus d'espace */}
            <div className="flex items-center space-x-10 xl:space-x-12 2xl:space-x-8">
              {menuItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  whileHover={{ y: -2 }}
                  className={`font-medium text-sm tracking-wide transition-colors duration-300 relative group ${isScrolled ? 'text-[#193650] hover:text-[#a98c2f]' : 'text-white/95 hover:text-white'
                    }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${isScrolled ? 'bg-[#a98c2f]' : 'bg-white'
                    }`}></span>
                </motion.a>
              ))}
            </div>

            {/* Section droite avec deux lignes alignées à droite */}
            <div className="flex flex-col items-end justify-center space-y-2">
              {/* Ligne 1: Login et Join - alignés à droite */}
              <div className="flex items-center space-x-6">
                {/* Login */}
                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.05 }}
                  className={`transition-colors font-medium text-sm whitespace-nowrap ${isScrolled ? 'text-[#193650] hover:text-[#a98c2f]' : 'text-white/95 hover:text-white'
                    }`}
                >
                  Login
                </motion.a>

                {/* Join avec bordure */}
                <motion.a
                  href="/join"
                  whileHover={{ scale: 1.05 }}
                  className={`px-6 py-2 border-2 font-medium text-sm transition-all duration-300 whitespace-nowrap ${isScrolled
                    ? 'border-[#d3a936] text-[#d3a936] hover:bg-[#d3a936] hover:text-white'
                    : 'border-[#d3a936] text-[#d3a936] hover:bg-[#d3a936] hover:text-white'
                    }`}
                >
                  Join
                </motion.a>
              </div>

              {/* Ligne 2: Téléphone, WhatsApp et Globe - alignés à droite */}
              <div className={`flex items-center absolute space-x-4 ${isScrolled ? 'top-17' : 'top-20'}`}>
                {/* Téléphone avec drapeau */}
                <motion.a
                  href="tel:+2250759102503"
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center space-x-2 transition-colors whitespace-nowrap ${isScrolled ? 'text-[#193650] hover:text-[#a98c2f]' : 'text-white/95 hover:text-white'
                    }`}
                >
                  <span className="text-base">🇨🇮</span>
                  <span className="font-medium text-sm">+225 0759102503</span>
                </motion.a>

                {/* WhatsApp */}
                <motion.a
                  href="https://wa.me/+2250759102503"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-[#25D366] hover:text-[#128C7E] transition-colors flex-shrink-0"
                  aria-label="Contact us on WhatsApp"
                >
                  <FaWhatsapp size={20} />
                </motion.a>

                {/* Divider */}
                <div className={`h-5 w-px flex-shrink-0 ${isScrolled ? 'bg-gray-300' : 'bg-white/30'}`}></div>

                {/* Sélecteur de langue */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  className={`transition-colors flex-shrink-0 ${isScrolled ? 'text-[#193650] hover:text-[#a98c2f]' : 'text-white/95 hover:text-white'
                    }`}
                  aria-label="Language selection"
                >
                  <FiGlobe size={18} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Actions mobiles */}
          <div className="flex lg:hidden items-center space-x-3">
            <motion.a
              href="tel:+2250759102503"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-colors ${isScrolled ? 'text-[#193650] hover:text-[#a98c2f]' : 'text-white/90 hover:text-white'
                }`}
            >
              <span className="text-base">🇨🇮</span>
            </motion.a>

            <motion.a
              href="https://wa.me/+2250759102503"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-[#25D366] hover:text-[#128C7E] transition-colors"
              aria-label="Contact us on WhatsApp"
            >
              <FaWhatsapp size={18} />
            </motion.a>

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

      {/* Overlay du menu mobile */}
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

      {/* Overlay du menu desktop */}
      <AnimatePresence>
        {isDesktopMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm hidden lg:block"
            onClick={() => setIsDesktopMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menu mobile */}
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
            style={{ fontFamily: 'Century Gothic, sans-serif' }}
          >
            <div className="flex flex-col h-full p-6">

              {/* Header fixe */}
              <div className="flex justify-between items-center mb-8 flex-shrink-0">
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/80 hover:text-white p-2"
                  aria-label="Close menu"
                >
                  <FiX size={24} />
                </motion.button>

                <img
                  src="/images/logo_footer.webp"
                  alt="EnvyJet"
                  className="h-8 w-auto object-contain"
                />
              </div>

              {/* Boutons Login / Join — fixes */}
              <div className="flex w-full space-x-3 mb-6 flex-shrink-0">
                <a
                  href="/login"
                  className="flex-1 text-center text-white/90 hover:text-white py-3 border border-white/20 transition-all duration-300 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </a>

                <a
                  href="/join"
                  className="flex-1 text-center bg-[#d3a936] text-white py-3 font-medium transition-all duration-300 hover:bg-[#a98c2f]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join
                </a>
              </div>

              {/* Contenu scrollable */}
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="flex flex-col space-y-1 pb-10">
                  {allMobileMenuItems.map((item, index) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + index * 0.08 }}
                      whileHover={{
                        x: 8,
                        backgroundColor: 'rgba(169,140,47,0.15)',
                      }}
                      className="flex justify-between items-center text-lg text-white/90 hover:text-white py-3 px-4 border-b border-white/10 transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="font-medium">{item.label}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Menu burger desktop */}
      <AnimatePresence>
        {isDesktopMenuOpen && (
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
            className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-[#193650] shadow-2xl hidden lg:block"
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
                  onClick={() => setIsDesktopMenuOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/80 hover:text-white p-2"
                  aria-label="Close menu"
                >
                  <FiX size={20} />
                </motion.button>

                <img
                  src="/images/logo_footer.webp"
                  alt="EnvyJet"
                  className="h-8 w-auto"
                />
              </div>

              {/* Navigation burger desktop - SANS Login/Join */}
              <div className="flex flex-col space-y-1">
                {burgerMenuItems.map((item, index) => (
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
                    onClick={() => setIsDesktopMenuOpen(false)}
                  >
                    <span className="font-medium">{item.label}</span>
                  </motion.a>
                ))}
              </div>

              {/* Footer du menu sans les boutons */}
              <div className="mt-auto pt-6 border-t border-white/10">
                <p className="text-center text-white/40 text-xs">
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