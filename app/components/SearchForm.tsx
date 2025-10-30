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
  const [passengers, setPassengers] = useState(initialPassengers);
  const [searchFrom, setSearchFrom] = useState(initialFrom);
  const [searchTo, setSearchTo] = useState(initialTo);
  const [searchDate, setSearchDate] = useState(initialDate);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [filteredFromAirports, setFilteredFromAirports] = useState<Airport[]>([]);
  const [filteredToAirports, setFilteredToAirports] = useState<Airport[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  // Charger les aéroports depuis le fichier JSON
  useEffect(() => {
    const loadAirports = async () => {
      try {
        const response = await fetch('/world-airports.json');
        const data = await response.json();
        setAirports(data);
      } catch (error) {
        console.error('Error loading airports:', error);
      }
    };

    loadAirports();
  }, []);

  // Filtrer les aéroports pour la recherche "From"
  useEffect(() => {
    if (searchFrom) {
      const filtered = airports.filter(airport =>
        (airport?.iata_code && airport.iata_code.toLowerCase().includes(searchFrom.toLowerCase())) ||
        (airport?.icao_code && airport.icao_code.toLowerCase().includes(searchFrom.toLowerCase())) ||
        (airport?.name && airport.name.toLowerCase().includes(searchFrom.toLowerCase())) ||
        (airport?.municipality && airport.municipality.toLowerCase().includes(searchFrom.toLowerCase()))
      ).slice(0, 8);
      setFilteredFromAirports(filtered);
      setShowFromSuggestions(true);
    } else {
      setFilteredFromAirports([]);
      setShowFromSuggestions(false);
    }
  }, [searchFrom, airports]);

  // Filtrer les aéroports pour la recherche "To"
  useEffect(() => {
    if (searchTo) {
      const filtered = airports.filter(airport =>
        (airport?.iata_code && airport.iata_code.toLowerCase().includes(searchTo.toLowerCase())) ||
        (airport?.icao_code && airport.icao_code.toLowerCase().includes(searchTo.toLowerCase())) ||
        (airport?.name && airport.name.toLowerCase().includes(searchTo.toLowerCase())) ||
        (airport?.municipality && airport.municipality.toLowerCase().includes(searchTo.toLowerCase()))
      ).slice(0, 8);
      setFilteredToAirports(filtered);
      setShowToSuggestions(true);
    } else {
      setFilteredToAirports([]);
      setShowToSuggestions(false);
    }
  }, [searchTo, airports]);

  // Fonction de recherche
  const handleSearch = () => {
    onSearch({
      from: searchFrom,
      to: searchTo,
      date: searchDate,
      passengers: passengers
    });
  };

  // Sélectionner un aéroport depuis les suggestions
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

  return (
    <div className="shadow-lg md:p-6 py-6 max-w-6xl md:mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-[1px]">
        {/* From Input with Suggestions */}
        <div className="relative">
          <input
            type="text"
            placeholder="From"
            value={searchFrom}
            onChange={(e) => setSearchFrom(e.target.value)}
            className="w-full bg-white px-4 py-5 border border-gray-300 focus:outline-none focus:border-[#d3a936]"
          />
          {showFromSuggestions && filteredFromAirports.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
              {filteredFromAirports.map((airport, index) => {
                const code = airport.iata_code || airport.icao_code;
                return (
                  <div
                    key={`from-${code}-${index}`}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
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

        {/* To Input with Suggestions */}
        <div className="relative">
          <input
            type="text"
            placeholder="To"
            value={searchTo}
            onChange={(e) => setSearchTo(e.target.value)}
            className="w-full bg-white px-4 py-5 border border-gray-300 focus:outline-none focus:border-[#d3a936]"
          />
          {showToSuggestions && filteredToAirports.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
              {filteredToAirports.map((airport, index) => {
                const code = airport.iata_code || airport.icao_code;
                return (
                  <div
                    key={`to-${code}-${index}`}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
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

        {/* Date Input */}
        <div className="relative">
          <Calendar className="absolute left-3 top-5.5 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="w-full bg-white px-4 py-5 pl-10 border border-gray-300 focus:outline-none focus:border-[#d3a936]"
          />
        </div>

        {/* Passengers */}
        <div className="bg-white flex items-center justify-between border border-gray-300 px-4 py-3">
          <User className="text-gray-400 w-5 h-5" />
          <span className="flex-1 text-center font-semibold">{passengers}</span>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setPassengers(p => Math.min(p + 1, 20))}
              className="text-gray-600 hover:text-[#d3a936] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPassengers(p => Math.max(p - 1, 1))}
              className="text-gray-600 hover:text-[#d3a936] transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Button */}
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