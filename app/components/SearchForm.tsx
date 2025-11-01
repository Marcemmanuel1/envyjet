"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, User, Plus, Minus } from 'lucide-react';

interface Airport {
  iata_code: string;
  icao_code: string;
  name: string;
  municipality: string;
  country_name: string;
  iso_country: string;
}

interface SearchFormProps {
  onSearch: (filters: {
    from: string;
    to: string;
    date: string;
    passengers: number;
  }) => void;
  initialFrom?: string;
  initialTo?: string;
  initialDate?: string;
  initialPassengers?: number;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  initialFrom = '',
  initialTo = '',
  initialDate = '',
  initialPassengers = 1
}) => {
  // États pour les champs de recherche
  const [passengers, setPassengers] = useState(initialPassengers);
  const [searchFrom, setSearchFrom] = useState(initialFrom);
  const [searchTo, setSearchTo] = useState(initialTo);
  const [searchDate, setSearchDate] = useState(initialDate);

  // États pour la gestion des aéroports et suggestions
  const [airports, setAirports] = useState<Airport[]>([]);
  const [filteredFromAirports, setFilteredFromAirports] = useState<Airport[]>([]);
  const [filteredToAirports, setFilteredToAirports] = useState<Airport[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  // Chargement initial de la base de données des aéroports
  useEffect(() => {
    const loadAirports = async () => {
      try {
        const response = await fetch('/world-airports.json');
        const data = await response.json();
        setAirports(data);
      } catch (error) {
        console.error('Erreur lors du chargement des aéroports:', error);
      }
    };

    loadAirports();
  }, []);

  // Filtrage des aéroports pour le champ "From"
  useEffect(() => {
    if (searchFrom.trim()) {
      const searchTerm = searchFrom.toLowerCase();
      const filtered = airports.filter(airport =>
        (airport.iata_code?.toLowerCase().includes(searchTerm)) ||
        (airport.icao_code?.toLowerCase().includes(searchTerm)) ||
        (airport.name?.toLowerCase().includes(searchTerm)) ||
        (airport.municipality?.toLowerCase().includes(searchTerm))
      ).slice(0, 8);

      setFilteredFromAirports(filtered);
      setShowFromSuggestions(filtered.length > 0);
    } else {
      setFilteredFromAirports([]);
      setShowFromSuggestions(false);
    }
  }, [searchFrom, airports]);

  // Filtrage des aéroports pour le champ "To"
  useEffect(() => {
    if (searchTo.trim()) {
      const searchTerm = searchTo.toLowerCase();
      const filtered = airports.filter(airport =>
        (airport.iata_code?.toLowerCase().includes(searchTerm)) ||
        (airport.icao_code?.toLowerCase().includes(searchTerm)) ||
        (airport.name?.toLowerCase().includes(searchTerm)) ||
        (airport.municipality?.toLowerCase().includes(searchTerm))
      ).slice(0, 8);

      setFilteredToAirports(filtered);
      setShowToSuggestions(filtered.length > 0);
    } else {
      setFilteredToAirports([]);
      setShowToSuggestions(false);
    }
  }, [searchTo, airports]);

  // Gestion de la soumission du formulaire
  const handleSearch = () => {
    onSearch({
      from: searchFrom.trim(),
      to: searchTo.trim(),
      date: searchDate,
      passengers: passengers
    });
  };

  // Sélection d'un aéroport depuis les suggestions
  const selectFromAirport = (airport: Airport) => {
    const code = airport.iata_code || airport.icao_code;
    setSearchFrom(`${airport.municipality}, ${airport.name} (${code})`);
    setShowFromSuggestions(false);
  };

  const selectToAirport = (airport: Airport) => {
    const code = airport.iata_code || airport.icao_code;
    setSearchTo(`${airport.municipality}, ${airport.name} (${code})`);
    setShowToSuggestions(false);
  };

  // Gestion des touches pour la navigation au clavier
  const handleKeyPress = (e: React.KeyboardEvent, type: 'from' | 'to') => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      type === 'from' ? setShowFromSuggestions(false) : setShowToSuggestions(false);
    }
  };

  return (
    <div className="shadow-lg md:p-6 py-6 max-w-6xl md:mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-[1px]">

        {/* Champ de recherche "From" avec autocomplétion */}
        <div className="relative">
          <input
            type="text"
            placeholder="From"
            value={searchFrom}
            onChange={(e) => setSearchFrom(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, 'from')}
            className="w-full bg-white px-4 py-5 border border-gray-300 focus:outline-none focus:border-[#d3a936] transition-colors"
          />
          {showFromSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
              {filteredFromAirports.map((airport, index) => {
                const code = airport.iata_code || airport.icao_code;
                return (
                  <div
                    key={`from-${code}-${index}`}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
                    onClick={() => selectFromAirport(airport)}
                  >
                    <div className="font-medium">{airport.municipality} ({code})</div>
                    <div className="text-sm text-gray-600">{airport.name}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Champ de recherche "To" avec autocomplétion */}
        <div className="relative">
          <input
            type="text"
            placeholder="To"
            value={searchTo}
            onChange={(e) => setSearchTo(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, 'to')}
            className="w-full bg-white px-4 py-5 border border-gray-300 focus:outline-none focus:border-[#d3a936] transition-colors"
          />
          {showToSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
              {filteredToAirports.map((airport, index) => {
                const code = airport.iata_code || airport.icao_code;
                return (
                  <div
                    key={`to-${code}-${index}`}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
                    onClick={() => selectToAirport(airport)}
                  >
                    <div className="font-medium">{airport.municipality} ({code})</div>
                    <div className="text-sm text-gray-600">{airport.name}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sélecteur de date */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-white px-4 py-5 pl-10 border border-gray-300 focus:outline-none focus:border-[#d3a936] transition-colors"
          />
        </div>

        {/* Sélecteur du nombre de passagers */}
        <div className="bg-white flex items-center justify-between border border-gray-300 px-4 py-3">
          <User className="text-gray-400 w-5 h-5" />
          <span className="flex-1 text-center font-semibold">{passengers}</span>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setPassengers(p => Math.min(p + 1, 20))}
              className="text-gray-600 hover:text-[#d3a936] transition-colors"
              aria-label="Augmenter le nombre de passagers"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPassengers(p => Math.max(p - 1, 1))}
              className="text-gray-600 hover:text-[#d3a936] transition-colors"
              aria-label="Diminuer le nombre de passagers"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bouton de recherche */}
        <button
          onClick={handleSearch}
          className="bg-[#d3a936] hover:bg-[#b8922e] text-white font-semibold py-3 px-6 transition-colors duration-200"
        >
          SEARCH
        </button>
      </div>
    </div>
  );
};

export default SearchForm;