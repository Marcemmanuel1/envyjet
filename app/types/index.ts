// types/index.ts

export interface Airport {
  id: number;
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
  latitude: number;
  longitude: number;
  altitude: number;
  precision: number;
  dst: string;
  timezone: string;
  type: string;
  source: string;
  cntr_code: string;
  full_name: string;
  deleted_at: string | null;
}
export interface Flight {
  id: number;
  departure: string;
  departureTime: string;
  from: string;
  to: string;
  aircraft: string;
  type: string;
  capacity: number;
  price: number;
  nbSeats: number | null;
  cost: number;
  image: string;
  codeFrom: string;
  codeTo: string;
  cityFrom: string;
  cityTo: string;
  pricestarting: string;
  interior_photo?: string;
  cabin_layout?: string;
  exterior_photo?: string;
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
  fromId?: number | null;
  toId?: number | null;
  departureDate: string;
  departureTime: string;
  passengers: PassengerData;
  pets: PetData;
  luggage: LuggageData;
}

export interface FlightLeg {
  from: string;
  to: string;
  fromId?: number | null;
  toId?: number | null;
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
  airportId?: number | null;
  onAirportIdChange?: (id: number | null) => void;
}
