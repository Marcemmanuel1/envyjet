// components/BookingForm.tsx

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClientCheck } from '../hooks/useClientCheck';
import { FORM_TABS } from '../constants';
import {
  FormProps,
  OneWayFormData,
  RoundTripFormData,
  MultiLegFormData
} from '../types';
import OneWayForm from './form/OneWayForm';
import RoundTripForm from './form/RoundTripForm';
import MultiLegForm from './form/MultiLegForm';

const BookingForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [activeForm, setActiveForm] = useState('oneWay');
  const isClient = useClientCheck();

  const handleFormSubmit = async (formData: OneWayFormData | RoundTripFormData | MultiLegFormData) => {
    try {
      // Ajout de validation avant soumission
      const validatedData = validateFormData(formData, activeForm);
      await onSubmit(validatedData);
    } catch (error) {
      console.error('Form submission error:', error);
      // Vous pourriez ajouter ici un gestionnaire d'erreur visuel
    }
  };

  // Fonction de validation des données du formulaire
  const validateFormData = (
    data: OneWayFormData | RoundTripFormData | MultiLegFormData,
    formType: string
  ) => {
    switch (formType) {
      case 'oneWay':
        return validateOneWayData(data as OneWayFormData);
      case 'roundTrip':
        return validateRoundTripData(data as RoundTripFormData);
      case 'multiLeg':
        return validateMultiLegData(data as MultiLegFormData);
      default:
        return data;
    }
  };

  const validateOneWayData = (data: OneWayFormData): OneWayFormData => {
    if (!data.from || !data.to) {
      throw new Error('Les aéroports de départ et d\'arrivée sont requis');
    }
    if (!data.departureDate) {
      throw new Error('La date de départ est requise');
    }
    if (data.passengers.adults === 0) {
      throw new Error('Au moins un adulte est requis');
    }
    return data;
  };

  const validateRoundTripData = (data: RoundTripFormData): RoundTripFormData => {
    if (!data.outbound.from || !data.outbound.to || !data.return.from || !data.return.to) {
      throw new Error('Tous les aéroports sont requis');
    }
    if (!data.outbound.date || !data.return.date) {
      throw new Error('Les dates aller-retour sont requises');
    }
    if (data.outbound.passengers.adults === 0 || data.return.passengers.adults === 0) {
      throw new Error('Au moins un adulte est requis');
    }
    return data;
  };

  const validateMultiLegData = (data: MultiLegFormData): MultiLegFormData => {
    if (data.legs.length < 2) {
      throw new Error('Au moins deux segments sont requis pour un vol multi-étapes');
    }

    data.legs.forEach((leg, index) => {
      if (!leg.from || !leg.to) {
        throw new Error(`Les aéroports du segment ${index + 1} sont requis`);
      }
      if (!leg.date) {
        throw new Error(`La date du segment ${index + 1} est requise`);
      }
      if (leg.passengers.adults === 0) {
        throw new Error(`Au moins un adulte est requis pour le segment ${index + 1}`);
      }
    });

    return data;
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
            aria-controls={`${tab.id}-panel`}
          >
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <div
          key={activeForm}
          id={`${activeForm}-panel`}
          role="tabpanel"
          aria-labelledby={`${activeForm}-tab`}
        >
          {activeForm === 'oneWay' && <OneWayForm onSubmit={handleFormSubmit} />}
          {activeForm === 'roundTrip' && <RoundTripForm onSubmit={handleFormSubmit} />}
          {activeForm === 'multiLeg' && <MultiLegForm onSubmit={handleFormSubmit} />}
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

export default BookingForm; 