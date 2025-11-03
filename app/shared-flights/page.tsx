"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchForm from "../components/SearchForm";
import FlightCard from "../components/FlightCard";
import Pagination from "../components/Pagination";
import FlightDetailsModal from "../components/FlightDetailsModal";
import { useRouter } from 'next/navigation';

/**
 * Interface complète pour représenter un vol partagé (Shared Flight)
 * Les vols partagés permettent de réduire les coûts en partageant
 * l'avion avec d'autres passagers
 */
interface Flight {
  id: number;
  departure: string;
  from: string;
  to: string;
  aircraft: string;
  type: string;
  capacity: number;
  price: number;
  image: string;
  codeFrom: string; // Code IATA de l'aéroport de départ
  codeTo: string;   // Code IATA de l'aéroport d'arrivée
  cityFrom: string; // Ville de départ
  cityTo: string;   // Ville d'arrivée
  pricestarting: string; // Indicateur de prix ("Price up to", "From", etc.)
}

/**
 * Interface pour les données de date/heure extraites
 */
interface DateTimeInfo {
  date: string;
  time: string;
}

/**
 * Interface pour les données complètes de réservation
 * Transférées vers la page de détails via sessionStorage
 */
interface BookingData {
  type: 'oneWay';
  data: {
    // Informations de vol de base
    from: string;
    to: string;
    departureDate: string;
    departureTime: string;

    // Informations détaillées pour l'affichage
    codeFrom: string;
    codeTo: string;
    cityFrom: string;
    cityTo: string;

    // Configuration des passagers
    passengers: {
      adults: number;
      children: number;
      infants: number;
    };

    // Caractéristiques techniques du vol
    aircraft: string;
    type: string;
    capacity: number;
    price: number;
    totalCost: number;

    // Options supplémentaires
    pets: {
      small: number;
      large: number;
    };
    baggage: {
      cabin: number;
      checked: number;
      skis: number;
      golf: number;
      other: number;
    };
  };
  timestamp: string;
}

/**
 * Page principale pour la recherche et réservation de vols partagés
 * Offre deux catégories : ON SALE (disponibles) et ON PRESALE (pré-réservations)
 */
