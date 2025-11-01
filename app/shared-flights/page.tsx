"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchForm from "../components/SearchForm";
import FlightCard from "../components/FlightCard";
import Pagination from "../components/Pagination";
import FlightDetailsModal from "../components/FlightDetailsModal";
import { useRouter } from 'next/navigation';

// Interface Flight MISE À JOUR pour inclure 'pricestarting' (requis par FlightCard)
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
  codeFrom: string; // Code de l'aéroport de départ
  codeTo: string;   // Code de l'aéroport d'arrivée
  cityFrom: string; // Ville de départ
  cityTo: string;   // Ville d'arrivée
  pricestarting: string; // REQUIS
}

const SharedFlightsPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [allSaleFlights, setAllSaleFlights] = useState<Flight[]>([]);
  const [allPresaleFlights, setAllPresaleFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [activeTab, setActiveTab] = useState<'sale' | 'presale'>('sale');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 6;
  const pricestarting = "Price up to"; // La valeur par défaut pour la propriété 'pricestarting'

  // Données d'exemple pour les vols ON SALE avec la propriété 'pricestarting'
  // Données d'exemple pour les vols ON SALE avec la propriété 'pricestarting'
  const saleFlights: Flight[] = [
    {
      id: 1,
      departure: 'Thu 29 Oct 2026', // Ancien: Wed 29 Oct 2025
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
      pricestarting: pricestarting // INCLUS DANS L'OBJET FLIGHT
    },
    {
      id: 2,
      departure: 'Thu 29 Oct 2026', // Ancien: Wed 29 Oct 2025
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
      pricestarting: pricestarting // INCLUS DANS L'OBJET FLIGHT
    },
    {
      id: 3,
      departure: 'Fri 30 Oct 2026', // Ancien: Thu 30 Oct 2025
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
      pricestarting: pricestarting // INCLUS DANS L'OBJET FLIGHT
    },
    {
      id: 4,
      departure: 'Fri 30 Oct 2026', // Ancien: Thu 30 Oct 2025
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
      pricestarting: pricestarting // INCLUS DANS L'OBJET FLIGHT
    }
  ];

  // Données d'exemple pour les vols ON PRESALE avec la propriété 'pricestarting'
  const presaleFlights: Flight[] = [
    {
      id: 5,
      departure: 'Sat 31 Oct 2026', // Ancien: Fri 31 Oct 2025
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
      pricestarting: pricestarting // INCLUS DANS L'OBJET FLIGHT
    },
    {
      id: 6,
      departure: 'Sat 31 Oct 2026', // Ancien: Fri 31 Oct 2025
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
      pricestarting: pricestarting // INCLUS DANS L'OBJET FLIGHT
    },
    {
      id: 7,
      departure: 'Sun 01 Nov 2026', // Ancien: Sat 01 Nov 2025
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
      pricestarting: pricestarting // INCLUS DANS L'OBJET FLIGHT
    },
    {
      id: 8,
      departure: 'Sun 01 Nov 2026', // Ancien: Sat 01 Nov 2025
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
      pricestarting: pricestarting // INCLUS DANS L'OBJET FLIGHT
    }
  ];

  // Fonction pour extraire la date et l'heure (non utilisée directement dans le rendu des cartes mais dans handleNext)
  const extractDateTime = (departureString: string) => {
    const parts = departureString.split(' ');
    if (parts.length >= 4) {
      const day = parts[1];
      const month = parts[2];
      const year = parts[3];

      const months: { [key: string]: string } = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
      };

      return {
        date: `${year}-${months[month]}-${day.padStart(2, '0')}`,
        time: "10:00:00"
      };
    }
    return { date: "", time: "" };
  };

  // Fonction pour gérer le clic sur "MORE INFO"
  const handleMoreInfo = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsModalOpen(true);
  };

  // Fonction pour fermer la modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFlight(null);
  };

  // Fonction pour gérer le bouton "Next" dans la modal
  const handleNext = (flightData: any) => {
    try {
      // Créer l'objet bookingData avec les informations séparées
      const bookingData = {
        type: 'oneWay' as const,
        data: {
          // Informations de vol de base (gardées pour compatibilité)
          from: flightData.from,
          to: flightData.to,
          departureDate: flightData.date,
          departureTime: flightData.time,

          // Nouvelles informations séparées pour l'affichage
          codeFrom: flightData.codeFrom,
          codeTo: flightData.codeTo,
          cityFrom: flightData.cityFrom,
          cityTo: flightData.cityTo,

          // Informations sur les passagers
          passengers: {
            adults: flightData.passengers?.adults || 1,
            children: flightData.passengers?.children || 0,
            infants: flightData.passengers?.infants || 0
          },

          // Informations supplémentaires
          aircraft: flightData.aircraft,
          type: flightData.type,
          capacity: flightData.capacity,
          price: flightData.price,
          totalCost: flightData.totalCost,

          // Animaux et bagages
          pets: flightData.pets || { small: 0, large: 0 },
          baggage: flightData.baggage || { cabin: 0, checked: 0, skis: 0, golf: 0, other: 0 }
        },
        timestamp: new Date().toISOString()
      };

      console.log('Données de réservation sauvegardées:', bookingData);

      // Stocker avec la clé correcte pour la page Details
      sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

      // Vérification
      const stored = sessionStorage.getItem('bookingData');
      console.log('Vérification du stockage:', stored ? JSON.parse(stored) : 'Aucune donnée');

      setIsModalOpen(false);
      setSelectedFlight(null);
      router.push('/details');

    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  // Fonction de recherche qui cherche dans tous les vols
  const handleSearch = (filters: { from: string; to: string; date: string; passengers: number }) => {
    const allFlights = [...allSaleFlights, ...allPresaleFlights];
    let filtered = allFlights;

    // Si tous les filtres sont vides, on désactive le mode recherche
    if (!filters.from && !filters.to && !filters.date) {
      setIsSearchActive(false);
      const currentFlights = activeTab === 'sale' ? allSaleFlights : allPresaleFlights;
      setFilteredFlights(currentFlights);
      setCurrentPage(1);
      return;
    }

    // Activer le mode recherche
    setIsSearchActive(true);

    if (filters.from) {
      filtered = filtered.filter(flight =>
        flight.from.toLowerCase().includes(filters.from.toLowerCase())
      );
    }

    if (filters.to) {
      filtered = filtered.filter(flight =>
        flight.to.toLowerCase().includes(filters.to.toLowerCase())
      );
    }

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

    // NE PAS filtrer par onglet actif - afficher tous les résultats
    setFilteredFlights(filtered);
    setCurrentPage(1);
  };

  // Fonction pour changer d'onglet
  const handleTabChange = (tab: 'sale' | 'presale') => {
    setActiveTab(tab);

    // Si une recherche est active, ne pas changer les résultats
    if (isSearchActive) {
      return;
    }

    // Sinon, afficher les vols de l'onglet sélectionné
    const currentFlights = tab === 'sale' ? allSaleFlights : allPresaleFlights;
    setFilteredFlights(currentFlights);
    setCurrentPage(1);
  };

  // Charger les données initiales
  useEffect(() => {
    setAllSaleFlights(saleFlights);
    setAllPresaleFlights(presaleFlights);
    setFilteredFlights(saleFlights);
  }, []);

  // Calculer les vols à afficher
  const indexOfLastFlight = currentPage * itemsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - itemsPerPage;
  const currentFlights = filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center md:h-96 pt-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1600&h=600&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-800/50"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-3xl text-center md:text-left md:text-2xl text-white mb-4">
            SHARED CHARTER FLIGHTS
          </h1>
          <p className="text-lg text-white/90 max-w-3xl md:mb-8 text-justify">
            You enjoy the luxury and comfort of a private jet at a fraction of the usual cost by sharing the expenses with other passengers, while benefiting from networking opportunities and professional connections that enrich your travel experience.
          </p>

          {/* Search Form */}
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Message de recherche active */}
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

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => handleTabChange('sale')}
            className={`text-xl px-6 py-3 rounded-t-lg transition-colors ${activeTab === 'sale'
              ? 'text-[#b8922e] border-b-2 border-[#b8922e] font-semibold'
              : 'text-gray-400 hover:text-gray-600'
              } ${isSearchActive ? 'opacity-50' : ''}`}
            disabled={isSearchActive}
          >
            ON SALE
          </button>
          <button
            onClick={() => handleTabChange('presale')}
            className={`text-xl px-6 py-3 rounded-t-lg transition-colors ${activeTab === 'presale'
              ? 'text-[#b8922e] border-b-2 border-[#b8922e] font-semibold'
              : 'text-gray-400 hover:text-gray-600'
              } ${isSearchActive ? 'opacity-50' : ''}`}
            disabled={isSearchActive}
          >
            ON PRESALE
          </button>
        </div>

        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl text-[#b8922e] mb-8">
            {filteredFlights.length} flights
          </h2>

          {/* Flights Grid */}
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

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredFlights.length}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No flights found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal des détails du vol */}
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