'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiChevronRight,
  FiArrowRight,
  FiPlus,
  FiMinus,
  FiClock,
  FiShield,
  FiLock,
  FiStar,
  FiPhone,
  FiSend,
  FiCheckCircle,
  FiChevronDown,
  FiChevronLeft,
  FiChevronUp,
  FiHeart,
  FiTrendingUp,
  FiUserCheck
} from 'react-icons/fi';
import { BiBriefcase } from 'react-icons/bi';
import { MdLuggage, MdPets } from 'react-icons/md';
import { useRouter } from 'next/navigation';
// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

// Import components
import Footer from './components/Footer';
import Navbar from './components/Navbar';

// =============================================================================
// TYPES ET INTERFACES
// =============================================================================

/**
 * Interface représentant un aéroport avec toutes ses propriétés
 * Les données sont chargées depuis le fichier JSON world-airports.json
 */
interface Airport {
  id: number;
  ident: string;
  type: string;
  name: string;
  latitude_deg: number;
  longitude_deg: number;
  elevation_ft: number | null;
  continent: string | null;
  country_name: string;
  iso_country: string;
  region_name: string;
  iso_region: string;
  local_region: string;
  municipality: string;
  scheduled_service: number;
  gps_code: string;
  icao_code: string;
  iata_code: string | null;
  local_code: string | null;
  home_link: string | null;
  wikipedia_link: string | null;
  keywords: string | null;
  score: number;
  last_updated: string;
}

/**
 * Configuration pour les animaux de compagnie
 * Séparés en petite et grande taille pour les contraintes de cabine
 */
interface PetData {
  small: number;  // Animaux de petite taille (en cabine)
  large: number;  // Animaux de grande taille (en soute)
}

/**
 * Configuration détaillée des bagages
 * Chaque type de bagage a des contraintes spécifiques en termes de taille et poids
 */
interface LuggageData {
  carryOn: number;      // Bagage cabine
  holdLuggage: number;  // Bagage en soute
  skis: number;         // Équipement de ski
  golfBag: number;      // Sac de golf
  others: number;       // Autres équipements spéciaux
}

/**
 * Répartition des passagers par catégorie d'âge
 * Les infants sont généralement assis sur les genoux d'un adulte
 */
interface PassengerData {
  adults: number;    // Passagers adultes (12+ ans)
  children: number;  // Enfants (2-11 ans)
  infants: number;   // Nourrissons (0-2 ans)
}

/**
 * Structure des données pour un vol simple (One Way)
 * Contient tous les détails nécessaires à la réservation
 */
interface OneWayFormData {
  from: string;           // Aéroport de départ formaté
  to: string;             // Aéroport d'arrivée formaté
  departureDate: string;  // Date de départ au format YYYY-MM-DD
  departureTime: string;  // Heure de départ au format HH:MM
  passengers: PassengerData;
  pets: PetData;
  luggage: LuggageData;
}

/**
 * Structure des données pour un vol aller-retour (Round Trip)
 * Séparé en vol aller (outbound) et vol retour (return)
 */
interface RoundTripFormData {
  outbound: {
    from: string;
    to: string;
    date: string;
    time: string;
    passengers: PassengerData;
    pets: PetData;
    luggage: LuggageData;
  };
  return: {
    from: string;
    to: string;
    date: string;
    time: string;
    passengers: PassengerData;
    pets: PetData;
    luggage: LuggageData;
  };
}

/**
 * Structure pour une étape de vol dans un trajet multi-étapes
 * Chaque leg représente un segment de vol distinct
 */
interface FlightLeg {
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: PassengerData;
  pets: PetData;
  luggage: LuggageData;
}

/**
 * Structure pour un trajet multi-étapes (Multi-Leg)
 * Permet de créer des itinéraires complexes avec plusieurs escales
 */
interface MultiLegFormData {
  legs: FlightLeg[];
}

/**
 * Props de base pour tous les composants de formulaire
 */
interface FormProps {
  onSubmit: (data: any) => Promise<void>;
}

/**
 * Props pour les éléments de FAQ
 */
interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

// =============================================================================
// CONSTANTS ET CONFIGURATIONS
// =============================================================================

/**
 * Types de formulaires disponibles avec leurs libellés
 * ONE WAY : Vol simple
 * ROUND TRIP : Aller-retour
 * MULTI-LEG : Multi-étapes
 */
const FORM_TABS = [
  { id: 'oneWay', label: 'ONE WAY' },
  { id: 'roundTrip', label: 'ROUND TRIP' },
  { id: 'multiLeg', label: 'MULTI-LEG' }
] as const;

/**
 * Catalogue des services proposés par EnvyJet
 * Chaque service a une image, un titre et une description
 */
