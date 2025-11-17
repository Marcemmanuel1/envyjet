// types/index.ts

export interface Airport {
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

export interface PetData {
  small: number;
  large: number;
}

export interface LuggageData {
  carryOn: number;
  holdLuggage: number;
  skis: number;
  golfBag: number;
  others: number;
}

export interface PassengerData {
  adults: number;
  children: number;
  infants: number;
}

export interface OneWayFormData {
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  passengers: PassengerData;
  pets: PetData;
  luggage: LuggageData;
}

export interface FlightLeg {
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: PassengerData;
  pets: PetData;
  luggage: LuggageData;
}

export interface RoundTripFormData {
  outbound: FlightLeg;
  return: FlightLeg;
}

export interface MultiLegFormData {
  legs: FlightLeg[];
}

export interface FormProps {
  onSubmit: (data: any) => Promise<void>;
}

export interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

export interface AirportInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onAirportSelect?: (airport: Airport) => void;
}
