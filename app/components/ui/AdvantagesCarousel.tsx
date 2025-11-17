// components/ui/AdvantagesCarousel.tsx

'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiClock, FiTrendingUp, FiShield, FiUserCheck } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const ADVANTAGES_DATA = [
  {
    title: "Speed",
    description: "Our private jet booking system is exceptionally fast, offering a major competitive advantage. Thanks to an intuitive user interface and cutting-edge technology, our customers can finalise their bookings in just a few clicks, dramatically reducing the time needed to plan their trips. Whether it's a last-minute business trip or a luxury getaway, our platform guarantees instant response and fast confirmations, allowing travellers to focus on what's important without worrying about the logistical details. This unrivalled efficiency makes our service the preferred choice for those seeking convenience and speed in their private air travel.",
    icon: <FiClock className="text-[#a98c2f]" size={300} />
  },
  {
    title: "Competitiveness",
    description: "Our company stands out for its exceptional competitiveness in the field of private jet charter, thanks to a combination of cutting-edge technology, a highly qualified team and constant attention to our customers' needs. We offer tailor-made air travel solutions, combining efficiency and luxury, while maintaining competitive rates. This approach enables us to remain at the forefront of our industry and provide unrivalled value to our partners and customers. By choosing our services, you are opting for excellence and sustainable performance.",
    icon: <FiTrendingUp className="text-[#a98c2f]" size={300} />
  },
  {
    title: "Security",
    description: "Safety is our top priority when it comes to chartering private jets. We are committed to the highest safety standards, working with highly qualified pilots and certified operators. Our aircraft undergo rigorous and regular inspections to ensure maximum safety on every flight. What's more, we use state-of-the-art technology to monitor and maintain safety throughout your journey. By choosing our services, you can travel with complete peace of mind, knowing that every safety measure is in place to protect your well-being.",
    icon: <FiShield className="text-[#a98c2f]" size={300} />
  },
  {
    title: "Confidentiality",
    description: "The confidentiality of our customers is our absolute priority. We are committed to protecting all personal and business information with the utmost care. Our rigorous security protocols and advanced technologies ensure that your data remains totally secure. Every transaction and interaction is handled with the utmost discretion, ensuring total peace of mind. By choosing our private jet charter services, you can be confident that your privacy is respected at every stage of your travel experience.",
    icon: <FiUserCheck className="text-[#a98c2f]" size={300} />
  }
] as const;

const AdvantagesCarousel: React.FC = () => {
  const swiperRef = useRef<any>(null);

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: '.advantages-swiper-button-next',
          prevEl: '.advantages-swiper-button-prev',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={600}
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="advantages-swiper"
      >
        {ADVANTAGES_DATA.map((advantage, index) => (
          <SwiperSlide key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#f8f8f8] flex flex-col lg:flex-row p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
            >
              <div className="flex items-center justify-center lg:w-1/3 mb-6 lg:mb-0 lg:order-2">
                {advantage.icon}
              </div>
              <div className='lg:w-2/3 lg:order-1 lg:pr-8'>
                <h3 className="text-3xl lg:text-4xl font-medium text-[#a98c2f] mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  {advantage.title}
                </h3>
                <p className="text-[#193650] leading-relaxed text-justify" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  {advantage.description}
                </p>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center items-center mt-8 space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="advantages-swiper-button-prev p-3 bg-white shadow-lg border border-[#969696]/20 hover:bg-[#f8f8f8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#a98c2f]"
          aria-label="Previous advantage"
        >
          <FiChevronLeft className="text-[#193650]" size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="advantages-swiper-button-next p-3 bg-white shadow-lg border border-[#969696]/20 hover:bg-[#f8f8f8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#a98c2f]"
          aria-label="Next advantage"
        >
          <FiChevronRight className="text-[#193650]" size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default AdvantagesCarousel;