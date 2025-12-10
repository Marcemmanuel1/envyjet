// components/AirportInput.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AirportInputProps, Airport } from '../types';
import { useAirports } from '../hooks/useAirports';

const AirportInput: React.FC<AirportInputProps> = ({
  value,
  onChange,
  placeholder,
  onAirportSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchAirports, loading } = useAirports();

  // Initialiser la valeur de recherche depuis la prop value
  useEffect(() => {
    if (value) {
      setSearchTerm(value);
    }
  }, [value]);

  // Gérer les suggestions basées sur le terme de recherche
  useEffect(() => {
    if (searchTerm.length >= 2 && !loading && isFocused) {
      const results = searchAirports(searchTerm);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, searchAirports, loading, isFocused]);

  // Fermer les suggestions lors d'un clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fonction pour tronquer le texte
  const truncateText = (text: string, maxLength: number = 25): string => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Gérer la sélection d'un aéroport
  const handleSelectAirport = (airport: Airport) => {
    const displayValue = airport.full_name;
    setSearchTerm(displayValue);
    setSelectedAirport(airport);
    setShowSuggestions(false);
    setIsFocused(false);

    onChange(displayValue);
    if (onAirportSelect) {
      onAirportSelect(airport);
    }
  };

  // Gérer le changement de l'input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsFocused(true);
  };

  // Gérer le focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Gérer le blur
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  // Gérer les touches du clavier
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsFocused(false);
      inputRef.current?.blur();
    } else if (e.key === 'Enter' && suggestions.length > 0 && showSuggestions) {
      e.preventDefault();
      handleSelectAirport(suggestions[0]);
    }
  };

  // Valeur affichée dans l'input (tronquée si non focus)
  const displayValue = isFocused ? searchTerm : truncateText(searchTerm);

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full bg-white px-4 py-4 border border-gray-300 focus:outline-none focus:border-[#d3a936] transition-colors"
        title={searchTerm}
        required
      />

      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#a98c2f]"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute z-50 w-full mb-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto bottom-full"
          style={{
            bottom: '100%',
            marginBottom: '4px'
          }}
        >
          {suggestions.map((airport) => (
            <div
              key={airport.id}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectAirport(airport);
              }}
            >
              <div className="font-medium text-gray-900">
                {airport.full_name}
              </div>
              <div className="text-sm text-gray-600 mt-0.5">
                {airport.city}, {airport.country}
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && searchTerm.length >= 2 && !loading && (
        <div
          className="absolute z-50 w-full mb-1 bg-white border border-gray-300 p-4 text-gray-500 text-sm bottom-full"
          style={{
            bottom: '100%',
            marginBottom: '4px'
          }}
        >
          Aucun aéroport trouvé pour "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default AirportInput;