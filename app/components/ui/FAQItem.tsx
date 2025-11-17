// components/ui/FAQItem.tsx

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { FAQItemProps } from '../../types';

const FAQItem: React.FC<FAQItemProps> = React.memo(({ question, answer, isOpen, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white overflow-hidden border border-[#969696]/20"
    >
      <button
        onClick={onClick}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#f8f8f8] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#a98c2f] focus:ring-opacity-50"
        aria-expanded={isOpen}
      >
        <h3 className={`text-lg pr-4 transition-all duration-300 ${isOpen ? 'font-bold text-[#193650]' : 'font-medium text-[#193650]'
          }`} style={{ fontFamily: 'Century Gothic, sans-serif' }}>
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <FiChevronDown className="text-[#a98c2f]" size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4">
              <p className="text-[#193650] leading-relaxed text-justify font-medium" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

FAQItem.displayName = 'FAQItem';

export default FAQItem;