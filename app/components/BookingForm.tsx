// components/BookingForm.tsx

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClientCheck } from '../hooks/useClientCheck'; // Cette importation devrait maintenant fonctionner
import { FORM_TABS } from '../constants';
import { FormProps } from '../types';
import OneWayForm from './form/OneWayForm';
import RoundTripForm from './form/RoundTripForm';
import MultiLegForm from './form/MultiLegForm';

const BookingForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [activeForm, setActiveForm] = useState('oneWay');
  const isClient = useClientCheck();

  const handleFormSubmit = async (formData: any) => {
    await onSubmit(formData);
  };

  if (!isClient) {
    return (
      <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-white/20"></div>
          <div className="h-16 bg-white/20"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-4 lg:p-6 shadow-2xl"
    >
      <div className="flex bg-white/10 p-1 mb-6" role="tablist">
        {FORM_TABS.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveForm(tab.id)}
            className={`flex-1 py-3 px-4 transition-all duration-300 flex items-center justify-center space-x-2 text-sm font-medium ${activeForm === tab.id
              ? 'bg-[#d3a936] text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            style={{ fontFamily: 'Century Gothic, sans-serif' }}
            role="tab"
            aria-selected={activeForm === tab.id}
          >
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <div key={activeForm}>
          {activeForm === 'oneWay' && <OneWayForm onSubmit={handleFormSubmit} />}
          {activeForm === 'roundTrip' && <RoundTripForm onSubmit={handleFormSubmit} />}
          {activeForm === 'multiLeg' && <MultiLegForm onSubmit={handleFormSubmit} />}
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

export default BookingForm;