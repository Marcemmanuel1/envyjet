'use client';

import { useState, useRef, useEffect, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMapPin, 
  FiCalendar, 
  FiUsers, 
  FiChevronRight, 
  FiArrowRight, 
  FiPlus, 
  FiMinus, 
  FiClock, 
  FiShield, 
  FiLock, 
  FiStar, 
  FiPhone, 
  FiSend, 
  FiCheckCircle,
  FiPlay,
  FiChevronDown
} from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Types pour les formulaires
interface FormData {
  from: string;
  to: string;
  departureDate: string;
  passengers: number;
}

interface RoundTripFormData extends FormData {
  returnDate: string;
}

interface Segment {
  from: string;
  to: string;
  date: string;
}

interface MultiLegFormData {
  segments: Segment[];
  passengers: number;
}

// Composant Video Background corrigé
const VideoBackground = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Vérifier au chargement
    checkMobile();

    // Écouter les changements de taille
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!isMobile) {
    return (
      <>
        <iframe
          src="https://iframe.mediadelivery.net/embed/157813/55901219-d83b-49e8-932d-f27411cb735f?autoplay=true&loop=true&muted=true&preload=true"
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ 
            filter: "brightness(0.8) contrast(1.1) saturate(1.2)",
            opacity: 0.9
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10" />
      </>
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover"
      style={{ 
        filter: "brightness(0.8) contrast(1.1) saturate(1.2)",
        opacity: 0.9
      }}
    >
      <source src="/videos/video-envyjet.MP4" type="video/mp4" />
    </video>
  );
};

// Types pour le composant FAQ
interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

// Composant Accordéon pour la FAQ
const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="bg-gray-50 rounded-2xl overflow-hidden"
    >
      <button
        onClick={onClick}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-300"
      >
        <h3 className="text-lg font-medium text-gray-900 pr-4">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <FiChevronDown className="text-[#D08A10]" size={20} />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4">
              <p className="text-gray-700 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Types pour les props des formulaires
interface FormProps {
  onSubmit: (data: any) => void;
}

// Composants pour les formulaires de réservation
const OneWayForm = ({ onSubmit }: FormProps) => {
  const [formData, setFormData] = useState<FormData>({
    from: '',
    to: '',
    departureDate: '',
    passengers: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} className="relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D08A10]" size={20} />
          <input
            type="text"
            placeholder="Departure Airport"
            value={formData.from}
            onChange={(e) => setFormData({...formData, from: e.target.value})}
            className="w-full bg-white/10 border border-white/20 rounded-2xl text-white pl-12 pr-4 py-4 focus:outline-none focus:border-[#D08A10] backdrop-blur-lg placeholder-white/70"
            required
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D08A10]" size={20} />
          <input
            type="text"
            placeholder="Arrival Airport"
            value={formData.to}
            onChange={(e) => setFormData({...formData, to: e.target.value})}
            className="w-full bg-white/10 border border-white/20 rounded-2xl text-white pl-12 pr-4 py-4 focus:outline-none focus:border-[#D08A10] backdrop-blur-lg placeholder-white/70"
            required
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} className="relative">
          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D08A10]" size={20} />
          <input
            type="date"
            value={formData.departureDate}
            onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
            className="w-full bg-white/10 border border-white/20 rounded-2xl text-white pl-12 pr-4 py-4 focus:outline-none focus:border-[#D08A10] backdrop-blur-lg"
            required
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="relative">
          <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D08A10]" size={20} />
          <select
            value={formData.passengers}
            onChange={(e) => setFormData({...formData, passengers: parseInt(e.target.value)})}
            className="w-full bg-white/10 border border-white/20 rounded-2xl text-white pl-12 pr-4 py-4 focus:outline-none focus:border-[#D08A10] backdrop-blur-lg appearance-none"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i+1} value={i+1} className="bg-gray-900">{i+1} Passenger{i !== 0 ? 's' : ''}</option>
            ))}
          </select>
        </motion.div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full bg-gradient-to-r from-[#D08A10] to-[#F4C257] text-white py-4 rounded-2xl font-medium text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <span>Book Your Flight</span>
        <FiArrowRight size={20} />
      </motion.button>
    </motion.form>
  );
};

