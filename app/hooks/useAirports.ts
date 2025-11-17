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
        const response = await fetch("/world-airports.json");
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
          const iataCode = (airport.iata_code || "").toLowerCase();
          const icaoCode = (airport.icao_code || "").toLowerCase();
          const name = (airport.name || "").toLowerCase();
          const municipality = (airport.municipality || "").toLowerCase();
          const countryName = (airport.country_name || "").toLowerCase();
          const keywords = (airport.keywords || "").toLowerCase();

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
          if (a.iata_code && !b.iata_code) return -1;
          if (!a.iata_code && b.iata_code) return 1;

          const aIataMatch = a.iata_code?.toLowerCase() === lowercaseQuery;
          const bIataMatch = b.iata_code?.toLowerCase() === lowercaseQuery;
          if (aIataMatch && !bIataMatch) return -1;
          if (!aIataMatch && bIataMatch) return 1;

          return b.score - a.score;
        })
        .slice(0, 10);
    },
    [airports]
  );

  return { airports, loading, error, searchAirports };
};