const SERVICES_DATA = [
  {
    title: "Exclusive private jet charter",
    description: "From your starting point to your final destination, relax with complete peace of mind.",
    image: "/images/service-private-jet.jpg",
    fileUrl: "/jet-charter"
  },
  {
    title: "Shared Flights",
    description: "Discover the exclusive EnvyJet experience with our shared jet flights.",
    image: "/images/service-shared-flights.jpg",
    fileUrl: "/shared-charter"

  },
  {
    title: "Empty Legs",
    description: "EnvyJet offers you a unique opportunity to save money.",
    image: "/images/service-empty-legs.jpg",
    fileUrl: "/empty-charter"
  }
] as const;

/**
 * Questions fréquemment posées (FAQ)
 * Structure question/réponse pour aider les utilisateurs
 */
const FAQ_DATA = [
  {
    question: "How far in advance should I book a charter to guarantee availability?",
    answer: "The recommended time frame for booking a charter flight may vary depending on several factors, including season, destination and aircraft availability. However, to ensure availability and have the most choice in terms of aircraft and routes, we generally recommend booking your charter flight at least a few weeks in advance, especially during peak periods such as holidays. or special events. We understand that sometimes trips can be planned at the last minute. In these cases, we will do our best to accommodate your needs and find available options. Our team is here to help you every step of the way and answer any questions you may have about planning your charter."
  },
  {
    question: "Can you arrange flights to remote or less accessible locations?",
    answer: "Yes, as a private jet charter specialist we have the ability to arrange flights to a wide variety of destinations, including remote or less accessible locations. Thanks to our extensive network of partners and our logistics expertise, we are able to meet your travel needs, regardless of the destination."
  },
  {
    question: "How do you guarantee the privacy and confidentiality of your customers?",
    answer: "The privacy and confidentiality of our customers are of the utmost importance to us. We implement strict measures to ensure that all our customers' personal information and travel details remain confidential and secure. Our teams are trained to handle all information with the utmost professionalism and discretion, and we are committed to upholding the highest standards of privacy protection."
  },
  {
    question: "Is customer support available 24/7?",
    answer: "Absolutely, our customer support team is available 24/7 to answer all your questions and assist you in planning your trips. Whether it's a reservation request, last minute changes or any other assistance needed, our team is here to provide you with exceptional service anytime, anywhere."
  }
] as const;

/**
 * Avantages principaux de EnvyJet présentés dans le carousel
 * Chaque avantage a une icône, un titre et une description détaillée
 */
const ADVANTAGES_DATA = [
  {
    title: "Speed",
    description: "Our private jet booking system is exceptionally fast, offering a major competitive advantage. Thanks to an intuitive user interface and cutting-edge technology, our customers can finalise their bookings in just a few clicks, dramatically reducing the time needed to plan their trips. Whether it's a last-minute business trip or a luxury getaway, our platform guarantees instant response and fast confirmations, allowing travellers to focus on what's important without worrying about the logistical details. This unrivalled efficiency makes our service the preferred choice for those seeking convenience and speed in their private air travel.",
    icon: <FiClock className="text-[#a98c2f]" size={300} />
  },
  {
    title: "Competitiveness",
    description: "Our company stands out for its exceptional competitiveness in the field of private jet charter, thanks to a combination of cutting-edge technology, a highly qualified team and constant attention to our customers' needs. We offer tailor-made air travel solutions, combining efficiency and luxury, while maintaining competitive rates. This approach enables us to remain at the forefront of our industry and provide unrivalled value to our partners and customers. By choosing our services, you are opting for excellence and sustainable performance.",
    icon: <FiTrendingUp className="text-[#a98c2f]" size={300} />
  },
  {
    title: "Security",
    description: "Safety is our top priority when it comes to chartering private jets. We are committed to the highest safety standards, working with highly qualified pilots and certified operators. Our aircraft undergo rigorous and regular inspections to ensure maximum safety on every flight. What's more, we use state-of-the-art technology to monitor and maintain safety throughout your journey. By choosing our services, you can travel with complete peace of mind, knowing that every safety measure is in place to protect your well-being.",
    icon: <FiShield className="text-[#a98c2f]" size={300} />
  },
  {
    title: "Confidentiality",
    description: "The confidentiality of our customers is our absolute priority. We are committed to protecting all personal and business information with the utmost care. Our rigorous security protocols and advanced technologies ensure that your data remains totally secure. Every transaction and interaction is handled with the utmost discretion, ensuring total peace of mind. By choosing our private jet charter services, you can be confident that your privacy is respected at every stage of your travel experience.",
    icon: <FiUserCheck className="text-[#a98c2f]" size={300} />
  }
] as const;

// =============================================================================
// HOOK PERSONNALISÉ POUR LA GESTION DES AÉROPORTS
// =============================================================================

/**
 * Hook personnalisé pour la gestion des données aéroports
 * Charge les données depuis le JSON et fournit des fonctions de recherche
 */
