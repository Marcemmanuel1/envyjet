'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import BookingForm from './BookingForm';

interface NavbarProps {
  transparent?: boolean;
}

const NavbarSE = ({ transparent = true }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  useEffect(() => {
    if (!transparent) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [transparent]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen || isDesktopMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen, isDesktopMenuOpen]);

  const menuItems = [
    { label: 'WHY ENVYJET', href: '/why-envyjet' },
    { label: 'NECTAR', href: '/nectar' },
    { label: 'SHARED FLIGHTS', href: '#' },
    { label: 'EMPTY LEGS', href: '/empty-legs' },
  ];

  const burgerMenuItems = [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Our Pricing', href: '/our-pricing' },
    { label: 'Team', href: '#' },
    { label: 'Group Charter', href: '/group-charter' },
    { label: 'Medevac', href: '/medevac' },
    //{ label: 'Destinations', href: '/destinations' }
  ];

  const allMobileMenuItems = [...menuItems, ...burgerMenuItems];

  const linkTextClass = isScrolled ? 'text-[#193650]' : 'text-white/90';

  const handleFormSubmit = async (formData: any) => {
    console.log('Flight booked:', formData);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsBookingFormOpen(false);
  };

  const handleBookingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsBookingFormOpen(!isBookingFormOpen);
  };

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
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex justify-between items-center transition-colors duration-500 ${isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
          }`}
        style={{ fontFamily: 'Century Gothic, sans-serif' }}
      >
        <div className="flex items-center w-full max-w-full mx-auto px-4 sm:px-6">

          {/* Burger desktop */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDesktopMenuOpen(true)}
            aria-label="Open menu"
            className="hidden lg:flex mr-4">
            <FiMenu size={28} className={linkTextClass} />
          </motion.button>

          {/* Burger mobile */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            className="lg:hidden mr-4">
            <FiMenu size={24} className={linkTextClass} />
          </motion.button>

          {/* Logo */}
          <motion.a href="/"
            whileHover={{ scale: 1.05 }}
            className="flex items-center">
            <img
              src={isScrolled ? "/images/logo_mobile.webp" : "/images/logo_footer.webp"}
              alt="EnvyJet"
              className="h-10 w-auto"
            />
          </motion.a>

          {/* Links Desktop */}
          <div className="hidden lg:flex items-center flex-1 ml-6">
            <div className="flex items-center space-x-8">
              {menuItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  whileHover={{ y: -2 }}
                  className={`font-medium text-[13px] tracking-wide relative group ${linkTextClass}`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] transition-all duration-300 ${isScrolled ? 'bg-[#193650]' : 'bg-white'} group-hover:w-full`}></span>
                </motion.a>
              ))}
            </div>

            <div className="flex items-center space-x-4 ml-auto">
              <motion.a href="/login"
                whileHover={{ scale: 1.05 }}
                className={`${linkTextClass} hover:text-[#193650] text-sm`}>
                Login
              </motion.a>
              <motion.a href="/join"
                whileHover={{ scale: 1.05 }}
                className="px-4 py-1.5 border border-[#d3a936] text-[#d3a936] font-medium text-sm hover:bg-[#d3a936] hover:text-white transition"
              >
                Join
              </motion.a>
            </div>
          </div>
        </div>

        {/* BOOK A JET / X Button */}
        <button
          onClick={handleBookingClick}
          className={`flex items-center justify-center py-4 font-bold text-sm w-[12rem] uppercase tracking-wider h-full transition-all duration-300 ${isBookingFormOpen
            ? 'bg-[#c09830] text-white'
            : 'bg-[#d4a93a] text-white hover:bg-[#c09830]'
            }`}
        >
          {isBookingFormOpen ? (
            <FiX size={24} className="text-white" />
          ) : (
            'BOOK A JET'
          )}
        </button>
      </motion.nav>

      {/* Formulaire de réservation sous la navbar */}
      <AnimatePresence>
        {isBookingFormOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsBookingFormOpen(false)}
            />

            {/* Formulaire avec scroll */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-16 left-0 right-0 bottom-0 z-50 px-4 py-6 overflow-hidden"
            >
              <div className="container mx-auto max-w-7xl h-full flex flex-col">
                {/* Container scrollable */}
                <div className=" shadow-xl overflow-y-auto max-h-full">
                  <BookingForm onSubmit={handleFormSubmit} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reste du code inchangé */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDesktopMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm hidden lg:block"
            onClick={() => setIsDesktopMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu content */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{
              type: 'spring',
              stiffness: 250, damping: 25
            }}
            className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-[#193650] shadow-2xl overflow-y-auto lg:hidden"
          >
            <div className="flex flex-col h-full p-6">
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
              <div className="flex flex-col space-y-1">
                {allMobileMenuItems.map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    whileHover={{ x: 8, backgroundColor: 'rgba(169,140,47,0.15)' }}
                    className="flex justify-between items-center text-lg text-white/90 hover:text-white py-3 px-4 border-b border-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop burger menu content */}
      <AnimatePresence>
        {isDesktopMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{
              type: 'spring',
              stiffness: 250, damping: 25
            }}
            className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-[#193650] shadow-2xl hidden lg:block overflow-y-auto"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-8">
                <motion.button
                  onClick={() => setIsDesktopMenuOpen(false)}
                  whileHover={{ rotate: 90 }}
                  className="text-white/80 hover:text-white"
                >
                  <FiX size={22} />
                </motion.button>
                <img src="/images/logo_footer.webp" className="h-8" />
              </div>

              <div className="flex flex-col space-y-1">
                {burgerMenuItems.map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    whileHover={{ x: 8, backgroundColor: 'rgba(169,140,47,0.15)' }}
                    className="text-lg text-white/90 hover:text-white py-3 px-4 border-b border-white/10"
                    onClick={() => setIsDesktopMenuOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <p className="text-center text-white/40 text-xs">Luxury in the skies</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarSE;