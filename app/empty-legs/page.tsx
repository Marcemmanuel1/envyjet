"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchForm from "../components/SearchForm";
import FlightCard from "../components/FlightCard";
import Pagination from "../components/Pagination";
import { useRouter } from 'next/navigation';

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
}

const EmptyLegsPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);

  const itemsPerPage = 6;

  // Données d'exemple pour les vols empty legs
  const flightsData: Flight[] = [
    {
      id: 1,
      departure: 'Wed 29 Oct 2025',
      from: 'Scottsdale, Scottsdale Airport (SDL), AZ, US',
      to: 'Teterboro, Teterboro Airport (TEB), NJ, US',
      aircraft: 'Gulfstream G-IV',
      type: 'Heavy Jet',
      capacity: 14,
      price: 36225,
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      departure: 'Wed 29 Oct 2025',
      from: 'West Palm Beach, Palm Beach International (PBI), FL, US',
      to: 'Jacksonville, Jacksonville International Airport (JAX), FL, US',
      aircraft: 'Citation X',
      type: 'Super Midsize Jet',
      capacity: 8,
      price: 4528,
      image: '/images/avion-un.jpg'
    },
    {
      id: 3,
      departure: 'Thu 30 Oct 2025',
      from: 'Miami, Miami International Airport (MIA), FL, US',
      to: 'New York, Teterboro Airport (TEB), NJ, US',
      aircraft: 'Challenger 350',
      type: 'Super Midsize Jet',
      capacity: 9,
      price: 15750,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      departure: 'Thu 30 Oct 2025',
      from: 'Los Angeles, Van Nuys Airport (VNY), CA, US',
      to: 'Las Vegas, Henderson Executive Airport (HND), NV, US',
      aircraft: 'Learjet 75',
      type: 'Light Jet',
      capacity: 6,
      price: 8900,
      image: '/images/avion-deux.jpg'
    },
    {
      id: 5,
      departure: 'Fri 31 Oct 2025',
      from: 'Chicago, Chicago Midway Airport (MDW), IL, US',
      to: 'Aspen, Aspen-Pitkin County Airport (ASE), CO, US',
      aircraft: 'Citation Sovereign',
      type: 'Midsize Jet',
      capacity: 8,
      price: 18500,
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      departure: 'Fri 31 Oct 2025',
      from: 'Dallas, Dallas Love Field (DAL), TX, US',
      to: 'Houston, William P. Hobby Airport (HOU), TX, US',
      aircraft: 'Phenom 300',
      type: 'Light Jet',
      capacity: 7,
      price: 6200,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop'
    },
    {
      id: 7,
      departure: 'Sat 01 Nov 2025',
      from: 'San Francisco, San Francisco International (SFO), CA, US',
      to: 'Seattle, Boeing Field (BFI), WA, US',
      aircraft: 'Global 6000',
      type: 'Ultra Long Range',
      capacity: 13,
      price: 28900,
      image: 'images/avion-un.jpg'
    },
    {
      id: 8,
      departure: 'Sat 01 Nov 2025',
      from: 'Atlanta, DeKalb-Peachtree Airport (PDK), GA, US',
      to: 'Nashville, Nashville International Airport (BNA), TN, US',
      aircraft: 'Citation CJ3',
      type: 'Light Jet',
      capacity: 6,
      price: 7800,
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=300&fit=crop'
    }
  ];

  // Fonction pour gérer le clic sur "MORE INFO"
  const handleMoreInfo = (flight: Flight) => {
    const extractAirportInfo = (locationString: string) => {
      const parts = locationString.split(', ');
      if (parts.length >= 2) {
        const airportPart = parts[1];
        const codeMatch = airportPart.match(/\(([^)]+)\)/);
        const code = codeMatch ? codeMatch[1] : '';

        return {
          city: parts[0],
          airportName: airportPart.replace(/\([^)]+\)/, '').trim(),
          code: code
        };
      }
      return { city: '', airportName: '', code: '' };
    };

    const fromInfo = extractAirportInfo(flight.from);
    const toInfo = extractAirportInfo(flight.to);

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
          time: "12:00"
        };
      }
      return { date: "", time: "" };
    };

    const { date, time } = extractDateTime(flight.departure);

    const flightDetails = {
      id: flight.id,
      departure: flight.departure,
      from: flight.from,
      to: flight.to,
      aircraft: flight.aircraft,
      type: flight.type,
      capacity: flight.capacity,
      price: flight.price,
      image: flight.image,
      fromInfo: fromInfo,
      toInfo: toInfo,
      passengers: 1,
      date: date,
      time: time
    };

    sessionStorage.setItem('flightDetails', JSON.stringify(flightDetails));
    router.push('/details');
  };

  // Fonction de recherche
  const handleSearch = (filters: { from: string; to: string; date: string; passengers: number }) => {
    let filtered = allFlights;

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

    setFilteredFlights(filtered);
    setCurrentPage(1);
  };

  // Charger les données initiales
  useEffect(() => {
    setAllFlights(flightsData);
    setFilteredFlights(flightsData);
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
            EMPTY LEGS CHARTER FLIGHTS
          </h1>
          <p className="text-lg text-white/90 max-w-3xl md:mb-8 text-justify">
            Booking an empty leg flight allows you to benefit from exceptionally reduced rates while enjoying the luxury and comfort of a private jet.
          </p>

          {/* Search Form */}
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
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
                    onMoreInfo={handleMoreInfo}
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

      <Footer />
    </div>
  );
};

export default EmptyLegsPage;