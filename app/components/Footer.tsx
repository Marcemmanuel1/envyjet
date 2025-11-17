'use client';

import { motion } from 'framer-motion';
import { FaXTwitter } from 'react-icons/fa6';
import {
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Services',
      links: [
        { label: 'Private Jet Charter', href: '/jet-charter' },
        { label: 'Shared Flights', href: '/shared-flights' },
        { label: 'Empty Legs', href: '/empty-legs' },
        { label: 'Nectar Program', href: '/nectar' },
        { label: 'Groupe charter', href: '/groupe-charter' },
        { label: 'Medevac, air ambulance', href: '/medevac-air-ambulance' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/whiy-envyjet' },
        { label: 'Safety', href: '/safety' },
        { label: 'Careers', href: '/careers' },
        { label: 'News', href: '/news' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Booking Guide', href: '/guide' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' }
      ]
    }
  ];

  const socialLinks = [
    // CORRECTION : Suppression de la virgule excédentaire après le premier objet
    { icon: FiFacebook, href: 'https://www.facebook.com/people/EnvyJet/61560917589738/', label: 'Facebook' },
    { icon: FiLinkedin, href: 'https://www.linkedin.com/company/envyjet/', label: 'LinkedIn' },
    { icon: FiInstagram, href: 'https://www.instagram.com/envyjet/', label: 'Instagram' },
    { icon: FaXTwitter, href: 'https://x.com/EnvyJet', label: 'Twitter' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 md:gap-40 gap-6">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <img
                src="/images/logo_footer.png"
                alt="EnvyJet"
                className="h-24 w-auto mb-4"
              />

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-white/70">
                  <FiPhone size={16} />
                  <span>+225 0759102503</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <FiMail size={16} />
                  <span>contact@envyjet.com</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <FiMapPin size={16} />
                  <span>Abidjan, Côte d'Ivoire</span>
                </div>
              </div>

            </motion.div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-medium text-lg mb-6 text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className="text-white/70 hover:text-[#D08A10] transition-colors duration-300"
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

        </div>
        <p className='text-white/70 mt-6 lg:mt-10 text-sm'>
          EnvyJet is a charter broker with a digital jet charter market place, and is not a direct air carrier. All flights advertised to which EnvyJet has access are owned and operated by a properly licensed third party air carrier with Part 135 and Part 121 authority from the Federal Aviation Administration (or other appropriate authority under US or foreign law) and Department of Transportation. EnvyJet does not carry additional liability insurance. Passengers are covered by aircraft operator insurance.        </p>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-white/60 text-sm"
            >
              © {currentYear} EnvyJet. All rights reserved.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex space-x-4"
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  // Ajout des attributs pour les liens externes
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="text-white/60 hover:text-[#D08A10] transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex space-x-6 text-sm"
            >
              <a href="/privacy" className="text-white/60 hover:text-[#D08A10] transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/terms" className="text-white/60 hover:text-[#D08A10] transition-colors duration-300">
                Terms of Service
              </a>
              <a href="/cookies" className="text-white/60 hover:text-[#D08A10] transition-colors duration-300">
                Cookie Policy
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;