'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import AirportInput from '../AirportInput';
import { PassengersDropdown, PetsDropdown, LuggageDropdown } from './Dropdowns';
import { useFormSubmission } from '../../hooks/useFormSubmission';
import { RoundTripFormData, FormProps } from '../../types';
import { getToday } from '../../utils';

const RoundTripForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<RoundTripFormData>({
    outbound: {
      from: '',
      to: '',
      date: getToday(), // Date du jour par défaut
      time: '10:00',
      passengers: { adults: 1, children: 0, infants: 0 },
      pets: { small: 0, large: 0 },
      luggage: { carryOn: 0, holdLuggage: 0, skis: 0, golfBag: 0, others: 0 }
    },
    return: {
      from: '',
      to: '',
      date: '',
      time: '10:00',
      passengers: { adults: 1, children: 0, infants: 0 },
      pets: { small: 0, large: 0 },
      luggage: { carryOn: 0, holdLuggage: 0, skis: 0, golfBag: 0, others: 0 }
    }
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { submitForm, isSubmitting } = useFormSubmission();
  const router = useRouter();

  // Refs pour les inputs date cachés
  const outboundDateInputRef = useRef<HTMLInputElement>(null);
  const returnDateInputRef = useRef<HTMLInputElement>(null);

  // Fonction pour formater la date au format "11, Oct, 2025"
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en', { month: 'short' });
    const year = date.getFullYear();
    return `${day}, ${month}, ${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    if (!formData.outbound.from || !formData.outbound.to || !formData.outbound.date ||
      !formData.return.from || !formData.return.to || !formData.return.date) {
      setValidationErrors(['Please fill all required fields']);
      return;
    }

    sessionStorage.setItem('bookingData', JSON.stringify({
      type: 'roundTrip',
      data: formData,
      timestamp: new Date().toISOString()
    }));

    router.push('/details');
  };

  const handleOutboundChange = useCallback((field: keyof typeof formData.outbound, value: any) => {
    setFormData(prev => ({
      ...prev,
      outbound: { ...prev.outbound, [field]: value },
      return: field === 'from' || field === 'to' ? {
        ...prev.return,
        from: field === 'to' ? value : prev.return.from,
        to: field === 'from' ? value : prev.return.to
      } : prev.return
    }));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [validationErrors.length]);

  const handleReturnChange = useCallback((field: keyof typeof formData.return, value: any) => {
    setFormData(prev => ({
      ...prev,
      return: { ...prev.return, [field]: value }
    }));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [validationErrors.length]);

  // Fonctions pour ouvrir les sélecteurs de date
  const handleOutboundDateClick = () => {
    outboundDateInputRef.current?.showPicker();
  };

  const handleReturnDateClick = () => {
    returnDateInputRef.current?.showPicker();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationErrors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 p-4"
        >
          <ul className="text-red-800 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </motion.div>
      )}

      <div className="space-y-4">
        <h3 className="text-white text-base font-medium md:mt-" style={{ fontFamily: "Century Gothic, sans-serif" }}>
          Outbound
        </h3>

        {/* Disposition responsive pour outbound */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-14 gap-[1px]">
          {/* From - Prend toute la largeur sur mobile, 1/2 sur tablette */}
          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-1 lg:col-span-3">
            <AirportInput
              value={formData.outbound.from}
              onChange={(value) => handleOutboundChange("from", value)}
              placeholder="From"
            />
          </motion.div>

          {/* To - Prend toute la largeur sur mobile, 1/2 sur tablette */}
          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-1 lg:col-span-3">
            <AirportInput
              value={formData.outbound.to}
              onChange={(value) => handleOutboundChange("to", value)}
              placeholder="To"
            />
          </motion.div>

          {/* Date - Prend toute la largeur sur mobile, 1/2 sur tablette */}
          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-1 lg:col-span-3">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10" size={20} />
            {/* Input date caché mais fonctionnel */}
            <input
              ref={outboundDateInputRef}
              type="date"
              value={formData.outbound.date}
              onChange={(e) => handleOutboundChange("date", e.target.value)}
              min={getToday()}
              className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-11 pr-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] text-sm lg:text-base transition-all absolute opacity-0 pointer-events-none"
              style={{ fontFamily: "Century Gothic, sans-serif" }}
              required
            />
            {/* Div d'affichage avec le format personnalisé */}
            <div
              className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-11 pr-4 py-3 lg:py-4 text-sm lg:text-base cursor-pointer"
              style={{ fontFamily: "Century Gothic, sans-serif" }}
              onClick={handleOutboundDateClick}
            >
              {formatDate(formData.outbound.date)}
            </div>
          </motion.div>

          {/* Time - Prend toute la largeur sur mobile, 1/2 sur tablette */}
          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-1 lg:col-span-2">
            <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10" size={20} />
            <input
              type="time"
              value={formData.outbound.time}
              onChange={(e) => handleOutboundChange("time", e.target.value)}
              className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-11 pr-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] text-sm lg:text-base transition-all"
              style={{ fontFamily: "Century Gothic, sans-serif" }}
              required
            />
          </motion.div>

          {/* Dropdowns - Prend toute la largeur sur mobile et tablette */}
          <div className="grid grid-cols-3 gap-[1px] md:col-span-2 lg:col-span-3">
            <div className="w-full">
              <PassengersDropdown
                passengers={formData.outbound.passengers}
                onChange={(passengers) => handleOutboundChange("passengers", passengers)}
              />
            </div>

            <div className="w-full">
              <PetsDropdown
                pets={formData.outbound.pets}
                onChange={(pets) => handleOutboundChange("pets", pets)}
              />
            </div>

            <div className="w-full">
              <LuggageDropdown
                luggage={formData.outbound.luggage}
                onChange={(luggage) => handleOutboundChange("luggage", luggage)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-white text-base font-medium" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Inbound</h3>

        {/* Disposition responsive pour inbound */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-14 gap-[1px]">
          {/* From - Prend toute la largeur sur mobile, 1/2 sur tablette */}
          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-1 lg:col-span-3">
            <AirportInput
              value={formData.return.from || formData.outbound.to}
              onChange={(value) => handleReturnChange('from', value)}
              placeholder="From"
            />
          </motion.div>

          {/* To - Prend toute la largeur sur mobile, 1/2 sur tablette */}
          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-1 lg:col-span-3">
            <AirportInput
              value={formData.return.to || formData.outbound.from}
              onChange={(value) => handleReturnChange('to', value)}
              placeholder="To"
            />
          </motion.div>

          {/* Date - Prend toute la largeur sur mobile, 1/2 sur tablette */}
          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-1 lg:col-span-3">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10" size={20} />
            {/* Input date caché mais fonctionnel */}
            <input
              ref={returnDateInputRef}
              type="date"
              value={formData.return.date}
              onChange={(e) => handleReturnChange('date', e.target.value)}
              min={formData.outbound.date || getToday()}
              className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-11 pr-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] text-sm lg:text-base transition-all absolute opacity-0 pointer-events-none"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
              required
            />
            {/* Div d'affichage avec le format personnalisé */}
            <div
              className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-11 pr-4 py-3 lg:py-4 text-sm lg:text-base cursor-pointer"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
              onClick={handleReturnDateClick}
            >
              {formatDate(formData.return.date) || 'Select date'}
            </div>
          </motion.div>

          {/* Time - Prend toute la largeur sur mobile, 1/2 sur tablette */}
          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-1 lg:col-span-2">
            <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10" size={20} />
            <input
              type="time"
              value={formData.return.time}
              onChange={(e) => handleReturnChange('time', e.target.value)}
              className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-11 pr-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] text-sm lg:text-base transition-all"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
              required
            />
          </motion.div>

          {/* Dropdowns - Prend toute la largeur sur mobile et tablette */}
          <div className='grid grid-cols-3 gap-[1px] md:col-span-2 lg:col-span-3'>
            <div>
              <PassengersDropdown
                passengers={formData.return.passengers}
                onChange={(passengers) => handleReturnChange('passengers', passengers)}
              />
            </div>

            <div>
              <PetsDropdown
                pets={formData.return.pets}
                onChange={(pets) => handleReturnChange('pets', pets)}
              />
            </div>

            <div>
              <LuggageDropdown
                luggage={formData.return.luggage}
                onChange={(luggage) => handleReturnChange('luggage', luggage)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bouton responsive */}
      <motion.button
        whileHover={{ scale: 1.03, backgroundColor: "#a98c2f" }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-[100%] lg:w-[20%] bg-[#d3a936] text-white py-3 lg:py-4 font-medium text-base lg:text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: 'Century Gothic, sans-serif' }}
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            <span>search...</span>
          </>
        ) : (
          <span>SEARCH</span>
        )}
      </motion.button>
    </form>
  );
};

export default RoundTripForm;