const RoundTripForm = ({ onSubmit }: FormProps) => {
  const [formData, setFormData] = useState<RoundTripFormData>({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} className="relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D08A10]" size={20} />
          <input
            type="text"
            placeholder="Departure Airport"
            value={formData.from}
            onChange={(e) => setFormData({...formData, from: e.target.value})}
            className="w-full bg-white/10 border border-white/20 rounded-2xl text-white pl-12 pr-4 py-4 focus:outline-none focus:border-[#D08A10] backdrop-blur-lg placeholder-white/70"
            required
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D08A10]" size={20} />
          <input
            type="text"
            placeholder="Arrival Airport"
            value={formData.to}
            onChange={(e) => setFormData({...formData, to: e.target.value})}
            className="w-full bg-white/10 border border-white/20 rounded-2xl text-white pl-12 pr-4 py-4 focus:outline-none focus:border-[#D08A10] backdrop-blur-lg placeholder-white/70"
            required
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} className="relative">
          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D08A10]" size={20} />
          <input
            type="date"
            placeholder="Departure Date"
            value={formData.departureDate}
            onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
            className="w-full bg-white/10 border border-white/20 rounded-2xl text-white pl-12 pr-4 py-4 focus:outline-none focus:border-[#D08A10] backdrop-blur-lg"
            required
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="relative">
          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D08A10]" size={20} />
          <input
            type="date"
            placeholder="Return Date"
            value={formData.returnDate}
            onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
            className="w-full bg-white/10 border border-white/20 rounded-2xl text-white pl-12 pr-4 py-4 focus:outline-none focus:border-[#D08A10] backdrop-blur-lg"
            required
          />
        </motion.div>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} className="relative">
        <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D08A10]" size={20} />
        <select
          value={formData.passengers}
          onChange={(e) => setFormData({...formData, passengers: parseInt(e.target.value)})}
          className="w-full bg-white/10 border border-white/20 rounded-2xl text-white pl-12 pr-4 py-4 focus:outline-none focus:border-[#D08A10] backdrop-blur-lg appearance-none"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i+1} value={i+1} className="bg-gray-900">{i+1} Passenger{i !== 0 ? 's' : ''}</option>
          ))}
        </select>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full bg-gradient-to-r from-[#D08A10] to-[#F4C257] text-white py-4 rounded-2xl font-medium text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <span>Book Round Trip</span>
        <FiArrowRight size={20} />
      </motion.button>
    </motion.form>
  );
};

const MultiLegForm = ({ onSubmit }: FormProps) => {
  const [segments, setSegments] = useState<Segment[]>([{ from: '', to: '', date: '' }]);
  const [passengers, setPassengers] = useState(1);

  const addSegment = () => {
    setSegments([...segments, { from: '', to: '', date: '' }]);
  };

  const removeSegment = (index: number) => {
    if (segments.length > 1) {
      setSegments(segments.filter((_, i) => i !== index));
    }
  };

  const updateSegment = (index: number, field: keyof Segment, value: string) => {
    const newSegments = [...segments];
    newSegments[index][field] = value;
    setSegments(newSegments);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ segments, passengers });
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {segments.map((segment, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-light text-lg">Segment {index + 1}</h3>
            {segments.length > 1 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeSegment(index)}
                className="text-white/60 hover:text-red-400 transition-colors"
              >
                <FiMinus size={20} />
              </motion.button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D08A10]" size={18} />
              <input
                type="text"
                placeholder="From Airport"
                value={segment.from}
                onChange={(e) => updateSegment(index, 'from', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl text-white pl-10 pr-4 py-3 focus:outline-none focus:border-[#D08A10] placeholder-white/70"
                required
              />
            </div>

            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D08A10]" size={18} />
              <input
                type="text"
                placeholder="To Airport"
                value={segment.to}
                onChange={(e) => updateSegment(index, 'to', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl text-white pl-10 pr-4 py-3 focus:outline-none focus:border-[#D08A10] placeholder-white/70"
                required
              />
            </div>

            <div className="relative lg:col-span-2">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D08A10]" size={18} />
              <input
                type="date"
                value={segment.date}
                onChange={(e) => updateSegment(index, 'date', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl text-white pl-10 pr-4 py-3 focus:outline-none focus:border-[#D08A10]"
                required
              />
            </div>
          </div>
        </motion.div>
      ))}

      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={addSegment}
        className="w-full border-2 border-dashed border-white/30 text-white/70 hover:text-white hover:border-white/50 rounded-2xl py-4 transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <FiPlus size={20} />
        <span>Add Another Segment</span>
      </motion.button>

      <motion.div whileHover={{ scale: 1.02 }} className="relative">
        <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D08A10]" size={20} />
        <select
          value={passengers}
          onChange={(e) => setPassengers(parseInt(e.target.value))}
          className="w-full bg-white/10 border border-white/20 rounded-2xl text-white pl-12 pr-4 py-4 focus:outline-none focus:border-[#D08A10] backdrop-blur-lg appearance-none"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i+1} value={i+1} className="bg-gray-900">{i+1} Passenger{i !== 0 ? 's' : ''}</option>
          ))}
        </select>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full bg-gradient-to-r from-[#D08A10] to-[#F4C257] text-white py-4 rounded-2xl font-medium text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <span>Book Multi-Leg Journey</span>
        <FiArrowRight size={20} />
      </motion.button>
    </motion.form>
  );
};

// Types pour les données de la page
interface Service {
  title: string;
  description: string;
  icon: JSX.Element;
}

interface Advantage {
  title: string;
  description: string;
  icon: JSX.Element;
}

interface FAQ {
  question: string;
  answer: string;
}

// Composant principal
export default function Home() {
  const [activeForm, setActiveForm] = useState('oneWay');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const bookingSectionRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Flight booked:', formData);
    setIsLoading(false);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const scrollToBooking = () => {
    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const formTabs = [
    { id: 'oneWay', label: 'One Way', icon: <FiArrowRight size={18} /> },
    { id: 'roundTrip', label: 'Round Trip', icon: <FiChevronRight size={18} /> },
    { id: 'multiLeg', label: 'Multi-Leg', icon: <FiPlus size={18} /> }
  ];

  const services: Service[] = [
    {
      title: "Exclusive private jet charter",
      description: "From your starting point to your final destination, relax with complete peace of mind.",
      icon: <FaPlane className="text-[#D08A10]" size={32} />
    },
    {
      title: "Shared Flights",
      description: "Discover the exclusive EnvyJet experience with our shared jet flights.",
      icon: <FiUsers className="text-[#D08A10]" size={32} />
    },
    {
      title: "Empty Legs",
      description: "EnvyJet offers you a unique opportunity to save money.",
      icon: <FiStar className="text-[#D08A10]" size={32} />
    }
  ];

  const advantages: Advantage[] = [
    {
      title: "Speed",
      description: "Our private jet booking system is exceptionally fast, offering a major competitive advantage. Thanks to an intuitive user interface and cutting-edge technology, our customers can finalise their bookings in just a few clicks, dramatically reducing the time needed to plan their trips.",
      icon: <FiClock className="text-[#D08A10]" size={32} />
    },
    {
      title: "Competitiveness",
      description: "Our company stands out for its exceptional competitiveness in the field of private jet charter, thanks to a combination of cutting-edge technology, a highly qualified team and constant attention to our customers' needs.",
      icon: <FiStar className="text-[#D08A10]" size={32} />
    },
    {
      title: "Security",
      description: "Safety is our top priority when it comes to chartering private jets. We are committed to the highest safety standards, working with highly qualified pilots and certified operators.",
      icon: <FiShield className="text-[#D08A10]" size={32} />
    },
    {
      title: "Confidentiality",
      description: "The confidentiality of our customers is our absolute priority. We are committed to protecting all personal and business information with the utmost care.",
      icon: <FiLock className="text-[#D08A10]" size={32} />
    }
  ];

  const faqs: FAQ[] = [
    {
      question: "How far in advance should I book a charter to guarantee availability?",
      answer: "The recommended time frame for booking a charter flight may vary depending on several factors, including season, destination and aircraft availability. However, to ensure availability and have the most choice in terms of aircraft and routes, we generally recommend booking your charter flight at least a few weeks in advance."
    },
    {
      question: "Can you arrange flights to remote or less accessible locations?",
      answer: "Yes, as a private jet charter specialist we have the ability to arrange flights to a wide variety of destinations, including remote or less accessible locations. Thanks to our extensive network of partners and our logistics expertise, we are able to meet your travel needs, regardless of the destination."
    },
    {
      question: "How do you guarantee the privacy and confidentiality of your customers?",
      answer: "The privacy and confidentiality of our customers are of the utmost importance to us. We implement strict measures to ensure that all our customers' personal information and travel details remain confidential and secure."
    },
    {
      question: "Is customer support available 24/7?",
      answer: "Absolutely, our customer support team is available 24/7 to answer all your questions and assist you in planning your trips. Whether it's a reservation request, last minute changes or any other assistance needed, our team is here to provide you with exceptional service anytime, anywhere."
    }
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Navigation */}
      <Navbar transparent={true} />

      {/* Section Hero avec VideoBackground adaptatif */}
      <section className="relative h-screen flex items-center justify-center">
        <VideoBackground />
        
        {/* Overlay de dégradé plus léger */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20" />

        {/* Contenu Hero */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-7xl font-light mb-6 leading-tight"
          >
            At the Heart of
            <span className="block bg-gradient-to-r from-[#D08A10] to-[#F4C257] bg-clip-text text-transparent">
              Your Travels
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl lg:text-2xl text-white/90 mb-8 font-light max-w-3xl mx-auto"
          >
            PREMIUM PRIVATE JET SERVICE - Experience unparalleled luxury and comfort in the skies
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToBooking}
            className="bg-gradient-to-r from-[#D08A10] to-[#F4C257] text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
          >
            <FiPlay size={20} className="transform rotate-90" />
            <span>BOOK YOUR FLIGHT</span>
          </motion.button>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/80"
          >
            <FiChevronRight size={24} className="transform rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* Le reste du code reste inchangé... */}
      {/* [Coller ici les sections About, Services, Booking, Advantages, FAQ, Newsletter] */}
      
      {/* Section About */}
      <section id="why-envyjet" className="py-20 bg-gray-50">
        {/* ... contenu de la section About ... */}
      </section>

      {/* Section Services */}
      <section id="services" className="py-20 bg-white">
        {/* ... contenu de la section Services ... */}
      </section>

      {/* Section Réservation */}
      <section ref={bookingSectionRef} id="booking" className="py-20 bg-gradient-to-br from-gray-900 to-black">
        {/* ... contenu de la section Booking ... */}
      </section>

      {/* Section Avantages */}
      <section className="py-20 bg-gray-50">
        {/* ... contenu de la section Advantages ... */}
      </section>

      {/* Section FAQ avec accordéon */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4">Q&A</h2>
            <p className="text-gray-600 text-lg">Frequently asked questions about our services</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
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
      <section className="py-20 bg-gradient-to-br from-[#D08A10] to-[#F4C257]">
        {/* ... contenu de la section Newsletter ... */}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}