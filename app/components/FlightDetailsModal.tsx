"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Users, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { MdLuggage, MdPets } from 'react-icons/md';
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
  codeFrom: string;
  codeTo: string;
  cityFrom: string;
  cityTo: string;
}

interface FlightDetailsModalProps {
  flight: Flight;
  onClose: () => void;
  onNext: (flightData: any) => void;
}

const FlightDetailsModal: React.FC<FlightDetailsModalProps> = ({
  flight,
  onClose,
  onNext
}) => {
  const router = useRouter();

  // États pour la gestion des passagers
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // États pour la gestion des animaux
  const [smallPets, setSmallPets] = useState(0);
  const [largePets, setLargePets] = useState(0);

  // États pour la gestion des bagages
  const [cabinBags, setCabinBags] = useState(0);
  const [checkedBags, setCheckedBags] = useState(0);
  const [skis, setSkis] = useState(0);
  const [golfBags, setGolfBags] = useState(0);
  const [otherBags, setOtherBags] = useState(0);

  // Gestion des dropdowns ouverts
  const [openDropdown, setOpenDropdown] = useState<'passengers' | 'pets' | 'baggage' | null>(null);

  // Références pour la détection des clics extérieurs
  const passengersRef = useRef<HTMLDivElement>(null);
  const petsRef = useRef<HTMLDivElement>(null);
  const baggageRef = useRef<HTMLDivElement>(null);

  // Extraction de la date et heure depuis la chaîne de départ
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

  const { date, time } = extractDateTime(flight.departure);

  // Calculs des coûts et totaux
  const occupiedSeats = adults + children;
  const pricePerSeat = flight.price;
  const pricePerInfant = 7500;
  const totalCost = (adults * pricePerSeat) + (children * pricePerSeat) + (infants * pricePerInfant);

  // Fermeture des dropdowns au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (target.nodeName === 'BUTTON' || target.nodeName === 'SPAN') return;

      if (
        passengersRef.current && !passengersRef.current.contains(target) &&
        petsRef.current && !petsRef.current.contains(target) &&
        baggageRef.current && !baggageRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gestion de la soumission vers la page de détails
  const handleNextClick = () => {
    try {
      const bookingData = {
        type: 'oneWay' as const,
        data: {
          from: `${flight.codeFrom} - ${flight.cityFrom}`,
          to: `${flight.codeTo} - ${flight.cityTo}`,
          departureDate: date,
          departureTime: time,
          codeFrom: flight.codeFrom,
          codeTo: flight.codeTo,
          cityFrom: flight.cityFrom,
          cityTo: flight.cityTo,
          passengers: {
            adults: adults,
            children: children,
            infants: infants
          },
          aircraft: flight.aircraft,
          type: flight.type,
          capacity: flight.capacity,
          price: flight.price,
          totalCost: totalCost,
          pets: {
            small: smallPets,
            large: largePets
          },
          baggage: {
            cabin: cabinBags,
            checked: checkedBags,
            skis: skis,
            golf: golfBags,
            other: otherBags
          }
        },
        timestamp: new Date().toISOString()
      };

      sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
      onClose();
      router.push('/details');

    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  // Composant Counter réutilisable
  const Counter = ({
    value,
    onIncrement,
    onDecrement,
    min = 0
  }: {
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    min?: number;
  }) => (
    <div className="flex items-center space-x-3">
      <button
        onClick={onDecrement}
        disabled={value <= min}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        -
      </button>
      <span className="w-8 text-center font-semibold">{value}</span>
      <button
        onClick={onIncrement}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
      >
        +
      </button>
    </div>
  );

  // Composant BaggageItem pour les types de bagages
  const BaggageItem = ({
    label,
    value,
    onIncrement,
    onDecrement
  }: {
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
  }) => (
    <div className="flex items-center justify-between py-2 mb-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <Counter
        value={value}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />
    </div>
  );

  // Totaux pour l'affichage dans les boutons
  const totalPassengers = adults + children + infants;
  const totalPets = smallPets + largePets;
  const totalBaggage = cabinBags + checkedBags + skis + golfBags + otherBags;

  return (
    <div className="fixed inset-0 bg-black/75 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white z-10 max-w-6xl w-full h-[60vh] overflow-y-auto">

        {/* En-tête de la modale */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-[1001]">
          <h2 className="text-2xl font-bold text-gray-800">Flight Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">

            {/* Colonne gauche - Informations et options */}
            <div className="space-y-6">

              {/* Informations du vol */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Flight Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">From:</span> {flight.from}</p>
                  <p><span className="font-semibold">To:</span> {flight.to}</p>
                  <p><span className="font-semibold">Departure:</span> {date} {time}</p>
                  <p><span className="font-semibold">Aircraft:</span> {flight.aircraft}</p>
                  <p><span className="font-semibold">Number of Seats:</span> {flight.capacity}</p>
                  <p><span className="font-semibold">Number of Occupied Seats:</span> {occupiedSeats}</p>
                  <p className="text-lg font-semibold text-[#b8922e]">Flight cost: ${flight.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Sections de configuration */}
              <div className="grid grid-cols-3 gap-3">

                {/* Passagers */}
                <div className="border border-gray-200 relative" ref={passengersRef}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'passengers' ? null : 'passengers')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-full gap-2">
                      <Users className="w-6 h-6 text-[#b8922e]" />
                      {totalPassengers > 0 && (
                        <span className="text-sm font-semibold text-gray-700">
                          {totalPassengers}
                        </span>
                      )}
                    </div>
                    {openDropdown === 'passengers' ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 absolute right-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 absolute right-2" />
                    )}
                  </button>

                  {openDropdown === 'passengers' && (
                    <div className="absolute bottom-full left-0 bg-white border border-gray-200 border-t-0 shadow-lg z-[1000] p-4 space-y-4 mt-2 min-w-[250px] whitespace-nowrap">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Adults</p>
                        </div>
                        <Counter
                          value={adults}
                          onIncrement={() => setAdults(adults + 1)}
                          onDecrement={() => setAdults(Math.max(1, adults - 1))}
                          min={1}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Children</p>
                        </div>
                        <Counter
                          value={children}
                          onIncrement={() => setChildren(children + 1)}
                          onDecrement={() => setChildren(Math.max(0, children - 1))}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Infants</p>
                        </div>
                        <Counter
                          value={infants}
                          onIncrement={() => setInfants(infants + 1)}
                          onDecrement={() => setInfants(Math.max(0, infants - 1))}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Animaux */}
                <div className="border border-gray-200 relative" ref={petsRef}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'pets' ? null : 'pets')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-full gap-2">
                      <MdPets className="w-6 h-6 text-[#b8922e]" />
                      {totalPets > 0 && (
                        <span className="text-sm font-semibold text-gray-700">
                          {totalPets}
                        </span>
                      )}
                    </div>
                    {openDropdown === 'pets' ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 absolute right-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 absolute right-2" />
                    )}
                  </button>

                  {openDropdown === 'pets' && (
                    <div className="absolute bottom-full left-0 bg-white border border-gray-200 border-t-0 shadow-lg z-[1000] p-4 space-y-4 mt-2 w-[200px] whitespace-nowrap">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Small</p>
                        </div>
                        <Counter
                          value={smallPets}
                          onIncrement={() => setSmallPets(smallPets + 1)}
                          onDecrement={() => setSmallPets(Math.max(0, smallPets - 1))}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Large</p>
                        </div>
                        <Counter
                          value={largePets}
                          onIncrement={() => setLargePets(largePets + 1)}
                          onDecrement={() => setLargePets(Math.max(0, largePets - 1))}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bagages */}
                <div className="border border-gray-200 relative" ref={baggageRef}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'baggage' ? null : 'baggage')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-full gap-2">
                      <MdLuggage className="w-6 h-6 text-[#b8922e]" />
                      {totalBaggage > 0 && (
                        <span className="text-sm font-semibold text-gray-700">
                          {totalBaggage}
                        </span>
                      )}
                    </div>
                    {openDropdown === 'baggage' ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 absolute right-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 absolute right-2" />
                    )}
                  </button>

                  {openDropdown === 'baggage' && (
                    <div className="absolute bottom-full right-0 bg-white border border-gray-200 border-t-0 shadow-lg z-[10000] p-4 space-y-2 mt-2 max-h-80 overflow-y-auto min-w-[280px] whitespace-nowrap">
                      <BaggageItem
                        label="En cabine"
                        value={cabinBags}
                        onIncrement={() => setCabinBags(cabinBags + 1)}
                        onDecrement={() => setCabinBags(Math.max(0, cabinBags - 1))}
                      />
                      <BaggageItem
                        label="En soute"
                        value={checkedBags}
                        onIncrement={() => setCheckedBags(checkedBags + 1)}
                        onDecrement={() => setCheckedBags(Math.max(0, checkedBags - 1))}
                      />
                      <BaggageItem
                        label="Skis"
                        value={skis}
                        onIncrement={() => setSkis(skis + 1)}
                        onDecrement={() => setSkis(Math.max(0, skis - 1))}
                      />
                      <BaggageItem
                        label="Sac de golf"
                        value={golfBags}
                        onIncrement={() => setGolfBags(golfBags + 1)}
                        onDecrement={() => setGolfBags(Math.max(0, golfBags - 1))}
                      />
                      <BaggageItem
                        label="Autres"
                        value={otherBags}
                        onIncrement={() => setOtherBags(otherBags + 1)}
                        onDecrement={() => setOtherBags(Math.max(0, otherBags - 1))}
                      />
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Colonne droite - Récapitulatif des frais */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-6">
              <h3 className="text-2xl  text-[#b8922e] ">FEES SUMMARY</h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Number of Occupied Seats:</span>
                  <span className="font-semibold">{occupiedSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per Seat:</span>
                  <span className="font-semibold">${pricePerSeat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per Infant:</span>
                  <span className="font-semibold">${pricePerInfant.toFixed(2)}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>TOTAL COST</span>
                    <span className="text-[#b8922e]">${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNextClick}
                className="w-full md:w-[25%] bg-[#b8922e] hover:bg-[#a58226] text-white font-semibold py-3 px-6 transition-colors"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsModal;