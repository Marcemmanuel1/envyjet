"use client";

// Component imports
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiPhone,
  FiGlobe,
  FiShield,
  FiTrendingUp,
  FiClock,
  FiUserCheck
} from "react-icons/fi";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
};

const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function WhyEnvyJet() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden" style={{ margin: 0, padding: 0, fontFamily: 'Century Gothic, sans-serif' }}>

      <Navbar />

      {/* Hero Section */}
      <section
        className="relative min-h-[60vh] flex items-center justify-center w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/bg-contact.jpg')" }}
      >
        {/* Superposition sombre */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-bold text-white mb-6"
            >
              The True Expression of Prestige
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-200 mb-8"
            >
              Discover why EnvyJet is the preferred choice for excellence in private aviation
            </motion.p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white bg-opacity-95">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl md:max-w-[100%] mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-center text-gray-800 mb-12"
            >
              About Us
            </motion.h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 border-2 border-gray-200 shadow-lg"
              >
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Immerse yourself in luxury and comfort with EnvyJet, where every detail is
                  carefully planned to provide a unique experience for our clients.
                </p>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Whether you're looking for a private jet flight, helicopter, commercial jet,
                  or specialized services such as air ambulances and cargo transport, we have what you need.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 border-2 border-gray-200 shadow-lg"
              >
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Our dedicated team ensures that our business partners, guests, and their families
                  benefit from an exceptional journey. Whether for urgent business travel or a personal
                  getaway, our services are designed to be fast, efficient, and economical.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  With a team backed by over 20 years of expertise in aviation and customer experience,
                  we will transform your journey into a bespoke luxury experience.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl md:max-w-[100%] mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-center text-gray-800 mb-12"
            >
              Our Exclusive Advantages
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Speed */}
              <motion.div
                variants={scaleIn}
                className="bg-white p-6 border-2 border-gray-200 shadow-lg text-center"
              >
                <motion.div
                  className="w-16 h-16 bg-[#d3a936] flex items-center justify-center mx-auto rounded-[50px] mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FiClock className="text-white" size={24} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Speed</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <motion.li
                    className="flex items-center justify-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Minimal contact
                  </motion.li>
                  <motion.li
                    className="flex items-center justify-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Easy booking system
                  </motion.li>
                  <motion.li
                    className="flex items-center justify-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Quick quote
                  </motion.li>
                </ul>
              </motion.div>

              {/* Competitive Pricing */}
              <motion.div
                variants={scaleIn}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 border-2 border-gray-200 shadow-lg text-center"
              >
                <motion.div
                  className="w-16 h-16 bg-[#d3a936] flex items-center justify-center mx-auto mb-4 rounded-[50px]"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FiTrendingUp className="text-white" size={24} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Competitive Pricing</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <motion.li
                    className="flex items-center justify-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Flexible pricing
                  </motion.li>
                  <motion.li
                    className="flex items-center justify-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Minimal markup
                  </motion.li>
                  <motion.li
                    className="flex items-center justify-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    No hidden fees
                  </motion.li>
                </ul>
              </motion.div>

              {/* Security */}
              <motion.div
                variants={scaleIn}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 border-2 border-gray-200 shadow-lg text-center"
              >
                <motion.div
                  className="w-16 h-16 bg-[#d3a936] flex items-center justify-center mx-auto mb-4 rounded-[50px]"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FiShield className="text-white" size={24} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Security</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <motion.li
                    className="flex items-center justify-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Certified partners
                  </motion.li>
                  <motion.li
                    className="flex items-center justify-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    International standards
                  </motion.li>
                  <motion.li
                    className="flex items-center justify-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Rigorous controls
                  </motion.li>
                </ul>
              </motion.div>

              {/* Confidentiality */}
              <motion.div
                variants={scaleIn}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 border-2 border-gray-200 shadow-lg text-center"
              >
                <motion.div
                  className="w-16 h-16 bg-[#d3a936] flex items-center justify-center mx-auto mb-4 rounded-[50px]"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FiUserCheck className="text-white" size={24} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Confidentiality</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <motion.li
                    className="flex items-center justify-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Discretion assured
                  </motion.li>
                  <motion.li
                    className="flex items-center justify-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Confidentiality agreement
                  </motion.li>
                  <motion.li
                    className="flex items-center justify-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Secure data
                  </motion.li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Coverage Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl md:max-w-[100%] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 border-2 border-gray-200 shadow-lg text-center"
            >
              <motion.div
                className="w-20 h-20 bg-[#d3a936] flex items-center justify-center mx-auto mb-6 rounded-[50px]"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <FiGlobe className="text-white" size={32} />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Global Coverage
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                No matter where you want to fly. Our international network provides you with local knowledge on a global scale
              </p>
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
              >
                <motion.div
                  variants={fadeInUp}
                  className="bg-gray-100 p-4 border border-gray-300 cursor-pointer"
                  whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="text-lg font-bold text-gray-800">Africa</h3>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-100 p-4 border border-gray-300 cursor-pointer"
                  whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                >
                  <h3 className="text-lg font-bold text-gray-800">Europe</h3>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-100 p-4 border border-gray-300 cursor-pointer"
                  whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                >
                  <h3 className="text-lg font-bold text-gray-800">United States</h3>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-100 p-4 border border-gray-300 cursor-pointer"
                  whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                >
                  <h3 className="text-lg font-bold text-gray-800">Middle East</h3>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl md:max-w-[100%] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 border-2 border-gray-200 shadow-lg text-center"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-8">
                Our Exclusive Fleet
              </h2>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
              >
                <motion.div
                  variants={scaleIn}
                  className="bg-gray-50 p-6 border border-gray-300 cursor-pointer"
                  whileHover={{ scale: 1.05, borderColor: "#d3a936" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="text-3xl font-bold text-[#d3a936] mb-2">60,000+</h3>
                  <p className="text-gray-700 font-medium">Available aircraft</p>
                </motion.div>
                <motion.div
                  variants={scaleIn}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-50 p-6 border border-gray-300 cursor-pointer"
                  whileHover={{ scale: 1.05, borderColor: "#d3a936" }}
                >
                  <h3 className="text-3xl font-bold text-[#d3a936] mb-2">120+</h3>
                  <p className="text-gray-700 font-medium">Different aircraft types</p>
                </motion.div>
                <motion.div
                  variants={scaleIn}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-50 p-6 border border-gray-300 cursor-pointer"
                  whileHover={{ scale: 1.05, borderColor: "#d3a936" }}
                >
                  <h3 className="text-3xl font-bold text-[#d3a936] mb-2">24/7</h3>
                  <p className="text-gray-700 font-medium">Dedicated customer service</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl md:max-w-[100%] mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-center text-gray-800 mb-12"
            >
              Our Premium Services
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Private Jet */}
              <motion.div
                variants={scaleIn}
                className="bg-white p-6 border-2 border-gray-200 shadow-lg cursor-pointer"
                whileHover={{
                  scale: 1.03,
                  borderColor: "#d3a936",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-xl font-bold text-[#d3a936] mb-4">Private Jet Charter</h3>
                <p className="text-gray-700 mb-4">
                  Business flights and leisure travel with personalized and discreet service.
                </p>
                <ul className="text-gray-600 text-sm space-y-2">
                  <motion.li
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Luxury and comfort
                  </motion.li>
                  <motion.li
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Discretion and security
                  </motion.li>
                  <motion.li
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Customized schedule
                  </motion.li>
                </ul>
              </motion.div>

              {/* Shared Flights */}
              <motion.div
                variants={scaleIn}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 border-2 border-gray-200 shadow-lg cursor-pointer"
                whileHover={{
                  scale: 1.03,
                  borderColor: "#d3a936",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <h3 className="text-xl font-bold text-[#d3a936] mb-4">Shared Flights</h3>
                <p className="text-gray-700 mb-4">
                  Exclusive experience at an affordable price through cost sharing.
                </p>
                <ul className="text-gray-600 text-sm space-y-2">
                  <motion.li
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Substantial savings
                  </motion.li>
                  <motion.li
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Total flexibility
                  </motion.li>
                  <motion.li
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Confidential and comfortable
                  </motion.li>
                </ul>
              </motion.div>

              {/* Special Services */}
              <motion.div
                variants={scaleIn}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 border-2 border-gray-200 shadow-lg cursor-pointer"
                whileHover={{
                  scale: 1.03,
                  borderColor: "#d3a936",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <h3 className="text-xl font-bold text-[#d3a936] mb-4">Special Services</h3>
                <p className="text-gray-700 mb-4">
                  Tailored solutions for all your air transport needs.
                </p>
                <ul className="text-gray-600 text-sm space-y-2">
                  <motion.li
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Air ambulance
                  </motion.li>
                  <motion.li
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Athlete transport
                  </motion.li>
                  <motion.li
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  >
                    <FiCheckCircle className="text-[#d3a936] mr-2" />
                    Freight and cargo
                  </motion.li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#d3a936]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl md:max-w-[100%] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 shadow-lg text-center"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Ready to Experience EnvyJet?
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Join us and discover the true expression of prestige
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#a98c2f" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#d3a936] text-white px-8 py-4 font-semibold transition duration-200"
                >
                  Create an Account
                </motion.button>
                <motion.div
                  className="flex items-center space-x-2 text-gray-700 font-semibold"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FiPhone className="text-[#d3a936]" size={20} />
                  <span>+225 0759102503</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}