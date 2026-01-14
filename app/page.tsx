// app/page.tsx

'use client';
import { API_BASE_URL } from './config/api';
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiPhone, FiSend, FiPhone as FiNewsletterPhone } from 'react-icons/fi';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingForm from './components/BookingForm';
import VideoBackground from './components/ui/VideoBackground';
import SafeImage from './components/ui/SafeImage';
import FAQItem from './components/ui/FAQItem';
import AdvantagesCarousel from './components/ui/AdvantagesCarousel';

// Constants
import { SERVICES_DATA, FAQ_DATA } from './constants';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const router = useRouter();

  const handleFormSubmit = async (formData: any) => {
    console.log('Flight booked:', formData);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleRedirect = () => {
    router.push('/why-envyjet');
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
        setTimeout(() => setIsSubscribed(false), 3000);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    }
  };

  const toggleFAQ = useCallback((index: number) => {
    setOpenFAQ(prev => prev === index ? null : index);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden" style={{ margin: 0, padding: 0, fontFamily: 'Century Gothic, sans-serif' }}>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(169, 140, 47, 0.6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(169, 140, 47, 0.8);
        }

        .advantages-swiper {
          width: 100%;
          height: 100%;
        }

        .advantages-swiper .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .advantages-swiper-button-next,
        .advantages-swiper-button-prev {
          position: static;
          margin: 0;
          transform: none;
        }

        .advantages-swiper-button-next::after,
        .advantages-swiper-button-prev::after {
          content: none;
        }
      `}</style>

      <Navbar />

      {/* Section Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center w-full overflow-hidden" style={{ margin: 0, padding: 0 }}>
        <VideoBackground />

        <div className="relative z-10 w-full flex-1 flex items-center justify-center px-4 md:px-0 pt-20 pb-8">
          <div className="text-white text-center max-w-5xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl lg:text-6xl xl:text-7xl font-light mb-6 leading-tight"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
            >
              At the Heart of Your Travels
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base lg:text-xl text-white/90 mb-8 font-light"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
            >
              PREMIUM PRIVATE JET SERVICE - Experience unparalleled luxury and comfort in the skies
            </motion.p>
          </div>
        </div>

        {/* Formulaire de réservation */}
        <div className="relative z-10 w-full px-4 pb-8">
          <div className="container mx-auto max-w-7xl">
            <BookingForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </section>

      {/* Section À propos */}
      <section id="why-envyjet" className="py-12 lg:py-20 bg-white w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light text-[#193650] mb-6" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                About <span className="text-[#a98c2f]">EnvyJet</span>
              </h2>
              <p className="text-base lg:text-lg text-[#193650] mb-6 leading-relaxed text-justify" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                We save you time and provide you with flight comfort. Our dedicated team ensures that our business partners,
                guests and their families enjoy an exceptional trip. Whether for a pressing business trip or a personal getaway,
                our services are designed to be fast, efficient and economical.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <FiCheckCircle className="text-[#a98c2f]" size={20} />
                  <span className="text-[#193650] font-medium text-sm lg:text-base" style={{ fontFamily: 'Century Gothic, sans-serif' }}>A strong team with over 20 years of expertise</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiCheckCircle className="text-[#a98c2f]" size={20} />
                  <span className="text-[#193650] font-medium text-sm lg:text-base" style={{ fontFamily: 'Century Gothic, sans-serif' }}>An unforgettable travel experience</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <motion.button
                  onClick={handleRedirect}
                  whileHover={{ scale: 1.05, backgroundColor: "#a98c2f" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#d3a936] text-white px-6 py-3 font-medium text-sm lg:text-base"
                  style={{ fontFamily: 'Century Gothic, sans-serif' }}
                >
                  FIND OUT MORE
                </motion.button>
                <div className="flex items-center space-x-2 text-[#193650] font-medium text-sm lg:text-base" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  <FiPhone size={18} />
                  <span>+225 0759102503</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative h-100 overflow-hidden shadow-xl"
                >
                  <SafeImage
                    src="/images/about-too-envyjet.webp"
                    alt="Luxury jet interior"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative h-100 overflow-hidden shadow-xl mt-8"
                >
                  <SafeImage
                    src="/images/about-three-envyjet.webp"
                    alt="Private jet exterior"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Services */}
      <section
        id="services"
        className="relative py-12 lg:py-20 w-full bg-cover bg-center bg-no-repeat"
        style={{
          margin: 0,
          backgroundImage: "url('images/service.webp')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 container mx-auto px-4 lg:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2
              className="text-3xl lg:text-4xl xl:text-5xl font-light text-white mb-4"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
            >
              Our Services
            </h2>
            <p
              className="text-white/80 text-base lg:text-lg"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
            >
              Experience the pinnacle of luxury air travel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {SERVICES_DATA.map((service, index) => (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-black/50 p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group border border-[#969696]/20 overflow-hidden"
              >
                <div className="relative h-48 mb-6 overflow-hidden">
                  <SafeImage
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <h3
                  className="text-lg lg:text-xl font-medium text-white mb-4"
                  style={{ fontFamily: 'Century Gothic, sans-serif' }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-white/80 text-sm lg:text-base mb-6 text-justify"
                  style={{ fontFamily: 'Century Gothic, sans-serif' }}
                >
                  {service.description}
                </p>
                <motion.a
                  href={service.fileUrl || "/documents/default_info.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a98c2f] font-medium text-sm lg:text-base group-hover:underline flex items-center space-x-2 cursor-pointer"
                  style={{ fontFamily: 'Century Gothic, sans-serif' }}
                  whileHover={{ scale: 1.02 }}
                >
                  <span>MORE INFO</span>
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="py-12 lg:py-20 bg-white w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light text-[#193650] mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Our Advantages</h2>
            <p className="text-[#969696] text-base lg:text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Why choose EnvyJet for your private air travel</p>
          </motion.div>

          <AdvantagesCarousel />
        </div>
      </section>

      {/* Section FAQ */}
      <section className="py-12 lg:py-20 bg-[#f8f8f8] w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light text-[#193650] mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Q&A</h2>
            <p className="text-[#969696] text-base lg:text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Frequently asked questions about our services</p>
          </motion.div>

          <div className="space-y-4">
            {FAQ_DATA.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onClick={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section Newsletter */}
      <section className="py-12 lg:py-20 bg-gradient-to-br from-[#1a3a57] to-[#2d5a82] w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 text-center max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light text-white mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Newsletter</h2>
            <p className="text-white/80 text-base lg:text-lg mb-8" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Stay updated with our latest offers and services</p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-full mx-auto flex flex-col sm:flex-row gap-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 text-white placeholder-white/70 px-4 lg:px-6 py-3 focus:outline-none focus:bg-white/20 border border-white/20 text-sm lg:text-base"
                style={{ fontFamily: 'Century Gothic, sans-serif' }}
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, backgroundColor: "#a98c2f" }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#d3a936] text-white px-6 py-3 font-medium text-sm lg:text-base flex items-center justify-center space-x-2"
                style={{ fontFamily: 'Century Gothic, sans-serif' }}
              >
                <FiSend size={18} />
                <span>Subscribe</span>
              </motion.button>
            </form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: isSubscribed ? 1 : 0 }}
              className="text-white mt-4 font-medium text-sm lg:text-base"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
            >
              {isSubscribed && 'Thank you for subscribing!'}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}