// components/form/RoundTripForm.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
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
      date: getToday(),
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
  const [airportIds, setAirportIds] = useState({
    outboundFromId: null as number | null,
    outboundToId: null as number | null,
    returnFromId: null as number | null,
    returnToId: null as number | null
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { submitForm, isSubmitting } = useFormSubmission();
  const router = useRouter();

  // Refs pour les inputs date cachés
  const outboundDateInputRef = useRef<HTMLInputElement>(null);
  const returnDateInputRef = useRef<HTMLInputElement>(null);

  // Fonction pour formater la date
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en', { month: 'short' });
    const year = date.getFullYear();
    return `${day}, ${month}, ${year}`;
  };

  // Synchroniser automatiquement les champs de retour lorsque l'outbound change
  useEffect(() => {
    // Si l'outbound "to" change et que le retour "from" est vide ou égal à l'ancienne valeur
    if (formData.outbound.to && (!formData.return.from || formData.return.from === '')) {
      setFormData(prev => ({
        ...prev,
        return: { ...prev.return, from: formData.outbound.to }
      }));
    }

    // Si l'outbound "from" change et que le retour "to" est vide ou égal à l'ancienne valeur
    if (formData.outbound.from && (!formData.return.to || formData.return.to === '')) {
      setFormData(prev => ({
        ...prev,
        return: { ...prev.return, to: formData.outbound.from }
      }));
    }
  }, [formData.outbound.from, formData.outbound.to]);

  // Synchroniser les IDs d'aéroports pour le retour
  useEffect(() => {
    // Synchroniser l'ID du retour "from" avec l'ID de l'outbound "to"
    if (airportIds.outboundToId && !airportIds.returnFromId) {
      setAirportIds(prev => ({ ...prev, returnFromId: airportIds.outboundToId }));
    }

    // Synchroniser l'ID du retour "to" avec l'ID de l'outbound "from"
    if (airportIds.outboundFromId && !airportIds.returnToId) {
      setAirportIds(prev => ({ ...prev, returnToId: airportIds.outboundFromId }));
    }
  }, [airportIds.outboundFromId, airportIds.outboundToId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    // Vérifier les champs requis
    const errors: string[] = [];

    if (!formData.outbound.from) errors.push('Outbound departure airport is required');
    if (!formData.outbound.to) errors.push('Outbound arrival airport is required');
    if (!formData.outbound.date) errors.push('Outbound date is required');
    if (!formData.return.from) errors.push('Return departure airport is required');
    if (!formData.return.to) errors.push('Return arrival airport is required');
    if (!formData.return.date) errors.push('Return date is required');

    // Vérifier les IDs d'aéroports
    if (!airportIds.outboundFromId) errors.push('Please select a valid outbound departure airport');
    if (!airportIds.outboundToId) errors.push('Please select a valid outbound arrival airport');
    if (!airportIds.returnFromId) errors.push('Please select a valid return departure airport');
    if (!airportIds.returnToId) errors.push('Please select a valid return arrival airport');

    // Vérifier que la date de retour est après la date d'outbound
    if (formData.outbound.date && formData.return.date) {
      const outboundDate = new Date(formData.outbound.date);
      const returnDate = new Date(formData.return.date);
      if (returnDate < outboundDate) {
        errors.push('Return date must be after outbound date');
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Préparer les données avec les IDs
    const bookingData = {
      type: 'roundTrip',
      data: {
        outbound: {
          ...formData.outbound,
          fromId: airportIds.outboundFromId,
          toId: airportIds.outboundToId
        },
        return: {
          ...formData.return,
          fromId: airportIds.returnFromId,
          toId: airportIds.returnToId
        }
      },
      timestamp: new Date().toISOString()
    };

    console.log('Booking data to save:', bookingData);
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    router.push('/details');
  };

  const handleOutboundChange = useCallback((field: keyof typeof formData.outbound, value: any) => {
    setFormData(prev => ({
      ...prev,
      outbound: { ...prev.outbound, [field]: value }
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

  const handleOutboundFromChange = (value: string, airport?: any) => {
    handleOutboundChange("from", value);
    if (airport && airport.id) {
      setAirportIds(prev => ({ ...prev, outboundFromId: airport.id }));
      // Si le retour "to" est vide ou égal à l'ancienne valeur, le synchroniser
      if (!formData.return.to || formData.return.to === formData.outbound.from) {
        handleReturnChange('to', value);
        setAirportIds(prev => ({ ...prev, returnToId: airport.id }));
      }
    } else {
      setAirportIds(prev => ({ ...prev, outboundFromId: null }));
      // Réinitialiser aussi le retour "to" si c'était synchronisé
      if (formData.return.to === value) {
        handleReturnChange('to', '');
        setAirportIds(prev => ({ ...prev, returnToId: null }));
      }
    }
  };

  const handleOutboundToChange = (value: string, airport?: any) => {
    handleOutboundChange("to", value);
    if (airport && airport.id) {
      setAirportIds(prev => ({ ...prev, outboundToId: airport.id }));
      // Si le retour "from" est vide ou égal à l'ancienne valeur, le synchroniser
      if (!formData.return.from || formData.return.from === formData.outbound.to) {
        handleReturnChange('from', value);
        setAirportIds(prev => ({ ...prev, returnFromId: airport.id }));
      }
    } else {
      setAirportIds(prev => ({ ...prev, outboundToId: null }));
      // Réinitialiser aussi le retour "from" si c'était synchronisé
      if (formData.return.from === value) {
        handleReturnChange('from', '');
        setAirportIds(prev => ({ ...prev, returnFromId: null }));
      }
    }
  };

  const handleReturnFromChange = (value: string, airport?: any) => {
    handleReturnChange("from", value);
    if (airport && airport.id) {
      setAirportIds(prev => ({ ...prev, returnFromId: airport.id }));
    } else {
      setAirportIds(prev => ({ ...prev, returnFromId: null }));
    }
  };

  const handleReturnToChange = (value: string, airport?: any) => {
    handleReturnChange("to", value);
    if (airport && airport.id) {
      setAirportIds(prev => ({ ...prev, returnToId: airport.id }));
    } else {
      setAirportIds(prev => ({ ...prev, returnToId: null }));
    }
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-14 gap-[1px]">
          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-1 lg:col-span-3">
            <AirportInput
              value={formData.outbound.from}
              onChange={(value) => handleOutboundFromChange(value)}
              onAirportSelect={(airport) => handleOutboundFromChange(airport.full_name, airport)}
              placeholder="From"
              airportId={airportIds.outboundFromId}
              onAirportIdChange={(id) => setAirportIds(prev => ({ ...prev, outboundFromId: id }))}
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-1 lg:col-span-3">
            <AirportInput
              value={formData.outbound.to}
              onChange={(value) => handleOutboundToChange(value)}
              onAirportSelect={(airport) => handleOutboundToChange(airport.full_name, airport)}
              placeholder="To"
              airportId={airportIds.outboundToId}
              onAirportIdChange={(id) => setAirportIds(prev => ({ ...prev, outboundToId: id }))}
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-1 lg:col-span-3">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10" size={20} />
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
            <div
              className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-11 pr-4 py-3 lg:py-4 text-sm lg:text-base cursor-pointer"
              style={{ fontFamily: "Century Gothic, sans-serif" }}
              onClick={handleOutboundDateClick}
            >
              {formatDate(formData.outbound.date)}
            </div>
          </motion.div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-14 gap-[1px]">
          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-1 lg:col-span-3">
            <AirportInput
              value={formData.return.from}
              onChange={(value) => handleReturnFromChange(value)}
              onAirportSelect={(airport) => handleReturnFromChange(airport.full_name, airport)}
              placeholder="From"
              airportId={airportIds.returnFromId}
              onAirportIdChange={(id) => setAirportIds(prev => ({ ...prev, returnFromId: id }))}
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-1 lg:col-span-3">
            <AirportInput
              value={formData.return.to}
              onChange={(value) => handleReturnToChange(value)}
              onAirportSelect={(airport) => handleReturnToChange(airport.full_name, airport)}
              placeholder="To"
              airportId={airportIds.returnToId}
              onAirportIdChange={(id) => setAirportIds(prev => ({ ...prev, returnToId: id }))}
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-1 lg:col-span-3">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10" size={20} />
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
            <div
              className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-11 pr-4 py-3 lg:py-4 text-sm lg:text-base cursor-pointer"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
              onClick={handleReturnDateClick}
            >
              {formData.return.date ? formatDate(formData.return.date) : 'Select date'}
            </div>
          </motion.div>

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