const SharedFlightsPage = () => {
  const router = useRouter();

  // États de gestion des données et de l'interface
  const [currentPage, setCurrentPage] = useState(1);
  const [allSaleFlights, setAllSaleFlights] = useState<Flight[]>([]);
  const [allPresaleFlights, setAllPresaleFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [activeTab, setActiveTab] = useState<'sale' | 'presale'>('sale');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Configuration de l'application
  const itemsPerPage = 6;
  const pricestarting = "Price up to"; // Indicateur standard pour les vols partagés

  /**
   * Catalogue des vols ON SALE - Disponibles immédiatement
   * Ces vols sont confirmés et prêts au départ
   */
  const saleFlights: Flight[] = [
    {
      id: 1,
      departure: 'Thu 29 Oct 2026',
      from: 'Scottsdale, Scottsdale Airport (SDL), AZ, US',
      to: 'Teterboro, Teterboro Airport (TEB), NJ, US',
      aircraft: 'Gulfstream G-IV',
      type: 'Heavy Jet',
      capacity: 14,
      price: 36225,
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=300&fit=crop',
      codeFrom: 'SDL',
      codeTo: 'TEB',
      cityFrom: 'Scottsdale',
      cityTo: 'Teterboro',
      pricestarting: pricestarting
    },
    {
      id: 2,
      departure: 'Thu 29 Oct 2026',
      from: 'West Palm Beach, Palm Beach International (PBI), FL, US',
      to: 'Jacksonville, Jacksonville International Airport (JAX), FL, US',
      aircraft: 'Citation X',
      type: 'Super Midsize Jet',
      capacity: 8,
      price: 4528,
      image: '/images/avion-un.jpg',
      codeFrom: 'PBI',
      codeTo: 'JAX',
      cityFrom: 'West Palm Beach',
      cityTo: 'Jacksonville',
      pricestarting: pricestarting
    },
    {
      id: 3,
      departure: 'Fri 30 Oct 2026',
      from: 'Miami, Miami International Airport (MIA), FL, US',
      to: 'New York, Teterboro Airport (TEB), NJ, US',
      aircraft: 'Challenger 350',
      type: 'Super Midsize Jet',
      capacity: 9,
      price: 15750,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
      codeFrom: 'MIA',
      codeTo: 'TEB',
      cityFrom: 'Miami',
      cityTo: 'New York',
      pricestarting: pricestarting
    },
    {
      id: 4,
      departure: 'Fri 30 Oct 2026',
      from: 'Los Angeles, Van Nuys Airport (VNY), CA, US',
      to: 'Las Vegas, Henderson Executive Airport (HND), NV, US',
      aircraft: 'Learjet 75',
      type: 'Light Jet',
      capacity: 6,
      price: 8900,
      image: '/images/avion-deux.jpg',
      codeFrom: 'VNY',
      codeTo: 'HND',
      cityFrom: 'Los Angeles',
      cityTo: 'Las Vegas',
      pricestarting: pricestarting
    }
  ];

  /**
   * Catalogue des vols ON PRESALE - Pré-réservations
   * Ces vols nécessitent un nombre minimum de participants pour être confirmés
   */
  const presaleFlights: Flight[] = [
    {
      id: 5,
      departure: 'Sat 31 Oct 2026',
      from: 'Chicago, Chicago Midway Airport (MDW), IL, US',
      to: 'Aspen, Aspen-Pitkin County Airport (ASE), CO, US',
      aircraft: 'Citation Sovereign',
      type: 'Midsize Jet',
      capacity: 8,
      price: 18500,
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=300&fit=crop',
      codeFrom: 'MDW',
      codeTo: 'ASE',
      cityFrom: 'Chicago',
      cityTo: 'Aspen',
      pricestarting: pricestarting
    },
    {
      id: 6,
      departure: 'Sat 31 Oct 2026',
      from: 'Dallas, Dallas Love Field (DAL), TX, US',
      to: 'Houston, William P. Hobby Airport (HOU), TX, US',
      aircraft: 'Phenom 300',
      type: 'Light Jet',
      capacity: 7,
      price: 6200,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
      codeFrom: 'DAL',
      codeTo: 'HOU',
      cityFrom: 'Dallas',
      cityTo: 'Houston',
      pricestarting: pricestarting
    },
    {
      id: 7,
      departure: 'Sun 01 Nov 2026',
      from: 'San Francisco, San Francisco International (SFO), CA, US',
      to: 'Seattle, Boeing Field (BFI), WA, US',
      aircraft: 'Global 6000',
      type: 'Ultra Long Range',
      capacity: 13,
      price: 28900,
      image: 'images/avion-un.jpg',
      codeFrom: 'SFO',
      codeTo: 'BFI',
      cityFrom: 'San Francisco',
      cityTo: 'Seattle',
      pricestarting: pricestarting
    },
    {
      id: 8,
      departure: 'Sun 01 Nov 2026',
      from: 'Atlanta, DeKalb-Peachtree Airport (PDK), GA, US',
      to: 'Nashville, Nashville International Airport (BNA), TN, US',
      aircraft: 'Citation CJ3',
      type: 'Light Jet',
      capacity: 6,
      price: 7800,
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=300&fit=crop',
      codeFrom: 'PDK',
      codeTo: 'BNA',
      cityFrom: 'Atlanta',
      cityTo: 'Nashville',
      pricestarting: pricestarting
    }
  ];

  /**
   * Extrait la date et l'heure d'une chaîne de départ
   * Format d'entrée: "Thu 29 Oct 2026"
   * @param departureString - Chaîne de date au format texte
   * @returns Objet contenant la date au format ISO et l'heure par défaut
   */
  const extractDateTime = (departureString: string): DateTimeInfo => {
    const parts = departureString.split(' ');

    if (parts.length < 4) {
      console.warn(`Format de date invalide: ${departureString}`);
      return { date: "", time: "" };
    }

    const day = parts[1];
    const month = parts[2];
    const year = parts[3];

    const months: { [key: string]: string } = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };

    const monthNumber = months[month];
    if (!monthNumber) {
      console.warn(`Mois invalide: ${month}`);
      return { date: "", time: "" };
    }

    return {
      date: `${year}-${monthNumber}-${day.padStart(2, '0')}`,
      time: "10:00:00" // Heure par défaut pour les vols partagés
    };
  };

  /**
   * Ouvre la modal de détails pour un vol ON SALE
   * Redirige directement vers /details pour un vol ON PRESALE
   * @param flight - Vol sélectionné pour affichage des détails
   */
  const handleMoreInfo = (flight: Flight): void => {
    // Vérifier si le vol est dans la liste ON SALE ou ON PRESALE
    const isSaleFlight = allSaleFlights.some(f => f.id === flight.id);
    const isPresaleFlight = allPresaleFlights.some(f => f.id === flight.id);

    if (isSaleFlight) {
      // Pour ON SALE : ouvrir la modal
      setSelectedFlight(flight);
      setIsModalOpen(true);
    } else if (isPresaleFlight) {
      // Pour ON PRESALE : rediriger directement vers /details
      handleDirectBooking(flight);
    }
  };

  /**
   * Gère la réservation directe pour les vols ON PRESALE
   * Sauvegarde les données et redirige vers /details sans passer par la modal
   * @param flight - Vol à réserver directement
   */
  const handleDirectBooking = (flight: Flight): void => {
    try {
      const dateTimeInfo = extractDateTime(flight.departure);

      // Validation des données essentielles
      if (!dateTimeInfo.date) {
        throw new Error('Impossible d\'extraire la date de départ');
      }

      // Construction de l'objet de réservation complet
      const bookingData: BookingData = {
        type: 'oneWay',
        data: {
          // Informations de vol de base - utiliser les codes IATA et villes
          from: `${flight.codeFrom} - ${flight.cityFrom}`,
          to: `${flight.codeTo} - ${flight.cityTo}`,
          departureDate: dateTimeInfo.date,
          departureTime: dateTimeInfo.time,

          // Informations détaillées pour l'affichage
          codeFrom: flight.codeFrom,
          codeTo: flight.codeTo,
          cityFrom: flight.cityFrom,
          cityTo: flight.cityTo,

          // Configuration des passagers (valeurs par défaut)
          passengers: {
            adults: 1,
            children: 0,
            infants: 0
          },

          // Caractéristiques techniques du vol
          aircraft: flight.aircraft,
          type: flight.type,
          capacity: flight.capacity,
          price: flight.price,
          totalCost: flight.price, // Prix de base pour un adulte

          // Options supplémentaires avec valeurs par défaut
          pets: { small: 0, large: 0 },
          baggage: {
            cabin: 0,
            checked: 0,
            skis: 0,
            golf: 0,
            other: 0
          }
        },
        timestamp: new Date().toISOString()
      };

      console.log('Données de réservation ON PRESALE préparées:', bookingData);

      // Sauvegarde sécurisée en session storage
      sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

      // Vérification de l'intégrité des données sauvegardées
      const stored = sessionStorage.getItem('bookingData');
      if (!stored) {
        throw new Error('Échec de la sauvegarde en session storage');
      }

      console.log('Vérification du stockage ON PRESALE:', JSON.parse(stored));

      // Redirection directe vers la page de détails
      router.push('/details');

    } catch (error) {
      console.error('Erreur lors de la réservation directe ON PRESALE:', error);
      alert('Une erreur est survenue lors de la préparation de votre réservation. Veuillez réessayer.');
    }
  };

  /**
   * Ferme la modal de détails et réinitialise la sélection
   */
  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedFlight(null);
  };

  /**
   * Gère la finalisation de la réservation depuis la modal (pour ON SALE)
   * Sauvegarde les données complètes et redirige vers la page de détails
   * @param flightData - Données complètes du vol avec options sélectionnées
   */
  const handleNext = (flightData: any): void => {
    try {
      // Validation des données essentielles
      if (!flightData?.from || !flightData?.to || !flightData?.date) {
        throw new Error('Données de vol incomplètes');
      }

      // Construction de l'objet de réservation complet
      const bookingData: BookingData = {
        type: 'oneWay',
        data: {
          // Informations de vol de base
          from: flightData.from,
          to: flightData.to,
          departureDate: flightData.date,
          departureTime: flightData.time,

          // Informations détaillées pour l'affichage
          codeFrom: flightData.codeFrom,
          codeTo: flightData.codeTo,
          cityFrom: flightData.cityFrom,
          cityTo: flightData.cityTo,

          // Configuration des passagers
          passengers: {
            adults: flightData.passengers?.adults || 1,
            children: flightData.passengers?.children || 0,
            infants: flightData.passengers?.infants || 0
          },

          // Caractéristiques techniques
          aircraft: flightData.aircraft,
          type: flightData.type,
          capacity: flightData.capacity,
          price: flightData.price,
          totalCost: flightData.totalCost,

          // Options supplémentaires avec valeurs par défaut
          pets: flightData.pets || { small: 0, large: 0 },
          baggage: flightData.baggage || {
            cabin: 0,
            checked: 0,
            skis: 0,
            golf: 0,
            other: 0
          }
        },
        timestamp: new Date().toISOString()
      };

      console.log('Données de réservation ON SALE préparées:', bookingData);

      // Sauvegarde sécurisée en session storage
      sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

      // Vérification de l'intégrité des données sauvegardées
      const stored = sessionStorage.getItem('bookingData');
      if (!stored) {
        throw new Error('Échec de la sauvegarde en session storage');
      }

      console.log('Vérification du stockage ON SALE:', JSON.parse(stored));

      // Fermeture de la modal et redirection
      setIsModalOpen(false);
      setSelectedFlight(null);
      router.push('/details');

    } catch (error) {
      console.error('Erreur lors de la préparation de la réservation ON SALE:', error);
      alert('Une erreur est survenue lors de la préparation de votre réservation. Veuillez réessayer.');
    }
  };

  /**
   * Gère la recherche parmi tous les vols (SALE et PRESALE)
   * Active le mode recherche global qui ignore la segmentation par onglets
   * @param filters - Critères de recherche (origine, destination, date)
   */
  const handleSearch = (filters: { from: string; to: string; date: string; passengers: number }): void => {
    const allFlights = [...allSaleFlights, ...allPresaleFlights];
    let filtered = allFlights;

    // Détection du mode "recherche vide" pour réinitialiser l'affichage
    const isSearchEmpty = !filters.from && !filters.to && !filters.date;

    if (isSearchEmpty) {
      setIsSearchActive(false);
      const currentFlights = activeTab === 'sale' ? allSaleFlights : allPresaleFlights;
      setFilteredFlights(currentFlights);
      setCurrentPage(1);
      return;
    }

    // Activation du mode recherche globale
    setIsSearchActive(true);

    // Filtrage par aéroport de départ
    if (filters.from.trim()) {
      const searchTerm = filters.from.toLowerCase().trim();
      filtered = filtered.filter(flight =>
        flight.from.toLowerCase().includes(searchTerm) ||
        flight.cityFrom.toLowerCase().includes(searchTerm) ||
        flight.codeFrom.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrage par aéroport d'arrivée
    if (filters.to.trim()) {
      const searchTerm = filters.to.toLowerCase().trim();
      filtered = filtered.filter(flight =>
        flight.to.toLowerCase().includes(searchTerm) ||
        flight.cityTo.toLowerCase().includes(searchTerm) ||
        flight.codeTo.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrage par date de départ
    if (filters.date) {
      const searchDateObj = new Date(filters.date);

      filtered = filtered.filter(flight => {
        const flightDateStr = flight.departure.split(' ').slice(1).join(' ');
        const months: { [key: string]: string } = {
          'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
          'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
          'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };

        const [day, month, year] = flightDateStr.split(' ');
        const flightDate = new Date(`${year}-${months[month]}-${day.padStart(2, '0')}`);

        return flightDate.toDateString() === searchDateObj.toDateString();
      });
    }

    // Application des résultats de recherche
    setFilteredFlights(filtered);
    setCurrentPage(1); // Retour à la première page
  };

  /**
   * Gère le changement d'onglet entre SALE et PRESALE
   * Ignoré lorsqu'une recherche globale est active
   * @param tab - Onglet à activer ('sale' ou 'presale')
   */
  const handleTabChange = (tab: 'sale' | 'presale'): void => {
    setActiveTab(tab);

    // Conservation des résultats de recherche en mode global
    if (isSearchActive) {
      return;
    }

    // Chargement des vols correspondant à l'onglet sélectionné
    const currentFlights = tab === 'sale' ? allSaleFlights : allPresaleFlights;
    setFilteredFlights(currentFlights);
    setCurrentPage(1);
  };

  /**
   * Initialisation des données au chargement du composant
   */
  useEffect(() => {
    setAllSaleFlights(saleFlights);
    setAllPresaleFlights(presaleFlights);
    setFilteredFlights(saleFlights); // Onglet SALE par défaut
  }, []);

  // Calcul des données de pagination
  const indexOfLastFlight = currentPage * itemsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - itemsPerPage;
  const currentFlights = filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Section Hero avec image de fond et overlay */}
      <div
        className="relative bg-cover bg-center md:h-96 pt-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1600&h=600&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-800/50"></div>

        <div className="relative container p-4 mx-auto h-full flex flex-col justify-center">
          <h1 className="text-3xl text-center md:text-left md:text-2xl text-white mb-4">
            SHARED CHARTER FLIGHTS
          </h1>

          <p className="text-lg text-white/90 max-w-full md:mb-8 text-justify">
            You enjoy the luxury and comfort of a private jet at a fraction of the usual cost
            by sharing the expenses with other passengers, while benefiting from networking
            opportunities and professional connections that enrich your travel experience.
          </p>

          {/* Composant de recherche */}
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      {/* Section des résultats avec onglets */}
      <div className="container mx-auto px-4 py-8">
        {/* Bannière d'information en mode recherche globale */}
        {isSearchActive && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              Active Search – Displaying results for all flights (ON SALE and ON PRESALE)
              <button
                onClick={() => handleSearch({ from: '', to: '', date: '', passengers: 1 })}
                className="ml-4 text-blue-600 underline hover:text-blue-800"
              >
                Réinitialiser
              </button>
            </p>
          </div>
        )}

        {/* Navigation par onglets */}
        <div className="flex mb-6">
          <button
            onClick={() => handleTabChange('sale')}
            className={`text-xl px-6 py-3 rounded-t-lg transition-colors ${activeTab === 'sale'
              ? 'text-[#b8922e] border-b-2 border-[#b8922e] font-semibold'
              : 'text-gray-400 hover:text-gray-600'
              } ${isSearchActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSearchActive}
            aria-pressed={activeTab === 'sale'}
          >
            ON SALE
          </button>
          <button
            onClick={() => handleTabChange('presale')}
            className={`text-xl px-6 py-3 rounded-t-lg transition-colors ${activeTab === 'presale'
              ? 'text-[#b8922e] border-b-2 border-[#b8922e] font-semibold'
              : 'text-gray-400 hover:text-gray-600'
              } ${isSearchActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSearchActive}
            aria-pressed={activeTab === 'presale'}
          >
            ON PRESALE
          </button>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* En-tête avec compteur de résultats */}
          <h2 className="text-2xl text-[#b8922e] mb-8">
            {filteredFlights.length} {filteredFlights.length === 1 ? 'flight' : 'flights'}
          </h2>

          {/* Grille des vols ou message d'absence de résultats */}
          {currentFlights.length > 0 ? (
            <>
              <div className="grid gap-8 mb-12">
                {currentFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onMoreInfo={() => handleMoreInfo(flight)}
                  />
                ))}
              </div>

              {/* Pagination - affichée seulement si nécessaire */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredFlights.length}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No flights found matching your search criteria.
              </p>
              <p className="text-gray-500 mt-2">
                Try adjusting your search filters or browse all available flights.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal des détails du vol - uniquement pour ON SALE */}
      {isModalOpen && selectedFlight && (
        <FlightDetailsModal
          flight={selectedFlight}
          onClose={handleCloseModal}
          onNext={handleNext}
        />
      )}

      <Footer />
    </div>
  );
};

export default SharedFlightsPage;