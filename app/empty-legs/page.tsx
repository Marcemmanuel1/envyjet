"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "../components/NavbarES";
import Footer from "../components/Footer";
import SearchForm from "../components/SearchForm";
import FlightCard from "../components/FlightCard";
import Pagination from "../components/Pagination";
import { useRouter } from 'next/navigation';
import NavbarES from '../components/NavbarES';

/**
 * Interface complète pour représenter un vol Empty Leg
 * Un Empty Leg est un vol de repositionnement d'avion sans passagers
 * qui peut être vendu à prix réduit
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
  codeFrom: string;
  codeTo: string;
  cityFrom: string;
  cityTo: string;
  pricestarting: string; // Indicateur de prix ("Up to", "From", etc.)
}

/**
 * Interface pour les données de date/heure extraites
 */
interface DateTimeInfo {
  date: string;
  time: string;
}

/**
 * Interface pour les données de réservation sauvegardées en session
 */
interface BookingData {
  type: 'oneWay';
  data: {
    from: string;
    to: string;
    departureDate: string;
    departureTime: string;
    passengers: {
      adults: number;
      children: number;
      infants: number;
    };
  };
  timestamp: string;
}

/**
 * Page principale pour la recherche et réservation de vols Empty Legs
 * Les Empty Legs permettent de bénéficier de tarifs réduits sur des vols privés
 * lorsque l'avion doit se repositionner sans passagers
 */