const useAirports = () => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAirports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/world-airports.json');
        if (!response.ok) {
          throw new Error('Failed to load airports data');
        }
        const data = await response.json();
        setAirports(data);
      } catch (err) {
        console.error('Error loading airports:', err);
        setError('Could not load airports data');
      } finally {
        setLoading(false);
      }
    };

    loadAirports();
  }, []);

  /**
   * Recherche d'aéroports basée sur une requête texte
   * Cherche dans les codes IATA/ICAO, noms, villes et pays
   * @param query - Terme de recherche (minimum 2 caractères)
   * @returns Liste des aéroports correspondants triés par pertinence
   */
  const searchAirports = useCallback((query: string): Airport[] => {
    if (!query || query.length < 2) return [];

    const lowercaseQuery = query.toLowerCase().trim();

    return airports
      .filter(airport => {
        const iataCode = (airport.iata_code || '').toLowerCase();
        const icaoCode = (airport.icao_code || '').toLowerCase();
        const name = (airport.name || '').toLowerCase();
        const municipality = (airport.municipality || '').toLowerCase();
        const countryName = (airport.country_name || '').toLowerCase();
        const keywords = (airport.keywords || '').toLowerCase();

        return (
          iataCode.includes(lowercaseQuery) ||
          icaoCode.includes(lowercaseQuery) ||
          name.includes(lowercaseQuery) ||
          municipality.includes(lowercaseQuery) ||
          countryName.includes(lowercaseQuery) ||
          keywords.includes(lowercaseQuery)
        );
      })
      .sort((a, b) => {
        // Priorité aux aéroports avec code IATA
        if (a.iata_code && !b.iata_code) return -1;
        if (!a.iata_code && b.iata_code) return 1;

        // Priorité aux correspondances exactes de code IATA
        const aIataMatch = a.iata_code?.toLowerCase() === lowercaseQuery;
        const bIataMatch = b.iata_code?.toLowerCase() === lowercaseQuery;
        if (aIataMatch && !bIataMatch) return -1;
        if (!aIataMatch && bIataMatch) return 1;

        // Tri final par score de pertinence
        return b.score - a.score;
      })
      .slice(0, 10); // Limite à 10 résultats pour les performances
  }, [airports]);

  return { airports, loading, error, searchAirports };
};

// =============================================================================
// COMPOSANT CHAMP AÉROPORT AVEC AUTO-COMPLÉTION
// =============================================================================

/**
 * Composant de champ de saisie d'aéroport avec suggestions automatiques
 * Utilise le hook useAirports pour la recherche en temps réel
 */
interface AirportInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onAirportSelect?: (airport: Airport) => void;
}

