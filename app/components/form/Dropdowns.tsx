'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiPlus, FiMinus } from 'react-icons/fi';
import { MdLuggage, MdPets } from 'react-icons/md';
import { PassengerData, PetData, LuggageData } from '../../types';

// Composant Counter réutilisable
export const DropdownCounter = ({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  icon
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-[#f8f8f8] transition-colors">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-[#193650] text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center space-x-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 bg-[#969696]/10 hover:bg-[#a98c2f]/20 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded"
        >
          <FiMinus size={16} className="text-[#193650]" />
        </motion.button>
        <span className="text-[#193650] font-medium w-8 text-center">{value}</span>
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 bg-[#969696]/10 hover:bg-[#a98c2f]/20 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded"
        >
          <FiPlus size={16} className="text-[#193650]" />
        </motion.button>
      </div>
    </div>
  );
};

// Dropdown Passagers
export const PassengersDropdown = ({
  passengers,
  onChange
}: {
  passengers: PassengerData;
  onChange: (passengers: PassengerData) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalPassengers =
    (passengers.adults || 0) +
    (passengers.children || 0) +
    (passengers.infants || 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-[#969696]/30 text-[#193650] px-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] flex items-center justify-center gap-2 transition-all"
      >
        <FiUsers className="text-[#a98c2f]" size={24} />
        {totalPassengers > 0 && (
          <span className="text-sm font-semibold text-[#193650]">
            {totalPassengers}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute bottom-full mt-2 
              bg-white border border-[#969696]/20 shadow-2xl z-[1000] overflow-hidden min-w-[250px]
              left-0 sm:right-0 sm:left-auto
            `}
          >
            <div className="py-2">
              <DropdownCounter
                label="Adults"
                value={passengers.adults}
                onChange={(val) => onChange({ ...passengers, adults: val })}
              />
              <DropdownCounter
                label="Children"
                value={passengers.children}
                onChange={(val) => onChange({ ...passengers, children: val })}
              />
              <DropdownCounter
                label="Infants"
                value={passengers.infants}
                onChange={(val) => onChange({ ...passengers, infants: val })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Dropdown Animaux
export const PetsDropdown = ({
  pets,
  onChange
}: {
  pets: PetData;
  onChange: (pets: PetData) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalPets = (pets.small || 0) + (pets.large || 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-[#969696]/30 text-[#193650] px-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] flex items-center justify-center gap-2 transition-all"
      >
        <MdPets className="text-[#a98c2f]" size={24} />
        {totalPets > 0 && (
          <span className="text-sm font-semibold text-[#193650]">
            {totalPets}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mt-2 bg-white border border-[#969696]/20 shadow-2xl z-[1000] overflow-hidden min-w-[250px]"
          >
            <div className="py-2">
              <DropdownCounter
                label="Small"
                value={pets.small}
                onChange={(val) => onChange({ ...pets, small: val })}
              />
              <DropdownCounter
                label="Large"
                value={pets.large}
                onChange={(val) => onChange({ ...pets, large: val })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Dropdown Bagages
export const LuggageDropdown = ({
  luggage,
  onChange
}: {
  luggage: LuggageData;
  onChange: (luggage: LuggageData) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalLuggage =
    (luggage.carryOn || 0) +
    (luggage.holdLuggage || 0) +
    (luggage.skis || 0) +
    (luggage.golfBag || 0) +
    (luggage.others || 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-[#969696]/30 text-[#193650] px-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] flex items-center justify-center gap-2 transition-all"
      >
        <MdLuggage className="text-[#a98c2f]" size={24} />
        {totalLuggage > 0 && (
          <span className="text-sm font-semibold text-[#193650]">
            {totalLuggage}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mt-2 bg-white border border-[#969696]/20 shadow-2xl z-[1000] overflow-hidden min-w-[250px]"
          >
            <div className="py-2 max-h-80 overflow-y-auto custom-scrollbar">
              <DropdownCounter
                label="Carry On"
                value={luggage.carryOn}
                onChange={(val) => onChange({ ...luggage, carryOn: val })}
              />
              <DropdownCounter
                label="Hold Luggage"
                value={luggage.holdLuggage}
                onChange={(val) => onChange({ ...luggage, holdLuggage: val })}
              />
              <DropdownCounter
                label="Skis"
                value={luggage.skis}
                onChange={(val) => onChange({ ...luggage, skis: val })}
              />
              <DropdownCounter
                label="Golf Bag"
                value={luggage.golfBag}
                onChange={(val) => onChange({ ...luggage, golfBag: val })}
              />
              <DropdownCounter
                label="Others"
                value={luggage.others}
                onChange={(val) => onChange({ ...luggage, others: val })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};