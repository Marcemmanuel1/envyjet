// components/form/MultiLegForm.tsx

'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiPlus, FiMinus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import AirportInput from '../AirportInput';
import { PassengersDropdown, PetsDropdown, LuggageDropdown } from './Dropdowns';
import { useFormSubmission } from '../../hooks/useFormSubmission';
import { MultiLegFormData, FlightLeg, FormProps } from '../../types';
import { getToday } from '../../utils';

const MultiLegForm: React.FC<FormProps> = ({ onSubmit }) => {
  const emptyLeg: FlightLeg = {
    from: '',
    to: '',
    date: getToday(), // Date du jour par défaut
    time: '10:00',
    passengers: { adults: 1, children: 0, infants: 0 },
    pets: { small: 0, large: 0 },
    luggage: { carryOn: 0, holdLuggage: 0, skis: 0, golfBag: 0, others: 0 }
  };

  const [legs, setLegs] = useState<FlightLeg[]>([emptyLeg, emptyLeg]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { submitForm, isSubmitting } = useFormSubmission();
  const router = useRouter();

  // Fonction pour formater la date au format "11, Oct, 2025"
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en', { month: 'short' });
    const year = date.getFullYear();
    return `${day}, ${month}, ${year}`;
  };

  const addLeg = useCallback(() => {
    setLegs(prev => [...prev, { ...emptyLeg }]);
  }, []);

  const removeLeg = useCallback((index: number) => {
    if (legs.length > 1) {
      setLegs(prev => prev.filter((_, i) => i !== index));
    }
  }, [legs.length]);

  const updateLeg = useCallback((index: number, field: keyof FlightLeg, value: any) => {
    setLegs(prev => {
      const newLegs = [...prev];
      newLegs[index] = { ...newLegs[index], [field]: value };
      return newLegs;
    });

    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [validationErrors.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasEmptyFields = legs.some(leg => !leg.from || !leg.to || !leg.date);
    if (hasEmptyFields) {
      setValidationErrors(['Please fill all required fields for each leg']);
      return;
    }

    const formData: MultiLegFormData = { legs };

    sessionStorage.setItem('bookingData', JSON.stringify({
      type: 'multiLeg',
      data: formData,
      timestamp: new Date().toISOString()
    }));

    router.push('/details');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4">
          <ul className="text-red-800 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        {legs.map((leg, index) => (
          <div key={index} className="space-y-[6px]">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-base font-medium" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                Leg {index + 1}
              </h3>

              {legs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLeg(index)}
                  className="text-red-400 hover:text-red-300 transition-colors p-2"
                >
                  <FiMinus size={20} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-14 gap-[1px]">
              <div className="relative md:col-span-3">
                <AirportInput
                  value={leg.from}
                  onChange={(value) => updateLeg(index, 'from', value)}
                  placeholder="From"
                />
              </div>

              <div className="relative md:col-span-3">
                <AirportInput
                  value={leg.to}
                  onChange={(value) => updateLeg(index, 'to', value)}
                  placeholder="To"
                />
              </div>

              {/* Sélecteur de date avec format personnalisé */}
              <div className="relative md:col-span-3">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10" size={18} />
                {/* Input date caché mais fonctionnel */}
                <input
                  type="date"
                  value={leg.date}
                  onChange={(e) => updateLeg(index, 'date', e.target.value)}
                  min={index > 0 ? legs[index - 1].date : getToday()}
                  className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-10 pr-4 py-[18px] focus:outline-none focus:border-[#a98c2f] text-sm transition-all absolute opacity-0 pointer-events-none"
                  style={{ fontFamily: 'Century Gothic, sans-serif' }}
                  required
                />
                {/* Div d'affichage avec le format personnalisé */}
                <div
                  className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-10 pr-4 py-[18px] text-sm cursor-pointer"
                  style={{ fontFamily: 'Century Gothic, sans-serif' }}
                  onClick={() => {
                    // Ouvre le sélecteur de date natif
                    const dateInput = document.querySelector(`input[type="date"]:nth-child(${index * 2 + 1})`) as HTMLInputElement;
                    dateInput?.showPicker();
                  }}
                >
                  {formatDate(leg.date)}
                </div>
              </div>

              <div className="relative md:col-span-2">
                <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10" size={18} />
                <input
                  type="time"
                  value={leg.time}
                  onChange={(e) => updateLeg(index, 'time', e.target.value)}
                  className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-10 pr-4 py-[18px] focus:outline-none focus:border-[#a98c2f] text-sm transition-all"
                  style={{ fontFamily: 'Century Gothic, sans-serif' }}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-[1px] md:col-span-3">
                <PassengersDropdown
                  passengers={leg.passengers}
                  onChange={(passengers) => updateLeg(index, 'passengers', passengers)}
                />
                <PetsDropdown
                  pets={leg.pets}
                  onChange={(pets) => updateLeg(index, 'pets', pets)}
                />
                <LuggageDropdown
                  luggage={leg.luggage}
                  onChange={(luggage) => updateLeg(index, 'luggage', luggage)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center gap-[1px]">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-[66%] md:w-[20%] bg-[#d3a936] text-white py-3 lg:py-4 font-medium text-base lg:text-lg hover:bg-[#a98c2f] hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'Century Gothic, sans-serif' }}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>search...</span>
            </>
          ) : (
            <span>SEARCH</span>
          )}
        </button>

        <button
          type="button"
          onClick={addLeg}
          className="bg-white/20 text-white px-4 py-4 flex items-center space-x-2 text-sm hover:bg-white/30 transition-colors"
        >
          <FiPlus size={16} />
          <span>Add Leg</span>
        </button>
      </div>
    </form>
  );
};

export default MultiLegForm;