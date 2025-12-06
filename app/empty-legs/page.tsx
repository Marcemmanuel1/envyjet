"use client";

import React, { useState, useEffect } from 'react';
import NavbarES from '../components/NavbarES';
import Footer from "../components/Footer";
import SearchForm from "../components/SearchForm";
import FlightCard from "../components/FlightCard";
import Pagination from "../components/Pagination";

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

interface ApiFlight {
  id: number;
  departureTime: string;
  from: string | null;
  to: string | null;
  cost: number | null;
  nbSeats: number | null;
  interior_photo: string | null;
  cabin_layout: string | null;
}

interface ApiResponse {
  code: number;
  flight: ApiFlight[];
}

const EmptyLegsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 6;
  const priceIndicator = "From";

  // Extract IATA code
  const extractAirportCode = (airportString: string | null): string => {
    if (!airportString) return '';
    const match = airportString.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : '';
  };

  // Extract city
  const extractCity = (airportString: string | null): string => {
    if (!airportString) return '';
    const parts = airportString.split(',');
    if (parts.length >= 2) {
      return parts[1].trim().split('(')[0].trim();
    }
    return '';
  };

  // Format date
  const formatDate = (dateTimeString: string | null): string => {
    if (!dateTimeString) return 'Date not available';
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return 'Date not available';

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName} ${day} ${month} ${year}`;
  };

  // Determine aircraft type
  const getAircraftType = (capacity: number | null): string => {
    if (!capacity || capacity <= 6) return 'Light Jet';
    if (capacity <= 8) return 'Midsize Jet';
    if (capacity <= 12) return 'Super Midsize Jet';
    return 'Heavy Jet';
  };

  // Get aircraft name
  const getAircraftName = (type: string): string => {
    const aircraftMap: Record<string, string[]> = {
      'Light Jet': ['Citation CJ3', 'Learjet 75', 'Phenom 300'],
      'Midsize Jet': ['Citation Sovereign', 'Citation X'],
      'Super Midsize Jet': ['Challenger 350', 'Gulfstream G200'],
      'Heavy Jet': ['Gulfstream G-IV', 'Global 6000', 'Falcon 7X']
    };

    const available = aircraftMap[type] || ['Citation X'];
    return available[Math.floor(Math.random() * available.length)];
  };

  // Transform API data
  const transformApiData = (apiFlights: ApiFlight[]): Flight[] => {
    return apiFlights.map(apiFlight => {
      const aircraftType = getAircraftType(apiFlight.nbSeats);
      const aircraftName = getAircraftName(aircraftType);

      return {
        id: apiFlight.id,
        departure: formatDate(apiFlight.departureTime),
        from: apiFlight.from || 'Airport not specified',
        to: apiFlight.to || 'Airport not specified',
        aircraft: aircraftName,
        type: aircraftType,
        capacity: apiFlight.nbSeats || 0,
        price: apiFlight.cost ?? 0,
        image: apiFlight.interior_photo || 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=300&fit=crop',
        codeFrom: extractAirportCode(apiFlight.from),
        codeTo: extractAirportCode(apiFlight.to),
        cityFrom: extractCity(apiFlight.from),
        cityTo: extractCity(apiFlight.to),
        pricestarting: priceIndicator
      };
    });
  };

  // Fetch empty legs
  const fetchEmptyLegs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://envyjet.com/api/envy/emptyLegs', {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: ApiResponse = await response.json();

      if (data.code === 200 && Array.isArray(data.flight)) {
        const transformedFlights = transformApiData(data.flight);
        setAllFlights(transformedFlights);
        setFilteredFlights(transformedFlights);
        if (transformedFlights.length === 0) {
          setError('No empty legs available at the moment. Please check back later.');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching empty legs:', err);
      setError('Failed to load empty legs. Please try again later.');
      setAllFlights([]);
      setFilteredFlights([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (filters: { from: string; to: string; date: string; passengers: number }) => {
    let filtered = [...allFlights];

    if (filters.from.trim()) {
      const searchTerm = filters.from.toLowerCase().trim();
      filtered = filtered.filter(flight =>
        flight.from.toLowerCase().includes(searchTerm) ||
        flight.cityFrom.toLowerCase().includes(searchTerm) ||
        flight.codeFrom.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.to.trim()) {
      const searchTerm = filters.to.toLowerCase().trim();
      filtered = filtered.filter(flight =>
        flight.to.toLowerCase().includes(searchTerm) ||
        flight.cityTo.toLowerCase().includes(searchTerm) ||
        flight.codeTo.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.date) {
      const searchDateObj = new Date(filters.date);
      searchDateObj.setHours(0, 0, 0, 0);

      filtered = filtered.filter(flight => {
        if (flight.departure === 'Date not available') return false;

        const flightDateStr = flight.departure.split(' ').slice(1).join(' ');
        const months: { [key: string]: string } = {
          'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
          'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
          'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };

        const [day, month, year] = flightDateStr.split(' ');
        const monthNum = months[month];
        if (!monthNum) return false;

        const flightDate = new Date(`${year}-${monthNum}-${day.padStart(2, '0')}`);
        flightDate.setHours(0, 0, 0, 0);

        return flightDate.getTime() === searchDateObj.getTime();
      });
    }

    if (filters.passengers > 0) {
      filtered = filtered.filter(flight => flight.capacity >= filters.passengers);
    }

    setFilteredFlights(filtered);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchEmptyLegs();
  }, []);

  const indexOfLastFlight = currentPage * itemsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - itemsPerPage;
  const currentFlights = filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <NavbarES />

      <div
        className="relative bg-cover bg-center md:h-120 pt-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1600&h=600&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-800/50"></div>

        <div className="relative container px-4 md:px-0 mx-auto h-full flex flex-col justify-center">
          <h1 className="text-3xl md:text-2xl text-center md:text-left text-white mb-4">
            EMPTY LEGS CHARTER FLIGHTS
          </h1>

          <p className="text-lg text-white/90 max-w-full md:mb-8 text-justify">
            Booking an empty leg flight allows you to benefit from exceptionally reduced rates
            while enjoying the luxury and comfort of a private jet.
          </p>

          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      <div className="container mx-auto md:px-0 px-4 py-12">
        <div className="max-w-full mx-auto">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b8922e] mb-4"></div>
              <p className="text-gray-600">Loading empty legs...</p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchEmptyLegs}
                className="px-6 py-2 bg-[#b8922e] text-white rounded-lg hover:bg-[#a07d25] transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <h2 className="text-2xl text-[#b8922e] mb-8">
                {filteredFlights.length} {filteredFlights.length === 1 ? 'Match' : 'Matches'}
              </h2>

              {currentFlights.length > 0 ? (
                <>
                  <div className="grid gap-8 mb-12">
                    {currentFlights.map((flight) => (
                      <FlightCard key={flight.id} flight={flight} useIntegratedModal={true} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
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
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EmptyLegsPage;