const EmptyLegsPage = () => {
  const router = useRouter();

  // États pour la gestion de la pagination et des données
  const [currentPage, setCurrentPage] = useState(1);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);

  // Configuration de la pagination
  const itemsPerPage = 6;
  const priceIndicator = "From";

  /**
   * Données mockées des vols Empty Legs disponibles
   * En production, ces données viendraient d'une API
   */
  const flightsData: Flight[] = [
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
      pricestarting: priceIndicator
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
      pricestarting: priceIndicator
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
      pricestarting: priceIndicator
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
      pricestarting: priceIndicator
    },
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
      pricestarting: priceIndicator
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
      pricestarting: priceIndicator
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
      pricestarting: priceIndicator
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
      pricestarting: priceIndicator
    }
  ];

  /**
   * Parse une chaîne de date de départ pour extraire la date et l'heure
   * Format d'entrée: "Thu 29 Oct 2026"
   * @param departureString - Chaîne de date au format texte
   * @returns Objet contenant la date au format ISO et l'heure par défaut
   */
  const extractDateTime = (departureString: string): DateTimeInfo => {
    const parts = departureString.split(' ');

    // Validation du format de date
    if (parts.length < 4) {
      console.warn(`Format de date invalide: ${departureString}`);
      return { date: "", time: "" };
    }

    const day = parts[1];
    const month = parts[2];
    const year = parts[3];

    // Mapping des mois pour conversion numérique
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
      time: "12:00" // Heure par défaut pour les Empty Legs
    };
  };

  /**
   * Formate les informations de l'aéroport de départ
   * selon le format attendu par la page de détails
   * @param flight - Objet vol contenant les informations d'aéroport
   * @returns Chaîne formatée "CODE - Ville Airport, Ville"
   */
  const formatAirportString = (flight: Flight): string => {
    return `${flight.codeFrom} - ${flight.cityFrom} Airport, ${flight.cityFrom}`;
  };

  /**
   * Formate les informations de l'aéroport d'arrivée
   * @param flight - Objet vol contenant les informations d'aéroport
   * @returns Chaîne formatée "CODE - Ville Airport, Ville"
   */
  const formatArrivalAirportString = (flight: Flight): string => {
    return `${flight.codeTo} - ${flight.cityTo} Airport, ${flight.cityTo}`;
  };

  /**
   * Gère la navigation vers la page de détails d'un vol
   * Sauvegarde les données de réservation en session storage
   * @param flight - Vol sélectionné pour plus d'informations
   */
  const handleMoreInfo = (flight: Flight): void => {
    try {
      const { date, time } = extractDateTime(flight.departure);

      // Validation des données essentielles
      if (!date || !flight.codeFrom || !flight.codeTo) {
        throw new Error('Données de vol incomplètes');
      }

      // Construction de l'objet de réservation avec la structure exacte attendue
      const bookingData: BookingData = {
        type: 'oneWay',
        data: {
          from: formatAirportString(flight),
          to: formatArrivalAirportString(flight),
          departureDate: date,
          departureTime: time,
          passengers: {
            adults: 1,  // Valeur par défaut
            children: 0,
            infants: 0
          }
        },
        timestamp: new Date().toISOString()
      };

      console.log('Données de réservation préparées:', bookingData);

      // Sauvegarde sécurisée en session storage
      sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

      // Vérification immédiate de la sauvegarde
      const stored = sessionStorage.getItem('bookingData');
      if (!stored) {
        throw new Error('Échec de la sauvegarde en session storage');
      }

      console.log('Vérification du stockage:', JSON.parse(stored));

      // Navigation vers la page de détails
      router.push('/details');

    } catch (error) {
      console.error('Erreur lors de la préparation des données de réservation:', error);
      alert('Une erreur est survenue lors de la préparation de votre réservation. Veuillez réessayer.');
    }
  };

  /**
   * Gère la recherche et le filtrage des vols
   * Applique les filtres sur la liste complète des vols
   * @param filters - Critères de recherche (origine, destination, date, passagers)
   */
  const handleSearch = (filters: { from: string; to: string; date: string; passengers: number }): void => {
    let filtered = [...allFlights]; // Copie pour immutabilité

    // Filtre par aéroport de départ
    if (filters.from.trim()) {
      const searchTerm = filters.from.toLowerCase().trim();
      filtered = filtered.filter(flight =>
        flight.from.toLowerCase().includes(searchTerm) ||
        flight.cityFrom.toLowerCase().includes(searchTerm) ||
        flight.codeFrom.toLowerCase().includes(searchTerm)
      );
    }

    // Filtre par aéroport d'arrivée
    if (filters.to.trim()) {
      const searchTerm = filters.to.toLowerCase().trim();
      filtered = filtered.filter(flight =>
        flight.to.toLowerCase().includes(searchTerm) ||
        flight.cityTo.toLowerCase().includes(searchTerm) ||
        flight.codeTo.toLowerCase().includes(searchTerm)
      );
    }

    // Filtre par date de départ
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

    // Application des résultats filtrés
    setFilteredFlights(filtered);
    setCurrentPage(1); // Retour à la première page après recherche
  };

  /**
   * Gère le changement de page de la pagination.
   * Fait défiler la fenêtre vers le haut pour une meilleure UX.
   * @param newPage - Le nouveau numéro de page à afficher.
   */
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    // Défilement de la fenêtre vers le haut sans recharger la page
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Défilement fluide
    });
  };

  /**
   * Initialisation des données au chargement du composant
   * Simule le chargement depuis une API
   */
  useEffect(() => {
    setAllFlights(flightsData);
    setFilteredFlights(flightsData);
  }, []);

  // Calcul des données de pagination
  const indexOfLastFlight = currentPage * itemsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - itemsPerPage;
  const currentFlights = filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <NavbarES />

      {/* Section Hero avec image de fond et overlay */}
      <div
        className="relative bg-cover bg-center md:h-96 pt-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1600&h=600&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-800/50"></div>

        <div className="relative container px-4 md:px-0 mx-auto h-full flex flex-col justify-center">
          <h1 className="text-3xl text-center md:text-left md:text-2xl text-white mb-4">
            EMPTY LEGS CHARTER FLIGHTS
          </h1>

          <p className="text-lg text-white/90 max-w-full md:mb-8 text-justify">
            Booking an empty leg flight allows you to benefit from exceptionally reduced rates
            while enjoying the luxury and comfort of a private jet.
          </p>

          {/* Composant de recherche */}
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      {/* Section des résultats */}
      <div className="container mx-auto md:px-0 px-4 py-12">
        <div className="max-w-full mx-auto">
          {/* En-tête avec compteur de résultats */}
          <h2 className="text-2xl text-[#b8922e] mb-8">
            {filteredFlights.length} {filteredFlights.length === 1 ? 'Matche' : 'Matches'}
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
                  onPageChange={handlePageChange} // Utilisation du nouveau gestionnaire
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredFlights.length}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No Matches found matching your search criteria.
              </p>
              <p className="text-gray-500 mt-2">
                Try adjusting your search filters or browse all available Matches.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EmptyLegsPage;