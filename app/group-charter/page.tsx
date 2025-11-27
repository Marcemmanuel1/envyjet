// app/group-charter/page.tsx

'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiPhone, FiMail } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingForm from '../components/BookingForm';
import SafeImage from '../components/ui/SafeImage';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function GroupCharter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const router = useRouter();
  const swiperRef = useRef<any>(null);

  const handleFormSubmit = async (formData: any) => {
    console.log('Group charter flight booked:', formData);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/newsletter/subscribe', {
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

  // Données pour les témoignages
  const testimonials = [
    {
      id: 1,
      text: "Tom & the FV team, on my behalf, I can only say that this project has been a pleasure from the very beginning! We couldn't have dreamed of a better partner than you guys - thank you a thousand times!",
      author: "Chief Operations Office - International Conference"
    },
    {
      id: 2,
      text: "I have worked with the Commercial Jet team at EnvyJet for several years. They are an extremely knowledgeable team and have consistently provided us with high-touch service. Each time any of our teams need to travel to away fixtures, Tom and his team find us the most suitable aircraft type for our requirements.",
      author: "Director – International Sports Agency"
    },
    {
      id: 3,
      text: "We have worked with EnvyJet for several years on complex, global charter schedules and have always been delighted with the dedicated and professional service from EnvyJet's Commercial Jet team.",
      author: "Events Manager - International Lobbying Group"
    },
    {
      id: 4,
      text: "The professionalism, reliability, and expertise of the EnvyJet Commercial Jet team are flawless. They have access to a huge range of aircraft worldwide, but most importantly, our account manager takes the time to get to know our specific requirements for each trip.",
      author: "Team Manager - International Football Team"
    }
  ];

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

        /* Styles Swiper personnalisés améliorés */
        .testimonials-swiper {
          width: 100%;
          height: auto;
          min-height: 280px;
        }

        .testimonials-swiper .swiper-slide {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 2rem 1rem;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
        }

        .testimonials-swiper .swiper-slide-active {
          opacity: 1;
        }

        .swiper-pagination {
          position: relative;
          margin-top: 2rem;
        }

        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s ease;
          margin: 0 6px;
        }

        .swiper-pagination-bullet-active {
          background: #a98c2f;
          width: 24px;
          border-radius: 6px;
        }

        .swiper-button-next,
        .swiper-button-prev {
          color: #a98c2f;
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border-radius: 0;
          transition: all 0.3s ease;
          margin-top: -22px;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(169, 140, 47, 0.3);
          transform: scale(1.05);
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 16px;
          font-weight: bold;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .testimonials-swiper .swiper-slide {
            padding: 1.5rem 0.5rem;
          }
          
          .swiper-button-next,
          .swiper-button-prev {
            display: none;
          }
          
          .swiper-pagination {
            margin-top: 1.5rem;
          }
        }
      `}</style>

      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center w-full overflow-hidden bg-gradient-to-br from-[#1a3a57] to-[#2d5a82] bg-cover bg-center bg-no-repeat" style={{ margin: 0, padding: 0, backgroundImage: "url('/images/group-charter-envyjet-hero.jpg')" }}>
        <div className="absolute inset-0 bg-[#1a3a57]/80"></div>

        <div className="relative z-10 w-full flex-1 flex items-center justify-center px-4 md:px-0 pt-20 pb-8">
          <div className="text-white text-center max-w-5xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl lg:text-6xl xl:text-7xl font-light mb-6 leading-tight"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
            >
              ON DEMAND GROUP CHARTER
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-base lg:text-xl text-white/90 mb-8 font-light max-w-3xl mx-auto"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
            >
              Flying 18 people or more? Group charter with EnvyJet puts you in complete control.
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

      {/* Section Features */}
      <section className="py-16 lg:py-24 bg-white w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Market Transparency */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              <div className="bg-[#f8f8f8] p-8 h-full border border-[#e5e5e5]">
                <h3 className="text-xl lg:text-2xl font-medium text-[#193650] mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  Market Transparency
                </h3>
                <p className="text-[#193650] text-base leading-relaxed" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  EnvyJet is the only global jet charter marketplace to disclose the operator, aircraft details and the cancellation terms when quoting a trip.
                </p>
              </div>
            </motion.div>

            {/* Trusted Experts */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-center"
            >
              <div className="bg-[#f8f8f8] p-8 h-full border border-[#e5e5e5]">
                <h3 className="text-xl lg:text-2xl font-medium text-[#193650] mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  Trusted Experts
                </h3>
                <p className="text-[#193650] text-base leading-relaxed" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  All EnvyJet flyers are assigned an experienced, dedicated account manager upon registration, to assist and advise every step of the way, 24/7.
                </p>
              </div>
            </motion.div>

            {/* Customer Protection */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="text-center"
            >
              <div className="bg-[#f8f8f8] p-8 h-full border border-[#e5e5e5]">
                <h3 className="text-xl lg:text-2xl font-medium text-[#193650] mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  Customer Protection
                </h3>
                <p className="text-[#193650] text-base leading-relaxed" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  We guarantee that all flight payments from our members, less fees, are held in an HSBC Client Deposit Account.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Benefits with Image */}
      <section className="py-16 lg:py-24 bg-[#f8f8f8] w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image à gauche */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative h-80 lg:h-[550px] overflow-hidden border border-[#e5e5e5] shadow-lg">
                <SafeImage
                  src="/images/envyjet-group-charter-c.webp"
                  alt="Group charter aircraft"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  priority
                />
              </div>
            </motion.div>

            {/* Contenu à droite */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light text-[#193650] mb-8" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                Benefits of <span className="text-[#a98c2f]">Group Charter</span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <FiCheckCircle className="text-[#a98c2f] mt-1 flex-shrink-0" size={20} />
                  <span className="text-[#193650] text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                    Exclusive use of the aircraft, bespoke to your requirements and budget
                  </span>
                </div>
                <div className="flex items-start space-x-4">
                  <FiCheckCircle className="text-[#a98c2f] mt-1 flex-shrink-0" size={20} />
                  <span className="text-[#193650] text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                    Your own EnvyJet personal account manager for 24/7 support
                  </span>
                </div>
                <div className="flex items-start space-x-4">
                  <FiCheckCircle className="text-[#a98c2f] mt-1 flex-shrink-0" size={20} />
                  <span className="text-[#193650] text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                    Create your own schedule with maximum flexibility
                  </span>
                </div>
                <div className="flex items-start space-x-4">
                  <FiCheckCircle className="text-[#a98c2f] mt-1 flex-shrink-0" size={20} />
                  <span className="text-[#193650] text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                    Fly closer to your end destination with access to more airports
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section A smarter way to travel */}
      <section className="py-16 lg:py-24 bg-white w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Contenu à gauche */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light text-[#193650] mb-6" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                A smarter way to travel
              </h2>

              <p className="text-[#193650] text-lg leading-relaxed mb-6 text-justify" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                Discover the smarter way to fly with group charter by EnvyJet and take the stress out of group travel planning.
              </p>

              <p className="text-[#193650] text-lg leading-relaxed mb-6 text-justify" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                Whether you are looking to transport your sports team to a winter training camp, celebrating a special occasion with friends and family, or organising a corporate shuttle program, every group charter flight is unique. Your dedicated EnvyJet account manager will work with you to build your own travel itinerary so you can fly on your schedule with maximum flexibility and minimum wait times.
              </p>

              <p className="text-[#193650] text-lg leading-relaxed text-justify" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                From choosing your aircraft to onboard catering and branding the aircraft interior, your charter experience is entirely bespoke. Our specialist aviation and concierge experts are on hand every step of the way.
              </p>
            </motion.div>

            {/* Image à droite */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative h-80 lg:h-[550px] overflow-hidden border border-[#e5e5e5] shadow-lg">
                <SafeImage
                  src="/images/group-charter-envyjet-b.jpg"
                  alt="Luxury group travel experience"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Testimonials avec Swiper amélioré */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#1a3a57] to-[#2d5a82] w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light text-white mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Client Testimonials</h2>
            <p className="text-white/80 text-base lg:text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>What our clients say about our group charter services</p>
          </motion.div>

          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              speed={800}
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
              }}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{
                clickable: true,
                el: '.swiper-pagination',
                dynamicBullets: true,
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 1,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 1,
                  spaceBetween: 40,
                },
              }}
              className="testimonials-swiper"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 lg:p-12">
                      <p className="text-white text-lg lg:text-xl leading-relaxed mb-8 italic" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                        "{testimonial.text}"
                      </p>
                      <p className="text-[#a98c2f] font-medium text-base lg:text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                        {testimonial.author}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation buttons */}
            <div className="flex justify-center items-center mt-8 lg:mt-12 space-x-4">
              <button className="swiper-button-prev bg-white/10 hover:bg-white/20 text-white p-3 transition-all duration-300 border border-white/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="swiper-pagination"></div>

              <button className="swiper-button-next bg-white/10 hover:bg-white/20 text-white p-3 transition-all duration-300 border border-white/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section className="py-16 lg:py-24 bg-white w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light text-[#193650] mb-6" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Contact Us</h2>
            <p className="text-[#193650] text-lg lg:text-xl mb-12" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              For a bespoke group charter quote, simply contact our in-house experts. They'll open up access to the best commercial jets worldwide and are supported by global team that's available 24/7.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="flex flex-col items-center">
                <div className="bg-[#f8f8f8] p-8 w-full text-center border border-[#e5e5e5]">
                  <FiPhone className="text-[#a98c2f] mx-auto mb-4" size={32} />
                  <h3 className="text-xl font-medium text-[#193650] mb-2" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Phone</h3>
                  <p className="text-[#193650] text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>+225 0759102503</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-[#f8f8f8] p-8 w-full text-center border border-[#e5e5e5]">
                  <FiMail className="text-[#a98c2f] mx-auto mb-4" size={32} />
                  <h3 className="text-xl font-medium text-[#193650] mb-2" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Email</h3>
                  <p className="text-[#193650] text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>commercialjetsales@envyjet.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}