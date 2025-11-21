"use client";

import React, { useState, useEffect } from 'react';
import Footer from "../components/Footer";
import SearchForm from "../components/SearchForm";
import FlightCard from "../components/FlightCard";
import Pagination from "../components/Pagination";
import FlightDetailsModal from "../components/FlightDetailsModal";
import NavbarSE from '../components/NavbarES';

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
  codeFrom: string;
  codeTo: string;
  cityFrom: string;
  cityTo: string;
  pricestarting: string;
}

const SharedFlightsPage = () => {
  // États de gestion des données et de l'interface
  const [currentPage, setCurrentPage] = useState(1);
  const [allSaleFlights, setAllSaleFlights] = useState<Flight[]>([]);
  const [allPresaleFlights, setAllPresaleFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [activeTab, setActiveTab] = useState<'sale' | 'presale'>('sale');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // ÉTATS POUR LA MODALE
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Configuration de l'application
  const itemsPerPage = 6;
  const pricestarting = "Price up to";

  // Catalogue des vols ON SALE
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

  // Catalogue des vols ON PRESALE
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
   * Gère l'affichage des détails d'un vol
   * Pour ON SALE : ouvre FlightDetailsModal
   * Pour ON PRESALE : utilise la modale intégrée de FlightCard
   */
  const handleMoreInfo = (flight: Flight): void => {
    // Vérifier si le vol est dans la liste ON SALE
    const isSaleFlight = allSaleFlights.some(f => f.id === flight.id);

    if (isSaleFlight) {
      // Pour ON SALE : ouvrir FlightDetailsModal
      setSelectedFlight(flight);
      setIsModalOpen(true);
    }
    // Pour ON PRESALE : ne rien faire de spécial, la modale intégrée de FlightCard s'ouvrira automatiquement
  };

  /**
   * Détermine si un vol doit utiliser la modale intégrée
   */
  const shouldUseIntegratedModal = (flight: Flight): boolean => {
    // Si le vol est dans ON PRESALE, utiliser la modale intégrée
    const isPresaleFlight = allPresaleFlights.some(f => f.id === flight.id);
    return isPresaleFlight;
  };

  /**
   * Ferme la modal FlightDetailsModal
   */
  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedFlight(null);
  };

  /**
   * Gère la finalisation de la réservation depuis FlightDetailsModal
   */
  const handleNext = (flightData: any): void => {
    try {
      // Construction de l'objet de réservation
      const bookingData = {
        type: 'oneWay' as const,
        data: {
          from: flightData.from,
          to: flightData.to,
          departureDate: flightData.departureDate,
          departureTime: flightData.departureTime,
          codeFrom: flightData.codeFrom,
          codeTo: flightData.codeTo,
          cityFrom: flightData.cityFrom,
          cityTo: flightData.cityTo,
          passengers: flightData.passengers,
          aircraft: flightData.aircraft,
          type: flightData.type,
          capacity: flightData.capacity,
          price: flightData.price,
          totalCost: flightData.totalCost,
          pets: flightData.pets,
          baggage: flightData.baggage
        },
        timestamp: new Date().toISOString()
      };

      console.log('Données de réservation ON SALE préparées:', bookingData);

      // Sauvegarde en session storage
      sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

      // Fermeture de la modal
      handleCloseModal();

      // Redirection vers /details
      window.location.href = '/details';

    } catch (error) {
      console.error('Erreur lors de la préparation de la réservation ON SALE:', error);
      alert('Une erreur est survenue lors de la préparation de votre réservation. Veuillez réessayer.');
    }
  };

  /**
   * Gère la recherche parmi tous les vols
   */
  const handleSearch = (filters: { from: string; to: string; date: string; passengers: number }): void => {
    const allFlights = [...allSaleFlights, ...allPresaleFlights];
    let filtered = allFlights;

    const isSearchEmpty = !filters.from && !filters.to && !filters.date;

    if (isSearchEmpty) {
      setIsSearchActive(false);
      const currentFlights = activeTab === 'sale' ? allSaleFlights : allPresaleFlights;
      setFilteredFlights(currentFlights);
      setCurrentPage(1);
      return;
    }

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

    setFilteredFlights(filtered);
    setCurrentPage(1);
  };

  /**
   * Gère le changement d'onglet
   */
  const handleTabChange = (tab: 'sale' | 'presale'): void => {
    setActiveTab(tab);

    if (isSearchActive) {
      return;
    }

    const currentFlights = tab === 'sale' ? allSaleFlights : allPresaleFlights;
    setFilteredFlights(currentFlights);
    setCurrentPage(1);
  };

  /**
   * Initialisation des données
   */
  useEffect(() => {
    setAllSaleFlights(saleFlights);
    setAllPresaleFlights(presaleFlights);
    setFilteredFlights(saleFlights);
  }, []);

  // Calcul des données de pagination
  const indexOfLastFlight = currentPage * itemsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - itemsPerPage;
  const currentFlights = filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <NavbarSE />

      {/* Section Hero */}
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
        <div className="flex mb-6 gap-15">
          <button
            onClick={() => handleTabChange('sale')}
            className={`text-xl  py-3 rounded-t-lg transition-colors ${activeTab === 'sale'
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
            className={`text-xl py-3 rounded-t-lg transition-colors ${activeTab === 'presale'
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
          <h2 className="text-2xl text-[#b8922e] mb-8">
            {filteredFlights.length} {filteredFlights.length === 1 ? 'flight' : 'flights'}
          </h2>

          {currentFlights.length > 0 ? (
            <>
              <div className="grid gap-8 mb-12">
                {currentFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onMoreInfo={handleMoreInfo}
                    useIntegratedModal={shouldUseIntegratedModal(flight)} // Déterminer dynamiquement
                  />
                ))}
              </div>

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

      {/* Modal FlightDetailsModal - uniquement pour ON SALE */}
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