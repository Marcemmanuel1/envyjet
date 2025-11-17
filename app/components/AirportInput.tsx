// components/AirportInput.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AirportInputProps, Airport } from '../types';
import { useAirports } from '../hooks/useAirports';

const AirportInput: React.FC<AirportInputProps> = ({
  value,
  onChange,
  placeholder,
  onAirportSelect
}) => {
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const { searchAirports, loading, error } = useAirports();

  // Vérifier si le texte déborde
  useEffect(() => {
    const checkTextOverflow = () => {
      if (textRef.current && inputRef.current) {
        const textElement = textRef.current;
        const inputElement = inputRef.current;

        // Vérifier si le texte dépasse la largeur de l'input
        const isOverflowing = textElement.scrollWidth > inputElement.clientWidth;
        setIsTruncated(isOverflowing);
      }
    };

    // Vérifier après le rendu et lors du redimensionnement
    checkTextOverflow();
    window.addEventListener('resize', checkTextOverflow);

    return () => {
      window.removeEventListener('resize', checkTextOverflow);
    };
  }, [value]);

  useEffect(() => {
    if (value.length >= 2 && !loading && isFocused) {
      const results = searchAirports(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, searchAirports, loading, isFocused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAirport = (airport: Airport) => {
    const displayValue = airport.iata_code
      ? `${airport.iata_code} - ${airport.name}, ${airport.municipality}`
      : `${airport.icao_code} - ${airport.name}, ${airport.municipality}`;

    onChange(displayValue);
    setShowSuggestions(false);
    setIsFocused(false);
    setIsExpanded(false);

    if (onAirportSelect) {
      onAirportSelect(airport);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsFocused(true);
    setIsExpanded(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsExpanded(true); // Afficher le texte complet lors du focus

    if (value.length >= 2 && !loading) {
      const results = searchAirports(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }
  };

  const handleBlur = () => {
    // On retarde le blur pour permettre la sélection dans les suggestions
    setTimeout(() => {
      setIsExpanded(false);
    }, 200);
  };

  const handleInputClick = () => {
    if (isTruncated && !isExpanded) {
      setIsExpanded(true);
      setIsFocused(true);
    }
  };

  // Fonction pour tronquer le texte avec "..."
  const getTruncatedText = (text: string) => {
    if (!inputRef.current || !textRef.current) return text;

    const inputWidth = inputRef.current.clientWidth - 32; // - padding
    const textElement = textRef.current;

    // Créer un span invisible pour mesurer le texte
    const measureElement = document.createElement('span');
    measureElement.style.visibility = 'hidden';
    measureElement.style.position = 'absolute';
    measureElement.style.whiteSpace = 'nowrap';
    measureElement.style.font = window.getComputedStyle(textElement).font;
    measureElement.textContent = text;
    document.body.appendChild(measureElement);

    let truncatedText = text;
    const ellipsis = '...';

    // Si le texte est trop long, on le tronque
    if (measureElement.scrollWidth > inputWidth) {
      let min = 0;
      let max = text.length;
      let middle;

      // Recherche binaire pour trouver la longueur optimale
      while (min <= max) {
        middle = Math.floor((min + max) / 2);
        measureElement.textContent = text.substring(0, middle) + ellipsis;

        if (measureElement.scrollWidth <= inputWidth) {
          min = middle + 1;
        } else {
          max = middle - 1;
        }
      }

      truncatedText = text.substring(0, max) + ellipsis;
    }

    document.body.removeChild(measureElement);
    return truncatedText;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isExpanded ? value : (isTruncated ? getTruncatedText(value) : value)}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleInputClick}
          placeholder={placeholder}
          className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-4 pr-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] placeholder-[#969696] text-sm lg:text-base transition-all truncate"
          style={{ fontFamily: 'Century Gothic, sans-serif' }}
          required
        />

        {/* Élément invisible pour mesurer la largeur réelle du texte */}
        <span
          ref={textRef}
          className="absolute opacity-0 pointer-events-none whitespace-nowrap text-sm lg:text-base"
          style={{ fontFamily: 'Century Gothic, sans-serif' }}
        >
          {value}
        </span>

        {isTruncated && !isExpanded && (
          <div
            className="absolute inset-0 cursor-pointer bg-transparent"
            onClick={handleInputClick}
            title="Cliquer pour voir le texte complet"
          />
        )}
      </div>

      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#a98c2f]"></div>
        </div>
      )}

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-0 right-0 bg-white border border-[#969696]/20 shadow-2xl max-h-60 overflow-y-auto mt-1 custom-scrollbar z-50"
          >
            {suggestions.map((airport, index) => (
              <motion.div
                key={`${airport.id}-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="px-4 py-3 hover:bg-[#f8f8f8] cursor-pointer border-b border-[#969696]/10 last:border-b-0 transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectAirport(airport);
                }}
              >
                <div className="font-medium text-[#193650] text-sm">
                  {airport.iata_code ? (
                    <span className="text-[#a98c2f] font-bold">{airport.iata_code}</span>
                  ) : (
                    <span className="text-[#a98c2f] font-bold">{airport.icao_code}</span>
                  )}
                  {' '}- {airport.name}
                </div>
                <div className="text-[#969696] text-xs mt-0.5">
                  {airport.municipality}, {airport.country_name}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="absolute top-full left-0 right-0 bg-red-50 border border-red-200 p-2 text-red-600 text-xs mt-1 z-[10000]">
          {error}
        </div>
      )}
    </div>
  );
};

export default AirportInput;