const AirportInput: React.FC<AirportInputProps> = ({
  value,
  onChange,
  placeholder,
  onAirportSelect
}) => {
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { searchAirports, loading, error } = useAirports();

  // Gestion de l'affichage des suggestions basée sur la saisie
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

  // Fermeture des suggestions au clic extérieur
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

  /**
   * Gestion de la sélection d'un aéroport dans les suggestions
   * Formate la valeur d'affichage et notifie le parent
   */
  const handleSelectAirport = (airport: Airport) => {
    const displayValue = airport.iata_code
      ? `${airport.iata_code} - ${airport.name}, ${airport.municipality}`
      : `${airport.icao_code} - ${airport.name}, ${airport.municipality}`;

    onChange(displayValue);
    setShowSuggestions(false);
    setIsFocused(false);

    if (onAirportSelect) {
      onAirportSelect(airport);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsFocused(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (value.length >= 2 && !loading) {
      const results = searchAirports(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-4 pr-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] placeholder-[#969696] text-sm lg:text-base transition-all"
        style={{ fontFamily: 'Century Gothic, sans-serif' }}
        required
      />

      {/* Indicateur de chargement pendant la recherche */}
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#a98c2f]"></div>
        </div>
      )}

      {/* Liste des suggestions avec animation */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-white border border-[#969696]/20 shadow-2xl z-[1001] max-h-60 overflow-y-auto mt-1 custom-scrollbar"
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

      {/* Affichage des erreurs de chargement */}
      {error && (
        <div className="absolute top-full left-0 right-0 bg-red-50 border border-red-200 p-2 text-red-600 text-xs mt-1 z-[1000]">
          {error}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// UTILITAIRES DE DATE ET FONCTIONS HELPER
// =============================================================================

/**
 * Formate une date au format YYYY-MM-DD pour les inputs date
 * @param date - Date à formater
 * @returns Date formatée en string
 */
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Retourne la date du jour au format YYYY-MM-DD
 * Utilisé pour restreindre la sélection de dates passées
 */
const getToday = (): string => {
  return formatDate(new Date());
};

// =============================================================================
// HOOKS PERSONNALISÉS RÉUTILISABLES
// =============================================================================

/**
 * Hook pour la soumission de formulaires avec gestion d'état de chargement
 * Centralise la logique d'envoi des données et la gestion des erreurs
 */
const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = useCallback(async (url: string, data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, ...result };
    } catch (error) {
      console.error('Form submission error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submitForm, isSubmitting };
};

/**
 * Hook pour détecter si le code s'exécute côté client
 * Important pour éviter les erreurs d'hydratation avec Next.js
 */
const useClientCheck = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

// =============================================================================
// COMPOSANTS D'INTERFACE RÉUTILISABLES
// =============================================================================

/**
 * Composant de compteur avec boutons +/- pour la sélection numérique
 * Utilisé pour les passagers, animaux et bagages
 */
const DropdownCounter = ({
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

/**
 * Menu déroulant pour la sélection des passagers
 * Gère les adultes, enfants et nourrissons avec validation
 */
const PassengersDropdown = ({
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

  // Fermeture du dropdown au clic extérieur
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
              absolute top-full mt-2 
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

/**
 * Menu déroulant pour la sélection des animaux de compagnie
 * Distingue les petites et grandes races pour les contraintes aériennes
 */
const PetsDropdown = ({
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
            className="absolute top-full right-0 mt-2 bg-white border border-[#969696]/20 shadow-2xl z-[1000] overflow-hidden min-w-[250px]"
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

/**
 * Menu déroulant pour la sélection détaillée des bagages
 * Gère différents types de bagages avec leurs contraintes spécifiques
 */
const LuggageDropdown = ({
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
            className="absolute top-full right-0 mt-2 bg-white border border-[#969696]/20 shadow-2xl z-[1000] overflow-hidden min-w-[250px]"
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

// =============================================================================
// COMPOSANTS DE PRÉSENTATION RÉUTILISABLES
// =============================================================================

/**
 * Composant de fond vidéo pour la section hero
 * Gère le fallback en cas d'erreur de chargement vidéo
 */
const VideoBackground = () => {
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = useCallback(() => {
    setVideoError(true);
  }, []);

  if (videoError) {
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#193650]/80 via-[#193650]/60 to-[#193650]/80" />
      </div>
    );
  }

  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{
          filter: "brightness(0.7) contrast(1.1) saturate(1.1)",
        }}
        onError={handleVideoError}
      >
        <source src="/images/video-envyjet.MP4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-[#193650]/80 via-[#193650]/60 to-[#193650]/80" />
    </>
  );
};

/**
 * Composant image sécurisé avec gestion des erreurs et état de chargement
 * Affiche un fallback si l'image principale ne charge pas
 */
const SafeImage = ({
  src,
  alt,
  fallback = "/images/placeholder.jpg",
  className = "",
  ...props
}: {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  [key: string]: any;
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useCallback(() => {
    setImgSrc(fallback);
    setIsLoading(false);
  }, [fallback]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
};

/**
 * Composant d'élément FAQ avec animation d'ouverture/fermeture
 * Gère l'état d'ouverture localement pour de meilleures performances
 */
const FAQItem: React.FC<FAQItemProps> = React.memo(({ question, answer, isOpen, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white overflow-hidden border border-[#969696]/20"
    >
      <button
        onClick={onClick}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#f8f8f8] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#a98c2f] focus:ring-opacity-50"
        aria-expanded={isOpen}
      >
        <h3 className={`text-lg pr-4 transition-all duration-300 ${isOpen ? 'font-bold text-[#193650]' : 'font-medium text-[#193650]'}`} style={{ fontFamily: 'Century Gothic, sans-serif' }}>
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <FiChevronDown className="text-[#a98c2f]" size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4">
              <p className="text-[#193650] leading-relaxed text-justify font-medium" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

FAQItem.displayName = 'FAQItem';

/**
 * Carousel des avantages EnvyJet avec navigation Swiper
 * Présente les 4 avantages principaux de manière dynamique
 */
const AdvantagesCarousel = () => {
  const swiperRef = useRef<any>(null);

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: '.advantages-swiper-button-next',
          prevEl: '.advantages-swiper-button-prev',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={600}
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="advantages-swiper"
      >
        {ADVANTAGES_DATA.map((advantage, index) => (
          <SwiperSlide key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#f8f8f8] flex flex-col lg:flex-row p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
            >
              <div className="flex items-center justify-center lg:w-1/3 mb-6 lg:mb-0 lg:order-2">
                {advantage.icon}
              </div>
              <div className='lg:w-2/3 lg:order-1 lg:pr-8'>
                <h3 className="text-3xl lg:text-4xl font-medium text-[#a98c2f] mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  {advantage.title}
                </h3>
                <p className="text-[#193650] leading-relaxed text-justify" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  {advantage.description}
                </p>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center items-center mt-8 space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="advantages-swiper-button-prev p-3 bg-white shadow-lg border border-[#969696]/20 hover:bg-[#f8f8f8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#a98c2f]"
          aria-label="Previous advantage"
        >
          <FiChevronLeft className="text-[#193650]" size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="advantages-swiper-button-next p-3 bg-white shadow-lg border border-[#969696]/20 hover:bg-[#f8f8f8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#a98c2f]"
          aria-label="Next advantage"
        >
          <FiChevronRight className="text-[#193650]" size={20} />
        </motion.button>
      </div>
    </div>
  );
};

// =============================================================================
// COMPOSANTS DE FORMULAIRES SPÉCIFIQUES
// =============================================================================

/**
 * Formulaire pour les vols simples (One Way)
 * Capture toutes les informations nécessaires pour un vol direct
 */
const OneWayForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<OneWayFormData>({
    from: '',
    to: '',
    departureDate: '',
    departureTime: '00:00',
    passengers: { adults: 1, children: 0, infants: 0 },
    pets: { small: 0, large: 0 },
    luggage: { carryOn: 0, holdLuggage: 0, skis: 0, golfBag: 0, others: 0 }
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { submitForm, isSubmitting } = useFormSubmission();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    // Validation des champs obligatoires
    if (!formData.from || !formData.to || !formData.departureDate) {
      setValidationErrors(['Please fill all required fields']);
      return;
    }

    // Sauvegarde des données en session pour la page de détails
    sessionStorage.setItem('bookingData', JSON.stringify({
      type: 'oneWay',
      data: formData,
      timestamp: new Date().toISOString()
    }));

    // Redirection vers la page de détails de réservation
    router.push('/details');
  };

  const handleInputChange = useCallback((field: keyof OneWayFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [validationErrors.length]);

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

      {/* Grille responsive pour les champs du formulaire */}
      <div className="grid grid-cols-1 md:grid-cols-15 gap-1">
        {/* Champ aéroport de départ */}
        <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-3">
          <AirportInput
            value={formData.from}
            onChange={(value) => handleInputChange('from', value)}
            placeholder="From"
          />
        </motion.div>

        {/* Champ aéroport d'arrivée */}
        <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-3">
          <AirportInput
            value={formData.to}
            onChange={(value) => handleInputChange('to', value)}
            placeholder="To"
          />
        </motion.div>

        {/* Champ date de départ */}
        <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-2">
          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10" size={20} />
          <input
            type="date"
            value={formData.departureDate}
            onChange={(e) => handleInputChange('departureDate', e.target.value)}
            min={getToday()}
            className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-11 pr-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] text-sm lg:text-base transition-all"
            style={{ fontFamily: 'Century Gothic, sans-serif' }}
            required
          />
        </motion.div>

        {/* Champ heure de départ */}
        <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-2">
          <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10" size={20} />
          <input
            type="time"
            value={formData.departureTime}
            onChange={(e) => handleInputChange('departureTime', e.target.value)}
            className="w-full bg-white border  border-[#969696]/30 text-[#193650] pl-11 pr-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] text-sm lg:text-base transition-all"
            style={{ fontFamily: 'Century Gothic, sans-serif' }}
            required
          />
        </motion.div>

        {/* Section des options : passagers, animaux, bagages */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-1 md:col-span-3 ">
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

        {/* Bouton de soumission */}
        <motion.button
          whileHover={{ scale: 1.03, backgroundColor: "#a98c2f" }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#d3a936] text-white md:col-span-2 py-3 lg:py-3 font-medium text-base lg:text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

/**
 * Formulaire pour les vols aller-retour (Round Trip)
 * Gère deux segments de vol : aller et retour
 */
const RoundTripForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<RoundTripFormData>({
    outbound: {
      from: '',
      to: '',
      date: '',
      time: '00:00',
      passengers: { adults: 1, children: 0, infants: 0 },
      pets: { small: 0, large: 0 },
      luggage: { carryOn: 0, holdLuggage: 0, skis: 0, golfBag: 0, others: 0 }
    },
    return: {
      from: '',
      to: '',
      date: '',
      time: '00:00',
      passengers: { adults: 1, children: 0, infants: 0 },
      pets: { small: 0, large: 0 },
      luggage: { carryOn: 0, holdLuggage: 0, skis: 0, golfBag: 0, others: 0 }
    }
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { submitForm, isSubmitting } = useFormSubmission();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    // Validation des champs obligatoires pour les deux segments
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

  /**
   * Gestionnaire pour le segment aller
   * Met automatiquement à jour le segment retour pour cohérence
   */
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

  /**
   * Gestionnaire pour le segment retour
   */
  const handleReturnChange = useCallback((field: keyof typeof formData.return, value: any) => {
    setFormData(prev => ({
      ...prev,
      return: { ...prev.return, [field]: value }
    }));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [validationErrors.length]);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
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

      {/* Section Vol Aller */}
      <div className="space-y-4">
        <h3
          className="text-white text-base font-medium md:mt-"
          style={{ fontFamily: "Century Gothic, sans-serif" }}
        >
          Outbound
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-14 gap-1">
          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-3">
            <AirportInput
              value={formData.outbound.from}
              onChange={(value) => handleOutboundChange("from", value)}
              placeholder="From"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-3">
            <AirportInput
              value={formData.outbound.to}
              onChange={(value) => handleOutboundChange("to", value)}
              placeholder="To"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-3">
            <FiCalendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10"
              size={20}
            />
            <input
              type="date"
              value={formData.outbound.date}
              onChange={(e) => handleOutboundChange("date", e.target.value)}
              min={getToday()}
              className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-11 pr-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] text-sm lg:text-base transition-all"
              style={{ fontFamily: "Century Gothic, sans-serif" }}
              required
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-2">
            <FiClock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10"
              size={20}
            />
            <input
              type="time"
              value={formData.outbound.time}
              onChange={(e) => handleOutboundChange("time", e.target.value)}
              className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-11 pr-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] text-sm lg:text-base transition-all"
              style={{ fontFamily: "Century Gothic, sans-serif" }}
              required
            />
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-3 gap-1 md:col-span-3 ">
            <div className="w-full">
              <PassengersDropdown
                passengers={formData.outbound.passengers}
                onChange={(passengers) =>
                  handleOutboundChange("passengers", passengers)
                }
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

      {/* Section Vol Retour */}
      <div className="space-y-3">
        <h3 className="text-white text-base font-medium" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Inbound</h3>
        <div className="grid grid-cols-1 md:grid-cols-14 gap-1">
          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-3">
            <AirportInput
              value={formData.return.from || formData.outbound.to}
              onChange={(value) => handleReturnChange('from', value)}
              placeholder="From"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-3">
            <AirportInput
              value={formData.return.to || formData.outbound.from}
              onChange={(value) => handleReturnChange('to', value)}
              placeholder="To"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-3">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10" size={20} />
            <input
              type="date"
              value={formData.return.date}
              onChange={(e) => handleReturnChange('date', e.target.value)}
              min={formData.outbound.date || getToday()}
              className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-11 pr-4 py-3 lg:py-4 focus:outline-none focus:border-[#a98c2f] text-sm lg:text-base transition-all"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
              required
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="relative md:col-span-2">
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
          <div className='grid grid-cols-3 sm:grid-cols-3 gap-1 md:col-span-3'>
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
        className="w-full md:w-[20%] bg-[#d3a936] text-white py-3  lg:py-4 font-medium text-base lg:text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

/**
 * Formulaire pour les vols multi-étapes (Multi-Leg)
 * Permet d'ajouter dynamiquement des segments de vol
 */
const MultiLegForm: React.FC<FormProps> = ({ onSubmit }) => {
  const emptyLeg = {
    from: '',
    to: '',
    date: '',
    time: '00:00',
    passengers: { adults: 1, children: 0, infants: 0 },
    pets: { small: 0, large: 0 },
    luggage: { carryOn: 0, holdLuggage: 0, skis: 0, golfBag: 0, others: 0 }
  };

  const [legs, setLegs] = useState<FlightLeg[]>([emptyLeg, emptyLeg]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { submitForm, isSubmitting } = useFormSubmission();
  const router = useRouter();

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
          <div key={index} className="space-y-[6px] ">
            <div className="flex justify-between items-center">
              <h3
                className="text-white text-base font-medium"
                style={{ fontFamily: 'Century Gothic, sans-serif' }}
              >
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

            <div className="grid grid-cols-1 md:grid-cols-14 gap-1">
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

              <div className="relative md:col-span-3">
                <FiCalendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10"
                  size={18}
                />
                <input
                  type="date"
                  value={leg.date}
                  onChange={(e) => updateLeg(index, 'date', e.target.value)}
                  min={index > 0 ? legs[index - 1].date : getToday()}
                  className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-10 pr-4 py-[18px] focus:outline-none focus:border-[#a98c2f] text-sm transition-all"
                  style={{ fontFamily: 'Century Gothic, sans-serif' }}
                  required
                />
              </div>

              <div className="relative md:col-span-2">
                <FiClock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a98c2f] z-10"
                  size={18}
                />
                <input
                  type="time"
                  value={leg.time}
                  onChange={(e) => updateLeg(index, 'time', e.target.value)}
                  className="w-full bg-white border border-[#969696]/30 text-[#193650] pl-10 pr-4 py-[18px] focus:outline-none focus:border-[#a98c2f] text-sm transition-all"
                  style={{ fontFamily: 'Century Gothic, sans-serif' }}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-1 md:col-span-3">
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

      <div className="flex justify-between items-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-[20%] bg-[#d3a936] text-white py-3 lg:py-4 font-medium text-base lg:text-lg hover:bg-[#a98c2f] hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

/**
 * Composant principal de formulaire avec onglets
 * Gère la navigation entre les différents types de vol
 */
const BookingForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [activeForm, setActiveForm] = useState('oneWay');
  const isClient = useClientCheck();

  const handleFormSubmit = async (formData: any) => {
    await onSubmit(formData);
  };

  // Affichage de chargement pendant le rendu côté serveur
  if (!isClient) {
    return (
      <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-white/20"></div>
          <div className="h-16 bg-white/20"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-4 lg:p-6 shadow-2xl"
    >
      {/* Navigation par onglets */}
      <div className="flex bg-white/10 p-1 mb-6" role="tablist">
        {FORM_TABS.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveForm(tab.id)}
            className={`flex-1 py-3 px-4 transition-all duration-300 flex items-center justify-center space-x-2 text-sm font-medium ${activeForm === tab.id
              ? 'bg-[#d3a936] text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            style={{ fontFamily: 'Century Gothic, sans-serif' }}
            role="tab"
            aria-selected={activeForm === tab.id}
          >
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Contenu du formulaire actif */}
      <AnimatePresence mode="wait">
        <div
          key={activeForm}
        >
          {activeForm === 'oneWay' && <OneWayForm onSubmit={handleFormSubmit} />}
          {activeForm === 'roundTrip' && <RoundTripForm onSubmit={handleFormSubmit} />}
          {activeForm === 'multiLeg' && <MultiLegForm onSubmit={handleFormSubmit} />}
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

// =============================================================================
// COMPOSANT PRINCIPAL DE LA PAGE D'ACCUEIL
// =============================================================================

/**
 * Page d'accueil principale de EnvyJet
 * Intègre tous les composants et sections de la landing page
 */
export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const isClient = useClientCheck();

  const handleFormSubmit = async (formData: any) => {
    console.log('Flight booked:', formData);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };
  const router = useRouter();

  const handleRedirect = () => {
    // Redirige l'utilisateur vers la route '/details' de votre application
    router.push('/why-envyjet');
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
        setTimeout(() => setIsSubscribed(false), 3000);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    }
  };

  const toggleFAQ = useCallback((index: number) => {
    setOpenFAQ(prev => prev === index ? null : index);
  }, []);

  // Affichage de chargement pendant l'hydratation
  if (!isClient) {
    return (
      <div className="relative w-full min-h-screen overflow-x-hidden bg-gray-100">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-12 bg-gray-300 w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden" style={{ margin: 0, padding: 0, fontFamily: 'Century Gothic, sans-serif' }}>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(169, 140, 47, 0.6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(169, 140, 47, 0.8);
        }

        .advantages-swiper {
          width: 100%;
          height: 100%;
        }

        .advantages-swiper .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .advantages-swiper-button-next,
        .advantages-swiper-button-prev {
          position: static;
          margin: 0;
          transform: none;
        }

        .advantages-swiper-button-next::after,
        .advantages-swiper-button-prev::after {
          content: none;
        }
      `}</style>

      <Navbar />

      {/* Section Hero avec fond vidéo */}
      <section className="relative min-h-screen flex flex-col items-center justify-center w-full overflow-hidden" style={{ margin: 0, padding: 0 }}>
        <VideoBackground />

        <div className="relative z-10 w-full flex-1 flex items-center justify-center px-4 pt-20 pb-8">
          <div className="text-white text-center max-w-5xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl lg:text-6xl xl:text-7xl font-light mb-6 leading-tight"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
            >
              At the Heart of
              Your Travels
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base lg:text-xl text-white/90 mb-8 font-light"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
            >
              PREMIUM PRIVATE JET SERVICE - Experience unparalleled luxury and comfort in the skies
            </motion.p>
          </div>
        </div>

        {/* Formulaire de réservation principal */}
        <div className="relative z-10 w-full px-4 pb-8">
          <div className="container mx-auto max-w-7xl">
            <BookingForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </section>

      {/* Section À propos de EnvyJet */}
      <section id="why-envyjet" className="py-12  lg:py-20 bg-white w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light text-[#193650] mb-6" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                About <span className="text-[#a98c2f]">EnvyJet</span>
              </h2>
              <p className="text-base lg:text-lg text-[#193650] mb-6 leading-relaxed text-justify" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                We save you time and provide you with flight comfort. Our dedicated team ensures that our business partners,
                guests and their families enjoy an exceptional trip. Whether for a pressing business trip or a personal getaway,
                our services are designed to be fast, efficient and economical.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <FiCheckCircle className="text-[#a98c2f]" size={20} />
                  <span className="text-[#193650] font-medium text-sm lg:text-base" style={{ fontFamily: 'Century Gothic, sans-serif' }}>A strong team with over 20 years of expertise</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiCheckCircle className="text-[#a98c2f]" size={20} />
                  <span className="text-[#193650] font-medium text-sm lg:text-base" style={{ fontFamily: 'Century Gothic, sans-serif' }}>An unforgettable travel experience</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <motion.button
                  onClick={handleRedirect} // <-- C'est ici qu'on ajoute l'action de redirection
                  whileHover={{ scale: 1.05, backgroundColor: "#a98c2f" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#d3a936] text-white px-6 py-3 font-medium text-sm lg:text-base"
                  style={{ fontFamily: 'Century Gothic, sans-serif' }}
                >
                  FIND OUT MORE
                </motion.button>
                <div className="flex items-center space-x-2 text-[#193650] font-medium text-sm lg:text-base" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  <FiPhone size={18} />
                  <span>+225 0759102503</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative h-100 overflow-hidden shadow-xl"
                >
                  <SafeImage
                    src="/images/about-too-envyjet.jpg"
                    alt="Luxury jet interior"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative h-100 overflow-hidden shadow-xl mt-8"
                >
                  <SafeImage
                    src="/images/about-three-envyjet.jpg"
                    alt="Private jet exterior"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Services */}
      <section
        id="services"
        className="relative py-12 lg:py-20 w-full bg-cover bg-center bg-no-repeat"
        style={{
          margin: 0,
          backgroundImage: "url('images/service.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 container mx-auto px-4 lg:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2
              className="text-3xl lg:text-4xl xl:text-5xl font-light text-white mb-4"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
            >
              Our Services
            </h2>
            <p
              className="text-white/80 text-base lg:text-lg"
              style={{ fontFamily: 'Century Gothic, sans-serif' }}
            >
              Experience the pinnacle of luxury air travel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {SERVICES_DATA.map((service, index) => (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-black/50 p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group border border-[#969696]/20 overflow-hidden"
              >
                <div className="relative h-48 mb-6 overflow-hidden">
                  <SafeImage
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <h3
                  className="text-lg lg:text-xl font-medium text-white mb-4"
                  style={{ fontFamily: 'Century Gothic, sans-serif' }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-white/80 text-sm lg:text-base mb-6 text-justify"
                  style={{ fontFamily: 'Century Gothic, sans-serif' }}
                >
                  {service.description}
                </p>
                <motion.a
                  href={service.fileUrl || "/documents/default_info.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a98c2f] font-medium text-sm lg:text-base group-hover:underline flex items-center space-x-2 cursor-pointer"
                  style={{ fontFamily: 'Century Gothic, sans-serif' }}
                  // Animation conservée pour le lien
                  whileHover={{ scale: 1.02 }}
                >
                  <span>MORE INFO</span>
                  <FiArrowRight size={16} />
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Avantages avec carousel */}
      <section className="py-12 lg:py-20 bg-white w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light text-[#193650] mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Our Advantages</h2>
            <p className="text-[#969696] text-base lg:text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Why choose EnvyJet for your private air travel</p>
          </motion.div>

          <AdvantagesCarousel />
        </div>
      </section>

      {/* Section FAQ */}
      <section className="py-12 lg:py-20 bg-[#f8f8f8] w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light text-[#193650] mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Q&A</h2>
            <p className="text-[#969696] text-base lg:text-lg" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Frequently asked questions about our services</p>
          </motion.div>

          <div className="space-y-4">
            {FAQ_DATA.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onClick={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section Newsletter */}
      <section className="py-12 lg:py-20 bg-gradient-to-br from-[#1a3a57] to-[#2d5a82] w-full" style={{ margin: 0 }}>
        <div className="container mx-auto px-4 lg:px-6 text-center max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light text-white mb-4" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Newsletter</h2>
            <p className="text-white/80 text-base lg:text-lg mb-8" style={{ fontFamily: 'Century Gothic, sans-serif' }}>Stay updated with our latest offers and services</p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-full mx-auto flex flex-col sm:flex-row gap-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 text-white placeholder-white/70 px-4 lg:px-6 py-3 focus:outline-none focus:bg-white/20 border border-white/20 text-sm lg:text-base"
                style={{ fontFamily: 'Century Gothic, sans-serif' }}
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, backgroundColor: "#a98c2f" }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#d3a936] text-white px-6 py-3 font-medium text-sm lg:text-base flex items-center justify-center space-x-2"
                style={{ fontFamily: 'Century Gothic, sans-serif' }}
              >
                <FiSend size={18} />
                <span>Subscribe</span>
              </motion.button>
            </form>

            <AnimatePresence>
              {isSubscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-white mt-4 font-medium text-sm lg:text-base"
                  style={{ fontFamily: 'Century Gothic, sans-serif' }}
                >
                  Thank you for subscribing!
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}