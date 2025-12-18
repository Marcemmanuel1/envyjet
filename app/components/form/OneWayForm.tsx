// components/form/OneWayForm.tsx
'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import AirportInput from '../AirportInput';
import { PassengersDropdown, PetsDropdown, LuggageDropdown } from './Dropdowns';
import { useFormSubmission } from '../../hooks/useFormSubmission';
import { OneWayFormData, FormProps } from '../../types';
import { getToday } from '../../utils';

const OneWayForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<OneWayFormData>({
    from: '',
    to: '',
    departureDate: getToday(),
    departureTime: '10:00',
    passengers: { adults: 1, children: 0, infants: 0 },
    pets: { small: 0, large: 0 },
    luggage: { carryOn: 0, holdLuggage: 0, skis: 0, golfBag: 0, others: 0 }
  });
  const [airportIds, setAirportIds] = useState({
    fromId: null as number | null,
    toId: null as number | null
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { submitForm, isSubmitting } = useFormSubmission();
  const router = useRouter();

  // Ref pour l'input date caché
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Fonction pour formater la date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en', { month: 'short' });
    const year = date.getFullYear();
    return `${day}, ${month}, ${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    if (!formData.from || !formData.to || !formData.departureDate || !airportIds.fromId || !airportIds.toId) {
      setValidationErrors(['Please fill all required fields and select valid airports']);
      return;
    }

    // Préparer les données avec les IDs
    const bookingData = {
      type: 'oneWay',
      data: {
        ...formData,
        fromId: airportIds.fromId,
        toId: airportIds.toId
      },
      timestamp: new Date().toISOString()
    };

    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    router.push('/details');
  };

  const handleInputChange = useCallback((field: keyof OneWayFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [validationErrors.length]);

  const handleFromChange = (value: string, airport?: any) => {
    handleInputChange('from', value);
    if (airport && airport.id) {
      setAirportIds(prev => ({ ...prev, fromId: airport.id }));
    } else {
      setAirportIds(prev => ({ ...prev, fromId: null }));
    }
  };

  const handleToChange = (value: string, airport?: any) => {
    handleInputChange('to', value);
    if (airport && airport.id) {
      setAirportIds(prev => ({ ...prev, toId: airport.id }));
    } else {
      setAirportIds(prev => ({ ...prev, toId: null }));
    }
  };

  const handleDateClick = () => {
    dateInputRef.current?.showPicker();
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-15 gap-[1px]">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative md:col-span-1 lg:col-span-3"
        >
          <AirportInput
            value={formData.from}
            onChange={(value) => handleFromChange(value)}
            onAirportSelect={(airport) => handleFromChange(airport.full_name, airport)}
            placeholder="From"
            airportId={airportIds.fromId}
            onAirportIdChange={(id) => setAirportIds(prev => ({ ...prev, fromId: id }))}
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative md:col-span-1 lg:col-span-3"
        >
          <AirportInput
            value={formData.to}
            onChange={(value) => handleToChange(value)}
            onAirportSelect={(airport) => handleToChange(airport.full_name, airport)}
            placeholder="To"
            airportId={airportIds.toId}
            onAirportIdChange={(id) => setAirportIds(prev => ({ ...prev, toId: id }))}
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative md:col-span-1 lg:col-span-2"
        >
          <FiCalendar className="absolute left-1 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10" size={20} />
          <input
            ref={dateInputRef}
            type="date"
            value={formData.departureDate}
            onChange={(e) => handleInputChange('departureDate', e.target.value)}
            min={getToday()}
            className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-11 pr-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] text-sm lg:text-base transition-all absolute opacity-0 pointer-events-none"
            style={{ fontFamily: 'Century Gothic, sans-serif' }}
            required
          />
          <div
            className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-7 pr-2 py-3 lg:py-[18px] text-sm lg:text-[14px] cursor-pointer"
            style={{ fontFamily: 'Century Gothic, sans-serif' }}
            onClick={handleDateClick}
          >
            {formatDate(formData.departureDate)}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative md:col-span-1 lg:col-span-2"
        >
          <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10" size={20} />
          <input
            type="time"
            value={formData.departureTime}
            onChange={(e) => handleInputChange('departureTime', e.target.value)}
            className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-11 pr-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] text-sm lg:text-base transition-all"
            style={{ fontFamily: 'Century Gothic, sans-serif' }}
            required
          />
        </motion.div>

        <div className="grid grid-cols-3 gap-[1px] md:col-span-2 lg:col-span-3">
          <div>
            <PassengersDropdown
              passengers={formData.passengers}
              onChange={(passengers) => handleInputChange('passengers', passengers)}
            />
          </div>

          <div>
            <PetsDropdown
              pets={formData.pets}
              onChange={(pets) => handleInputChange('pets', pets)}
            />
          </div>

          <div>
            <LuggageDropdown
              luggage={formData.luggage}
              onChange={(luggage) => handleInputChange('luggage', luggage)}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03, backgroundColor: "#a98c2f" }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#d3a936] text-white md:col-span-2 lg:col-span-2 py-3 lg:py-3 font-medium text-base lg:text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'Century Gothic, sans-serif' }}
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Search...</span>
            </>
          ) : (
            <span>SEARCH</span>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default OneWayForm;