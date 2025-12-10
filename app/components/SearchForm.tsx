"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, User, Plus, Minus } from 'lucide-react';

interface Airport {
  id: number;
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
  full_name: string;
  cntr_code: string;
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
  // Fonction pour formater la date au format "11, Oct, 2025"
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const day = date.getDate();
    const month = date.toLocaleString('en', { month: 'short' });
    const year = date.getFullYear();
    return `${day}, ${month}, ${year}`;
  };

  // Fonction pour obtenir la date du jour au format YYYY-MM-DD (pour l'input date)
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fonction pour convertir le format "11, Oct, 2025" en "2025-10-11"
  const parseFormattedDate = (formattedDate: string): string => {
    try {
      const [day, month, year] = formattedDate.split(', ');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = monthNames.findIndex(m => m === month);
      const date = new Date(parseInt(year), monthIndex, parseInt(day));
      return date.toISOString().split('T')[0];
    } catch (error) {
      return getTodayDate();
    }
  };

  // États pour les champs de recherche
  const [passengers, setPassengers] = useState(initialPassengers);
  const [searchFrom, setSearchFrom] = useState(initialFrom);
  const [searchTo, setSearchTo] = useState(initialTo);
  const [searchDate, setSearchDate] = useState(initialDate || getTodayDate());
  const [displayDate, setDisplayDate] = useState(formatDate(initialDate || getTodayDate()));

  // États pour gérer le focus (afficher le texte complet ou tronqué)
  const [isFromFocused, setIsFromFocused] = useState(false);
  const [isToFocused, setIsToFocused] = useState(false);
  const [isDateFocused, setIsDateFocused] = useState(false);

  // États pour la gestion des aéroports et suggestions
  const [airports, setAirports] = useState<Airport[]>([]);
  const [filteredFromAirports, setFilteredFromAirports] = useState<Airport[]>([]);
  const [filteredToAirports, setFilteredToAirports] = useState<Airport[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  // Refs pour les inputs
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Chargement initial de la base de données des aéroports
  useEffect(() => {
    const loadAirports = async () => {
      try {
        const response = await fetch('/airports.json');
        const data = await response.json();
        setAirports(data);
      } catch (error) {
        console.error('Erreur lors du chargement des aéroports:', error);
      }
    };

    loadAirports();
  }, []);

  // Initialisation de la date du jour si aucune date initiale n'est fournie
  useEffect(() => {
    if (!initialDate) {
      const today = getTodayDate();
      setSearchDate(today);
      setDisplayDate(formatDate(today));
    } else {
      setDisplayDate(formatDate(initialDate));
    }
  }, [initialDate]);

  // Mise à jour de la date affichée quand searchDate change
  useEffect(() => {
    setDisplayDate(formatDate(searchDate));
  }, [searchDate]);

  // Filtrage des aéroports pour le champ "From"
  useEffect(() => {
    if (searchFrom.trim()) {
      const searchTerm = searchFrom.toLowerCase();
      const filtered = airports.filter(airport =>
        (airport.iata?.toLowerCase().includes(searchTerm)) ||
        (airport.icao?.toLowerCase().includes(searchTerm)) ||
        (airport.name?.toLowerCase().includes(searchTerm)) ||
        (airport.city?.toLowerCase().includes(searchTerm)) ||
        (airport.country?.toLowerCase().includes(searchTerm)) ||
        (airport.full_name?.toLowerCase().includes(searchTerm))
      ).slice(0, 8);

      setFilteredFromAirports(filtered);
      setShowFromSuggestions(filtered.length > 0 && isFromFocused);
    } else {
      setFilteredFromAirports([]);
      setShowFromSuggestions(false);
    }
  }, [searchFrom, airports, isFromFocused]);

  // Filtrage des aéroports pour le champ "To"
  useEffect(() => {
    if (searchTo.trim()) {
      const searchTerm = searchTo.toLowerCase();
      const filtered = airports.filter(airport =>
        (airport.iata?.toLowerCase().includes(searchTerm)) ||
        (airport.icao?.toLowerCase().includes(searchTerm)) ||
        (airport.name?.toLowerCase().includes(searchTerm)) ||
        (airport.city?.toLowerCase().includes(searchTerm)) ||
        (airport.country?.toLowerCase().includes(searchTerm)) ||
        (airport.full_name?.toLowerCase().includes(searchTerm))
      ).slice(0, 8);

      setFilteredToAirports(filtered);
      setShowToSuggestions(filtered.length > 0 && isToFocused);
    } else {
      setFilteredToAirports([]);
      setShowToSuggestions(false);
    }
  }, [searchTo, airports, isToFocused]);

  // Fonction pour tronquer le texte
  const truncateText = (text: string, maxLength: number = 25): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

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
    setSearchFrom(airport.full_name);
    setShowFromSuggestions(false);
    setIsFromFocused(false);
  };

  const selectToAirport = (airport: Airport) => {
    setSearchTo(airport.full_name);
    setShowToSuggestions(false);
    setIsToFocused(false);
  };

  // Gestion du focus sur le champ "From"
  const handleFromFocus = () => {
    setIsFromFocused(true);
    if (searchFrom.trim() && filteredFromAirports.length > 0) {
      setShowFromSuggestions(true);
    }
  };

  const handleFromBlur = () => {
    setTimeout(() => {
      setIsFromFocused(false);
      setShowFromSuggestions(false);
    }, 200);
  };

  // Gestion du focus sur le champ "To"
  const handleToFocus = () => {
    setIsToFocused(true);
    if (searchTo.trim() && filteredToAirports.length > 0) {
      setShowToSuggestions(true);
    }
  };

  const handleToBlur = () => {
    setTimeout(() => {
      setIsToFocused(false);
      setShowToSuggestions(false);
    }, 200);
  };

  // Gestion du focus sur le champ date
  const handleDateFocus = () => {
    setIsDateFocused(true);
  };

  const handleDateBlur = () => {
    setTimeout(() => {
      setIsDateFocused(false);
    }, 200);
  };

  // Gestion du changement de date
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(e.target.value);
  };

  // Gestion des touches pour la navigation au clavier
  const handleKeyPress = (e: React.KeyboardEvent, type: 'from' | 'to' | 'date') => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      if (type === 'from') {
        setShowFromSuggestions(false);
        setIsFromFocused(false);
        fromInputRef.current?.blur();
      } else if (type === 'to') {
        setShowToSuggestions(false);
        setIsToFocused(false);
        toInputRef.current?.blur();
      } else {
        setIsDateFocused(false);
        dateInputRef.current?.blur();
      }
    }
  };

  return (
    <div className="shadow-lg w-full py-6 max-w-[100%] mx-auto md:w-full">
      {/* Disposition responsive pour mobile, tablette et desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-11 gap-[1px]">

        {/* Champ de recherche "From" avec autocomplétion - Prend toute la largeur sur mobile, 1/2 sur tablette */}
        <div className="relative md:col-span-1 lg:col-span-3">
          <input
            ref={fromInputRef}
            type="text"
            placeholder="From"
            value={isFromFocused ? searchFrom : truncateText(searchFrom)}
            onChange={(e) => setSearchFrom(e.target.value)}
            onFocus={handleFromFocus}
            onBlur={handleFromBlur}
            onKeyDown={(e) => handleKeyPress(e, 'from')}
            className="w-full bg-white px-4 py-4 border border-gray-300 focus:outline-none focus:border-[#d3a936] transition-colors"
            title={searchFrom}
          />
          {showFromSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
              {filteredFromAirports.map((airport, index) => (
                <div
                  key={`from-${airport.id}-${index}`}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
                  onClick={() => selectFromAirport(airport)}
                >
                  <div className="font-medium">{airport.full_name}</div>
                  <div className="text-sm text-gray-600">
                    {airport.city}, {airport.country}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Champ de recherche "To" avec autocomplétion - Prend toute la largeur sur mobile, 1/2 sur tablette */}
        <div className="relative md:col-span-1 lg:col-span-3">
          <input
            ref={toInputRef}
            type="text"
            placeholder="To"
            value={isToFocused ? searchTo : truncateText(searchTo)}
            onChange={(e) => setSearchTo(e.target.value)}
            onFocus={handleToFocus}
            onBlur={handleToBlur}
            onKeyDown={(e) => handleKeyPress(e, 'to')}
            className="w-full bg-white px-4 py-4 border border-gray-300 focus:outline-none focus:border-[#d3a936] transition-colors"
            title={searchTo}
          />
          {showToSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
              {filteredToAirports.map((airport, index) => (
                <div
                  key={`to-${airport.id}-${index}`}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
                  onClick={() => selectToAirport(airport)}
                >
                  <div className="font-medium">{airport.full_name}</div>
                  <div className="text-sm text-gray-600">
                    {airport.city}, {airport.country}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sélecteur de date - Prend toute la largeur sur mobile, 1/2 sur tablette */}
        <div className="relative md:col-span-1 lg:col-span-2">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            ref={dateInputRef}
            type="date"
            value={searchDate}
            onChange={handleDateChange}
            onFocus={handleDateFocus}
            onBlur={handleDateBlur}
            onKeyDown={(e) => handleKeyPress(e, 'date')}
            className="w-full bg-white px-4 py-4 pl-10 border border-gray-300 focus:outline-none focus:border-[#d3a936] transition-colors absolute opacity-0 pointer-events-none"
          />
          <div
            className="w-full bg-white px-4 py-4 pl-10 border border-gray-300 cursor-pointer"
            onClick={() => dateInputRef.current?.showPicker()}
          >
            {isDateFocused ? searchDate : displayDate}
          </div>
        </div>

        {/* Sélecteur du nombre de passagers - Prend toute la largeur sur mobile, 1/2 sur tablette */}
        <div className="bg-white flex items-center justify-between border border-gray-300 px-4 py-2 md:col-span-1 lg:col-span-1">
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

        {/* Bouton de recherche - Prend toute la largeur sur mobile et tablette */}
        <button
          onClick={handleSearch}
          className="bg-[#d3a936] hover:bg-[#b8922e] md:col-span-2 lg:col-span-2 text-white font-semibold py-3 px-6 transition-colors duration-200"
        >
          SEARCH
        </button>
      </div>
    </div>
  );
};

export default SearchForm;