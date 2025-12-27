'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiPhone, FiArrowRight } from 'react-icons/fi';

// Components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SafeImage from '../components/ui/SafeImage';

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) => {
  return (
    <div className="border-b border-[#969696]/20">
      <button
        onClick={onClick}
        className="w-full py-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors duration-300"
      >
        <span className="text-lg lg:text-xl font-medium text-[#193650]" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-[#a98c2f]"
        >
          <FiArrowRight size={20} />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pb-6">
          <p className="text-[#193650] text-base lg:text-lg leading-relaxed" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
            {answer}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default function MedevacPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const router = useRouter();

  const toggleFAQ = useCallback((index: number) => {
    setOpenFAQ(prev => prev === index ? null : index);
  }, []);

  const handleRequestNow = () => {
    // Logique pour la demande immédiate
    console.log('Medevac request initiated');
  };

  const handleReadMore = () => {
    router.push('/medevac-details');
  };

  const medevacFAQ = [
    {
      question: "What is medevac?",
      answer: "Medevac is an air ambulance service for patients in need of urgent attention. The jets used are specially designed for medical emergencies; carrying the same equipment as a regular ambulance and staffed by emergency doctors, paramedics and nurses. Depending on your needs, you can also charter a larger aircraft, which is essentially a fully-operational flying hospital with an on-board surgery and a full medical team."
    },
    {
      question: "How long does an air ambulance take to reach the patient?",
      answer: "Once we have the patient's key details (their medical history, location and treating hospital) we can have a medevac flight airborne in two hours."
    },
    {
      question: "What information do you need to provide when booking a medevac flight?",
      answer: "To book the right aircraft for your needs, we'll need to know the route, the patient's condition and the contact details of their doctor or hospital. And just like any other charter, we'll also need the patient's passport and visa details."
    },
    {
      question: "Can the patient's families travel in the air ambulance with them?",
      answer: "Smaller planes will only have room for the patient and the medical staff, but larger planes can carry close relatives too. If you'd specifically like a larger plane, just let us know when you request a quote."
    },
    {
      question: "Can you use Medevac for psychiatric emergencies?",
      answer: "Yes. The air ambulances operators Victor works with have in-house psychiatrists for psychiatric patients. The psychiatrist is available to support the patient's families too."
    },
    {
      question: "Where do air ambulances fly to?",
      answer: "Air ambulances can fly to (and from) anywhere in the world — though long-haul emergency flights may require a stopover."
    },
    {
      question: "Can a patient bring their own doctor or nurse on board?",
      answer: "Every medevac flight comes with a specially-trained team, and they're the only people allowed to provide medical treatment on board. The patient's own doctor or nurse can accompany them on the flight, but only as an observer."
    },
    {
      question: "Will my insurance cover medevac?",
      answer: "In some cases, your air ambulance flight charter will be covered by your health or travel insurance. And either way, Victor can give you a medevac quote in minutes and have an emergency flight airborne in two hours."
    }
  ];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden" style={{ margin: 0, padding: 0, fontFamily: 'Century Gothic, sans-serif' }}>

      <Navbar />

      {/* Section Hero Medevac */}
      <section className="relative h-[70vh] flex items-center justify-center w-full overflow-hidden" style={{ margin: 0, padding: 0 }}>
        <div className="absolute inset-0">
          <SafeImage
            src="/images/medevac-background.jpg"
            alt="Air Ambulance and Medevac"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-3xl xl:text-5xl font-light mb-6 leading-tight"
            style={{ fontFamily: 'Century Gothic, sans-serif' }}
          >
            AIR AMBULANCE AND<br />MEDEVAC AIR CHARTER
          </motion.h1>
        </div>
      </section>

      {/* Section Immediate Advice */}
      <section className="py-16 bg-white w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-light text-[#193650] mb-8" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              For immediate advice and a fast response
            </h2>
            <p className="text-lg lg:text-xl text-[#193650] mb-8 leading-relaxed text-justify" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              EnvyJet's rapid medical evacuation and medical repatriation experts can have a team of doctors and paramedics airborne in just two hours. Whatever the emergency, our 24-hour service can arrange an air ambulance, medevac or medical transportation anytime of the day or night.            </p>
          </div>
        </div>
      </section>

      {/* Section Working with Experts */}
      <section className="py-16 bg-[#f8f8f8] w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-[#193650] mb-6" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                Working with the experts
              </h2>
              <p className="text-lg text-[#193650] mb-6 leading-relaxed text-justify" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                An interview with Hemma and Claudia from Tyrol Air Ambulance (TAA)
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-96 lg:h-[40vh]"
            >
              <SafeImage
                src="/images/envyjet-medevac.png"
                alt="Tyrol Air Ambulance"
                className="w-full h-[40vh] shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section When You Book */}
      <section className="py-16 bg-white w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-light text-[#193650] mb-8 text-center" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              When you book
            </h2>
            <p className="text-lg text-[#193650] mb-8 text-center" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              To make sure our flight team and medical staff are fully prepared, we'll need:
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <FiCheckCircle className="text-[#a98c2f] mt-1 flex-shrink-0" size={20} />
                <span className="text-[#193650] text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>The patient's medical record</span>
              </div>
              <div className="flex items-start space-x-4">
                <FiCheckCircle className="text-[#a98c2f] mt-1 flex-shrink-0" size={20} />
                <span className="text-[#193650] text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Any information you have about the patient's condition</span>
              </div>
              <div className="flex items-start space-x-4">
                <FiCheckCircle className="text-[#a98c2f] mt-1 flex-shrink-0" size={20} />
                <span className="text-[#193650] text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>The name and contact details of the patient's doctor or hospital</span>
              </div>
              <div className="flex items-start space-x-4">
                <FiCheckCircle className="text-[#a98c2f] mt-1 flex-shrink-0" size={20} />
                <span className="text-[#193650] text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>The name and contact details of the treating hospital and doctor the patient will be flying to</span>
              </div>
            </div>

            <p className="text-lg text-[#193650] mt-8
            " style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              Your account manager will advise on any extra requirements when you request a quote.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section Emergency Priority */}
      <section className="py-16 bg-[#1a3a57] w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-light text-white mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              Your emergency is our priority
            </h2>
            <p className="text-white/80 text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              Our well-trained medical crews and specialist on-the-ground support staff are ready and waiting.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "24-hour service",
                description: "Our expert team are available to help with emergency flights, any time of the day or night."
              },
              {
                title: "A specialised fleet",
                description: "Specialist flight crews and customised jets mean you'll receive the best possible care, right away."
              },
              {
                title: "Dedicated account manager",
                description: "You'll receive a personalised, tailored service from your named account manager who will be with you all the way."
              },
              {
                title: "Rapid response",
                description: "We can have a medical team airborne within two hours of receiving the patient's details."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center p-6"
              >
                <h3 className="text-xl font-medium text-white mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-white/80 text-base leading-relaxed" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section FAQ Medevac */}
      <section className="py-16 bg-white w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-light text-[#193650] mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              Medevac Questions
            </h2>
            <p className="text-[#969696] text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
              Frequently asked questions about our medical evacuation services
            </p>
          </motion.div>

          <div className="space-y-2">
            {medevacFAQ.map((faq, index) => (
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

      <Footer />
    </div>
  );
}