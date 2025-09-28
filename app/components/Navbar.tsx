'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiX, 
  FiChevronDown
} from 'react-icons/fi';

interface NavbarProps {
  transparent?: boolean;
}

const Navbar = ({ transparent = true }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

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

  const menuItems = [
    { label: 'Why EnvyJet', href: '#why-envyjet' },
    { 
      label: 'Services', 
      href: '#services',
      submenu: [
        { label: 'Shared Flights', href: '#shared-flights' },
        { label: 'Empty Legs', href: '#empty-legs' }
      ]
    },
    { label: 'Nectar', href: '#nectar' },
    { label: 'Contact Us', href: '#contact' }
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg py-4' 
            : 'bg-transparent py-8'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <motion.a 
            href="/"
            whileHover={{ scale: 1.05 }} 
            className="flex items-center space-x-3"
          >
            <img 
              src="/images/logo_mobile.png" 
              alt="EnvyJet" 
              className="h-10 w-auto transition-all duration-300 filter brightness-100" 
            />
          </motion.a>

          {/* Menu Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <div key={item.label} className="relative">
                {item.submenu ? (
                  <div className="relative group">
                    <button className={`flex items-center space-x-1 font-medium transition-colors duration-300 ${
                      isScrolled ? 'text-gray-700 hover:text-[#D08A10]' : 'text-white/90 hover:text-white'
                    }`}>
                      <span>{item.label}</span>
                      <FiChevronDown size={16} className="transition-transform group-hover:rotate-180" />
                    </button>
                    
                    {/* Sous-menu */}
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      {item.submenu.map((subItem) => (
                        <a
                          key={subItem.label}
                          href={subItem.href}
                          className="block px-4 py-3 text-gray-700 hover:text-[#D08A10] hover:bg-gray-50/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.a
                    href={item.href}
                    whileHover={{ y: -2 }}
                    className={`font-medium transition-colors duration-300 relative group ${
                      isScrolled ? 'text-gray-700 hover:text-[#D08A10]' : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                      isScrolled ? 'bg-[#D08A10]' : 'bg-white'
                    }`}></span>
                  </motion.a>
                )}
              </div>
            ))}
            
            <div className="flex items-center space-x-4 ml-4">
              <motion.a
                href="/login"
                whileHover={{ scale: 1.05 }}
                className={`transition-colors font-medium ${
                  isScrolled ? 'text-gray-700 hover:text-[#D08A10]' : 'text-white/90 hover:text-white'
                }`}
              >
                Login
              </motion.a>
              <span className={isScrolled ? 'text-gray-400' : 'text-white/60'}>/</span>
              <motion.a
                href="/join"
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-[#D08A10] to-[#F4C257] text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300"
              >
                Join
              </motion.a>
            </div>
          </div>

          {/* Menu Mobile Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <FiMenu 
              size={28} 
              className={isScrolled ? 'text-gray-700' : 'text-white'} 
            />
          </motion.button>
        </div>
      </motion.nav>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-50 bg-white backdrop-blur-lg lg:hidden"
          >
            <div className="flex flex-col h-full p-8">
              <div className="flex justify-between items-center mb-12">
                <img 
                  src="/images/logo_mobile.png" 
                  alt="EnvyJet" 
                  className="h-10 w-auto"
                />
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700">
                  <FiX size={28} />
                </button>
              </div>
              
              <div className="flex flex-col space-y-6">
                {menuItems.map((item) => (
                  <div key={item.label}>
                    {item.submenu ? (
                      <div>
                        <button 
                          onClick={() => setIsServicesOpen(!isServicesOpen)}
                          className="flex items-center justify-between w-full text-2xl text-gray-700 hover:text-[#D08A10] font-medium transition-colors"
                        >
                          {item.label}
                          <FiChevronDown 
                            size={20} 
                            className={`transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} 
                          />
                        </button>
                        <AnimatePresence>
                          {isServicesOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-4 mt-2 space-y-3"
                            >
                              {item.submenu.map((subItem) => (
                                <a
                                  key={subItem.label}
                                  href={subItem.href}
                                  className="block text-xl text-gray-600 hover:text-[#D08A10] transition-colors"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {subItem.label}
                                </a>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <motion.a
                        href={item.href}
                        whileHover={{ x: 10 }}
                        className="text-2xl text-gray-700 hover:text-[#D08A10] font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </motion.a>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-auto pt-8 border-t border-gray-200">
                <div className="flex space-x-4">
                  <motion.a
                    href="/login"
                    className="flex-1 text-center text-gray-700 hover:text-[#D08A10] py-3 border border-gray-300 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </motion.a>
                  <motion.a
                    href="/join"
                    className="flex-1 text-center bg-gradient-to-r from-[#D08A10] to-[#F4C257] text-white py-3 rounded-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Join
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;