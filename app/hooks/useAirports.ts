// hooks/useAirports.ts

import { useState, useEffect, useCallback } from "react";
import { Airport } from "../types";

export const useAirports = () => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAirports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/airports.json");
        if (!response.ok) {
          throw new Error("Failed to load airports data");
        }
        const data = await response.json();
        setAirports(data);
      } catch (err) {
        console.error("Error loading airports:", err);
        setError("Could not load airports data");
      } finally {
        setLoading(false);
      }
    };

    loadAirports();
  }, []);

  const searchAirports = useCallback(
    (query: string): Airport[] => {
      if (!query || query.length < 2) return [];

      const lowercaseQuery = query.toLowerCase().trim();

      return airports
        .filter((airport) => {
          const iataCode = (airport.iata || "").toLowerCase();
          const icaoCode = (airport.icao || "").toLowerCase();
          const name = (airport.name || "").toLowerCase();
          const city = (airport.city || "").toLowerCase();
          const country = (airport.country || "").toLowerCase();
          const fullName = (airport.full_name || "").toLowerCase();

          return (
            iataCode.includes(lowercaseQuery) ||
            icaoCode.includes(lowercaseQuery) ||
            name.includes(lowercaseQuery) ||
            city.includes(lowercaseQuery) ||
            country.includes(lowercaseQuery) ||
            fullName.includes(lowercaseQuery)
          );
        })
        .sort((a, b) => {
          // Priorité aux aéroports avec code IATA
          if (a.iata && !b.iata) return -1;
          if (!a.iata && b.iata) return 1;

          // Priorité à la correspondance exacte du code IATA
          const aIataMatch = a.iata?.toLowerCase() === lowercaseQuery;
          const bIataMatch = b.iata?.toLowerCase() === lowercaseQuery;
          if (aIataMatch && !bIataMatch) return -1;
          if (!aIataMatch && bIataMatch) return 1;

          // Priorité à la correspondance exacte du code ICAO
          const aIcaoMatch = a.icao?.toLowerCase() === lowercaseQuery;
          const bIcaoMatch = b.icao?.toLowerCase() === lowercaseQuery;
          if (aIcaoMatch && !bIcaoMatch) return -1;
          if (!aIcaoMatch && bIcaoMatch) return 1;

          // Sinon, trier par nom
          return a.name.localeCompare(b.name);
        })
        .slice(0, 10);
    },
    [airports]
  );

  const getAirportByIata = useCallback(
    (iataCode: string): Airport | undefined => {
      return airports.find((airport) => airport.iata === iataCode);
    },
    [airports]
  );

  const getAirportByIcao = useCallback(
    (icaoCode: string): Airport | undefined => {
      return airports.find((airport) => airport.icao === icaoCode);
    },
    [airports]
  );

  const getAirportsByCountry = useCallback(
    (country: string): Airport[] => {
      return airports.filter((airport) =>
        airport.country.toLowerCase().includes(country.toLowerCase())
      );
    },
    [airports]
  );

  return {
    airports,
    loading,
    error,
    searchAirports,
    getAirportByIata,
    getAirportByIcao,
    getAirportsByCountry,
  };
};
