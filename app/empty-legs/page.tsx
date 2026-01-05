"use client";
import { API_BASE_URL } from '../config/api';
import React, { useState, useEffect } from 'react';
import NavbarES from '../components/NavbarES';
import Footer from "../components/Footer";
import SearchForm from "../components/SearchForm";
import FlightCard from "../components/FlightCard";
import Pagination from "../components/Pagination";
import { Flight } from '../types';

interface ApiResponse {
  code: number;
  flight: Flight[];
}

const EmptyLegsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 6;

  // Fetch empty legs from API
  const fetchEmptyLegs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/envy/emptyLegs`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.code === 200 && Array.isArray(data.flight)) {
        setAllFlights(data.flight);
        setFilteredFlights(data.flight);

        if (data.flight.length === 0) {
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

  // Handle search with filters
  const handleSearch = (filters: {
    from: string;
    to: string;
    date: string;
    passengers: number
  }) => {
    let filtered = [...allFlights];

    // Helper function to extract airport code
    const extractAirportCode = (airportString: string): string => {
      if (!airportString) return '';
      const match = airportString.match(/\(([A-Z]{3})\)/);
      return match ? match[1] : '';
    };

    // Helper function to extract city
    const extractCity = (airportString: string): string => {
      if (!airportString) return '';
      const parts = airportString.split(',');
      if (parts.length >= 2) {
        return parts[1].trim().split('(')[0].trim();
      }
      return parts[0].trim();
    };

    // Filter by departure location
    if (filters.from.trim()) {
      const searchTerm = filters.from.toLowerCase().trim();
      filtered = filtered.filter(flight => {
        const fromLower = flight.from.toLowerCase();
        const cityFrom = extractCity(flight.from).toLowerCase();
        const codeFrom = extractAirportCode(flight.from).toLowerCase();

        return fromLower.includes(searchTerm) ||
          cityFrom.includes(searchTerm) ||
          codeFrom.includes(searchTerm);
      });
    }

    // Filter by arrival location
    if (filters.to.trim()) {
      const searchTerm = filters.to.toLowerCase().trim();
      filtered = filtered.filter(flight => {
        const toLower = flight.to.toLowerCase();
        const cityTo = extractCity(flight.to).toLowerCase();
        const codeTo = extractAirportCode(flight.to).toLowerCase();

        return toLower.includes(searchTerm) ||
          cityTo.includes(searchTerm) ||
          codeTo.includes(searchTerm);
      });
    }

    // Filter by date
    if (filters.date) {
      const searchDate = new Date(filters.date);
      searchDate.setHours(0, 0, 0, 0);

      filtered = filtered.filter(flight => {
        if (!flight.departureTime) return false;

        const flightDate = new Date(flight.departureTime);
        flightDate.setHours(0, 0, 0, 0);

        return flightDate.getTime() === searchDate.getTime();
      });
    }

    // Filter by number of passengers
    if (filters.passengers > 0) {
      filtered = filtered.filter(flight => {
        if (flight.nbSeats === null) return true; // Include flights with unknown capacity
        return flight.nbSeats >= filters.passengers;
      });
    }

    setFilteredFlights(filtered);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch flights on component mount
  useEffect(() => {
    fetchEmptyLegs();
  }, []);

  // Calculate pagination
  const indexOfLastFlight = currentPage * itemsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - itemsPerPage;
  const currentFlights = filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <NavbarES />

      {/* Hero Section */}
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

      {/* Main Content */}
      <div className="container mx-auto md:px-0 px-4 py-12">
        <div className="max-w-full mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b8922e] mb-4"></div>
              <p className="text-gray-600">Loading empty legs...</p>
            </div>
          )}

          {/* Error State */}
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

          {/* Results */}
          {!loading && !error && (
            <>
              <h2 className="text-2xl text-[#b8922e] mb-8">
                {filteredFlights.length} {filteredFlights.length === 1 ? 'Match' : 'Matches'}
              </h2>

              {currentFlights.length > 0 ? (
                <>
                  {/* Flight Cards Grid */}
                  <div className="grid gap-8 mb-12">
                    {currentFlights.map((flight) => (
                      <FlightCard
                        key={flight.id}
                        flight={flight}
                        useIntegratedModal={true}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
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