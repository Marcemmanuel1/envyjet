// app/details/page.tsx
"use client";
import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * Interface pour typer les données du formulaire de contact
 */
interface FormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  weeklyUpdates: boolean;
  acceptTerms: boolean;
}

/**
 * Interface pour les données d'authentification
 */
interface AuthData {
  email: string;
  password: string;
}

/**
 * Interface pour les données de réservation stockées en session
 */
interface BookingData {
  type: 'oneWay' | 'roundTrip' | 'multiLeg';
  data: any;
  timestamp: string;
}

/**
 * Interface pour un aéroport
 */
interface AirportInfo {
  code: string;
  name: string;
  city: string;
  country: string;
  id?: number;
}

/**
 * Interface pour un trajet de vol
 */
interface FlightLeg {
  from: string;
  to: string;
  fromId?: number | null;
  toId?: number | null;
  date: string;
  time: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  pets: {
    small: number;
    large: number;
  };
  luggage: {
    carryOn: number;
    holdLuggage: number;
    skis: number;
    golfBag: number;
    others: number;
  };
}

/**
 * Extrait les informations de l'aéroport depuis la chaîne full_name
 */
const extractAirportInfo = (airportString: string): AirportInfo => {
  if (!airportString) return { code: '', name: '', city: '', country: '' };

  // Exemple: "Port Bouet Airport, Abidjan (ABJ), CI"
  const regex = /^([^,]+),\s*([^()]+)\s*\(([^)]+)\)\s*,\s*([A-Z]{2})$/;
  const match = airportString.match(regex);

  if (match) {
    return {
      name: match[1].trim(), // "Port Bouet Airport"
      city: match[2].trim(), // "Abidjan" - SEULEMENT LA VILLE
      code: match[3].trim(), // "ABJ"
      country: match[4].trim() // "CI"
    };
  }

  // Fallback si le format n'est pas reconnu
  return {
    code: '',
    name: airportString,
    city: airportString,
    country: ''
  };
};

/**
 * Extrait SEULEMENT la ville pour l'affichage
 */
const getCityOnly = (airportString: string): string => {
  const info = extractAirportInfo(airportString);
  return info.city || airportString;
};

/**
 * Extrait l'ID de l'aéroport depuis les données de réservation
 */
const extractAirportId = (airportData: any): number | null => {
  if (!airportData) return null;

  // Si c'est un objet avec un ID
  if (typeof airportData === 'object' && airportData.id) {
    return airportData.id;
  }

  // Si c'est juste l'ID numérique
  if (typeof airportData === 'number') {
    return airportData;
  }

  return null;
};

/**
 * Convertit le type technique de vol en libellé utilisateur
 */
const getFlightTypeLabel = (type: 'oneWay' | 'roundTrip' | 'multiLeg'): string => {
  const labels = {
    oneWay: 'ONE-WAY',
    roundTrip: 'ROUND-TRIP',
    multiLeg: 'MULTI-LEG'
  };
  return labels[type] || 'ONE-WAY';
};

/**
 * Composant principal pour la page de finalisation de réservation
 */
export default function Details() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [authData, setAuthData] = useState<AuthData>({
    email: '',
    password: ''
  });

  const [formData, setFormData] = useState<FormData>({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    weeklyUpdates: false,
    acceptTerms: false
  });

  const [country, setCountry] = useState<string>("ci");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [departureCity, setDepartureCity] = useState<string>("Abidjan");
  const [arrivalCity, setArrivalCity] = useState<string>("Mount Vernon");
  const [departureCode, setDepartureCode] = useState<string>("ABJ");
  const [arrivalCode, setArrivalCode] = useState<string>("MBW");
  const [flightType, setFlightType] = useState<string>('ONE-WAY');
  const [flightDate, setFlightDate] = useState<string>("");
  const [flightTime, setFlightTime] = useState<string>("");
  const [passengers, setPassengers] = useState<number>(0);
  const [airportIds, setAirportIds] = useState<{
    departureId?: number | null;
    arrivalId?: number | null;
    legs?: Array<{ fromId?: number | null; toId?: number | null }>;
  }>({});

  /**
   * Fonction pour envoyer l'email de confirmation de demande de vol
   */
  const sendConfirmationEmail = async (userData: FormData, bookingInfo: BookingData) => {
    try {
      // Fonctions utilitaires pour extraire les informations
      const extractAirportCode = (airportString: string): string => {
        if (!airportString) return '';
        const match = airportString.match(/\(([A-Z]{3})\)/);
        return match ? match[1] : '';
      };

      const extractCityOnly = (airportString: string): string => {
        if (!airportString) return '';
        const parts = airportString.split(',');
        if (parts.length >= 2) {
          const cityPart = parts[1].trim();
          return cityPart.replace(/\([^)]*\)/g, '').replace(/,?\s*[A-Z]{2}$/, '').trim();
        }
        return parts[0].trim();
      };

      const formatDate = (dateString: string): string => {
        if (!dateString) return 'Date not available';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Date not available';

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${dayName} ${day} ${month} ${year}`;
      };

      // Générer un numéro de référence unique
      const referenceNumber = `EJ-EX-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

      // Construire le résumé du vol selon le type
      let flightSummaryHtml = '';

      if (bookingInfo.type === 'oneWay') {
        const { from, to, departureDate, departureTime, passengers } = bookingInfo.data;

        const departureCode = extractAirportCode(from);
        const arrivalCode = extractAirportCode(to);
        const departureCity = extractCityOnly(from);
        const arrivalCity = extractCityOnly(to);
        const formattedDate = formatDate(departureDate);
        const totalPassengers = (passengers?.adults || 0) + (passengers?.children || 0) + (passengers?.infants || 0);

        flightSummaryHtml = `
        <p><strong>Leg 1:</strong> ${from} (${departureCode}) - ${to} (${arrivalCode})</p>
        <p>Departing (Local time): ${formattedDate} at ${departureTime} Hours</p>
        <p>Departure City: ${departureCity}</p>
        <p>Arrival City: ${arrivalCity}</p>
        <p>Number of Passengers: ${totalPassengers}</p>
      `;
      } else if (bookingInfo.type === 'roundTrip') {
        const { outbound, return: returnLeg } = bookingInfo.data;

        // Outbound leg
        const outDepartureCode = extractAirportCode(outbound.from);
        const outArrivalCode = extractAirportCode(outbound.to);
        const outDepartureCity = extractCityOnly(outbound.from);
        const outArrivalCity = extractCityOnly(outbound.to);
        const outFormattedDate = formatDate(outbound.date);
        const outPassengers = (outbound.passengers?.adults || 0) + (outbound.passengers?.children || 0) + (outbound.passengers?.infants || 0);

        // Return leg
        const retDepartureCode = extractAirportCode(returnLeg.from);
        const retArrivalCode = extractAirportCode(returnLeg.to);
        const retDepartureCity = extractCityOnly(returnLeg.from);
        const retArrivalCity = extractCityOnly(returnLeg.to);
        const retFormattedDate = formatDate(returnLeg.date);
        const retPassengers = (returnLeg.passengers?.adults || 0) + (returnLeg.passengers?.children || 0) + (returnLeg.passengers?.infants || 0);

        flightSummaryHtml = `
        <p><strong>Leg 1:</strong> ${outbound.from} (${outDepartureCode}) - ${outbound.to} (${outArrivalCode})</p>
        <p>Departing (Local time): ${outFormattedDate} at ${outbound.time} Hours</p>
        <p>Departure City: ${outDepartureCity}</p>
        <p>Arrival City: ${outArrivalCity}</p>
        <p>Number of Passengers: ${outPassengers}</p>
        
        <p style="margin-top: 16px;"><strong>Leg 2:</strong> ${returnLeg.from} (${retDepartureCode}) - ${returnLeg.to} (${retArrivalCode})</p>
        <p>Departing (Local time): ${retFormattedDate} at ${returnLeg.time} Hours</p>
        <p>Departure City: ${retDepartureCity}</p>
        <p>Arrival City: ${retArrivalCity}</p>
        <p>Number of Passengers: ${retPassengers}</p>
      `;
      } else if (bookingInfo.type === 'multiLeg') {
        flightSummaryHtml = bookingInfo.data.legs.map((leg: FlightLeg, index: number) => {
          const departureCode = extractAirportCode(leg.from);
          const arrivalCode = extractAirportCode(leg.to);
          const departureCity = extractCityOnly(leg.from);
          const arrivalCity = extractCityOnly(leg.to);
          const formattedDate = formatDate(leg.date);
          const legPassengers = (leg.passengers?.adults || 0) + (leg.passengers?.children || 0) + (leg.passengers?.infants || 0);

          return `
          <p><strong>Leg ${index + 1}:</strong> ${leg.from} (${departureCode}) - ${leg.to} (${arrivalCode})</p>
          <p>Departing (Local time): ${formattedDate} at ${leg.time} Hours</p>
          <p>Departure City: ${departureCity}</p>
          <p>Arrival City: ${arrivalCity}</p>
          <p>Number of Passengers: ${legPassengers}</p>
          ${index < bookingInfo.data.legs.length - 1 ? '<br/>' : ''}
        `;
        }).join('');
      }

      // Construire le contenu HTML de l'email dans le style du premier exemple
      const emailContent = `
      <div style="min-height: 100vh; background-color: #f3f4f6; padding: 40px 16px; font-family: Arial, sans-serif; color: #374151;">
        <div style="max-width: 672px; margin: 0 auto; background-color: white; border: 1px solid #e5e7eb;">
          <!-- Logo + menu -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-bottom: 1px solid #e5e7eb;">
            <tr>
              <!-- Logo à gauche -->
              <td align="left" style="padding: 24px 32px;">
                <img
                  src="https://sp-p6.com/marcemmanuel/logo-envyjet/logo_mobile.png"
                  alt="EnvyJet"
                  width="120"
                  style="display:block; height:auto;"
                />
              </td>
              <!-- Liens à droite -->
              <td align="right" style="padding: 24px 32px; font-weight: 600; font-size: 12px; color: #1e40af;">
                <a
                  href="https://envyjet.com/shared-flights"
                  style="color:#1e40af; text-decoration:none; margin-right:24px;"
                >
                  SHARED FLIGHTS
                </a>
                <a
                  href="https://envyjet.com/empty-legs"
                  style="color:#1e40af; text-decoration:none; margin-right:24px;"
                >
                  EMPTY LEGS
                </a>
                <a
                  href="https://envyjet.com/contact"
                  style="color:#1e40af; text-decoration:none;"
                >
                  CONTACT US
                </a>
              </td>
            </tr>
          </table>
          
          <!-- Body -->
          <div style="padding: 32px;">
            <p>Dear <strong>${userData.firstName} ${userData.lastName}</strong>,</p>
            
            <p style="margin-top: 16px;">
              Thank you, we have received your flight request
            </p>
            
            <p style="margin-top: 16px;">
              Your EnvyJet flight reference is: <strong>${referenceNumber}</strong>
            </p>
            
            <p style="margin-top: 24px; font-weight: 600;">Requested Flight Details:</p>
            
            <div style="margin-top: 8px; padding: 16px; background-color: #f9fafb;">
              <p style="font-weight: 600; color: #374151;">FLIGHT SUMMARY</p>
              <div style="margin-top: 8px;">
                ${flightSummaryHtml}
              </div>
            </div>
            
            <hr style="margin: 24px 0; border-color: #e5e7eb;" />
            
            <div>
              <p style="font-weight: 600; margin-bottom: 8px;">Next steps:</p>
              <ul style="list-style-type: disc; padding-left: 20px; margin-top: 8px;">
                <li>We'll call you to discuss the details of your flight</li>
                <li>Your flight will be submitted to our accredited network</li>
                <li>You will receive live flight prices shortly</li>
              </ul>
            </div>
            
            <p style="margin-top: 24px;">
              If you have any questions, please contact us on +225 07 59 10 25 03 (24 hours) or you can access your account online:
            </p>
            
            <div style="margin-top: 24px;">
              <a href="https://envyjet.com/account" style="display: inline-block; background: linear-gradient(to right, #92400e, #d97706); color: white; font-weight: 600; padding: 12px 32px; text-decoration: none; border-radius: 4px;">
                YOUR ENVYJET ACCOUNT
              </a>
            </div>
            
            <p style="margin-top: 32px;">
              Kind regards
              <br />
              The EnvyJet Team
              <br />
              www.envyjet.com
            </p>
            
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
              <p>
                We are available 24 hours a day, 7 days a week; e: sales@envyjet.com t: +225 07 59 10 25 03
                <br />
                Prices are subject to availability and correct at time of sending. All details provided by you will be held by EnvyJet Sarl and used in accordance with our Privacy Policy and Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

      // Envoyer l'email via l'API
      const emailResponse = await fetch(`${API_BASE_URL}/api/send-mail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: userData.address, // Utiliser 'address' qui contient l'email
          subject: `EnvyJet Flight Enquiry: ${referenceNumber}`,
          content: emailContent
        }),
      });

      if (!emailResponse.ok) {
        console.error('Email sending failed:', await emailResponse.text());
        // Ne pas échouer la soumission principale si l'email échoue
      } else {
        console.log('Confirmation email sent successfully');
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Ne pas bloquer le flux principal si l'email échoue
    }
  };

  /**
   * VÉRIFICATION D'ACCÈS
   */
  useEffect(() => {
    const checkAccess = () => {
      const storedData = sessionStorage.getItem('bookingData');

      if (!storedData) {
        console.warn('Accès non autorisé: aucune donnée de réservation trouvée');
        router.push('/');
        return;
      }

      try {
        const parsed: BookingData = JSON.parse(storedData);

        const timestamp = new Date(parsed.timestamp).getTime();
        const now = new Date().getTime();
        const oneHour = 60 * 60 * 1000;

        if (now - timestamp > oneHour) {
          console.warn('Accès non autorisé: données de réservation expirées');
          sessionStorage.removeItem('bookingData');
          router.push('/');
          return;
        }

        const hasValidData =
          parsed.type &&
          parsed.data &&
          (
            (parsed.type === 'oneWay' && parsed.data.from && parsed.data.to) ||
            (parsed.type === 'roundTrip' && parsed.data.outbound?.from && parsed.data.outbound?.to) ||
            (parsed.type === 'multiLeg' && parsed.data.legs?.length > 0)
          );

        if (!hasValidData) {
          console.warn('Accès non autorisé: données de réservation invalides');
          sessionStorage.removeItem('bookingData');
          router.push('/');
          return;
        }

        setBookingData(parsed);
        setFlightType(getFlightTypeLabel(parsed.type));

        // Extraire les IDs d'aéroports et les informations de ville
        if (parsed.type === 'oneWay') {
          const { from, to, fromId, toId, departureDate, departureTime, passengers: pass } = parsed.data;

          // Extraire les villes uniquement pour l'affichage
          setDepartureCity(getCityOnly(from));
          setArrivalCity(getCityOnly(to));

          // Extraire les codes IATA
          const departureInfo = extractAirportInfo(from);
          const arrivalInfo = extractAirportInfo(to);
          setDepartureCode(departureInfo.code || '???');
          setArrivalCode(arrivalInfo.code || '???');

          // Stocker les IDs
          setAirportIds({
            departureId: fromId || extractAirportId(parsed.data.fromAirport),
            arrivalId: toId || extractAirportId(parsed.data.toAirport)
          });

          setFlightDate(departureDate);
          setFlightTime(departureTime);
          setPassengers((pass.adults || 0) + (pass.children || 0) + (pass.infants || 0));
        } else if (parsed.type === 'roundTrip') {
          const { outbound } = parsed.data;

          // Extraire les villes uniquement pour l'affichage (on utilise le vol outbound)
          setDepartureCity(getCityOnly(outbound.from));
          setArrivalCity(getCityOnly(outbound.to));

          // Extraire les codes IATA
          const departureInfo = extractAirportInfo(outbound.from);
          const arrivalInfo = extractAirportInfo(outbound.to);
          setDepartureCode(departureInfo.code || '???');
          setArrivalCode(arrivalInfo.code || '???');

          // Stocker les IDs pour les deux vols
          setAirportIds({
            departureId: outbound.fromId || extractAirportId(outbound.fromAirport),
            arrivalId: outbound.toId || extractAirportId(outbound.toAirport)
          });

          setFlightDate(outbound.date);
          setFlightTime(outbound.time);
          setPassengers((outbound.passengers.adults || 0) + (outbound.passengers.children || 0) + (outbound.passengers.infants || 0));
        } else if (parsed.type === 'multiLeg') {
          const firstLeg = parsed.data.legs[0];
          if (firstLeg) {
            // Extraire les villes uniquement pour l'affichage (premier trajet)
            setDepartureCity(getCityOnly(firstLeg.from));
            setArrivalCity(getCityOnly(firstLeg.to));

            // Extraire les codes IATA
            const departureInfo = extractAirportInfo(firstLeg.from);
            const arrivalInfo = extractAirportInfo(firstLeg.to);
            setDepartureCode(departureInfo.code || '???');
            setArrivalCode(arrivalInfo.code || '???');

            // Stocker les IDs pour tous les trajets
            const legsIds = parsed.data.legs.map((leg: any) => ({
              fromId: leg.fromId || extractAirportId(leg.fromAirport),
              toId: leg.toId || extractAirportId(leg.toAirport)
            }));
            setAirportIds({ legs: legsIds });

            setFlightDate(firstLeg.date);
            setFlightTime(firstLeg.time);
            setPassengers((firstLeg.passengers.adults || 0) + (firstLeg.passengers.children || 0) + (firstLeg.passengers.infants || 0));
          }
        }

        setIsAuthorized(true);
        setIsLoading(false);

      } catch (error) {
        console.error('Erreur lors de la vérification de l\'accès:', error);
        sessionStorage.removeItem('bookingData');
        router.push('/');
      }
    };

    checkAccess();
  }, [router]);

  /**
   * DÉTECTION AUTOMATIQUE DU PAYS
   */
  useEffect(() => {
    if (!isAuthorized) return;

    const detectCountry = async (): Promise<void> => {
      try {
        const response = await fetch("https://ipapi.co/json/");

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data?.country_code && typeof data.country_code === 'string') {
          setCountry(data.country_code.toLowerCase());
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Détection du pays échouée:", error);
        }
      }
    };

    detectCountry();
  }, [isAuthorized]);

  /**
   * Gestionnaire générique pour les champs de formulaire
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prevState => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /**
   * Gestionnaire spécialisé pour le champ téléphone
   */
  const handlePhoneChange = (value: string): void => {
    setFormData(prevState => ({
      ...prevState,
      phone: value,
    }));
  };

  /**
   * Gestionnaire pour le formulaire d'authentification
   */
  const handleAuthInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setAuthData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Soumission du formulaire d'authentification
   */
  const handleAuthSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log('Login:', authData);
    setShowAuth(false);
    setAuthData({
      email: '',
      password: ''
    });
  };

  /**
   * Transformation des données de réservation au format API avec les IDs corrects
   */
  const transformBookingDataToAPIFormat = () => {
    if (!bookingData) return null;

    // Vérifier que tous les IDs nécessaires sont disponibles
    if (bookingData.type === 'oneWay') {
      if (!airportIds.departureId || !airportIds.arrivalId) {
        setErrorMessage("Airport IDs are missing. Please make sure airports are properly selected.");
        return null;
      }
    } else if (bookingData.type === 'roundTrip') {
      if (!airportIds.departureId || !airportIds.arrivalId) {
        setErrorMessage("Airport IDs are missing. Please make sure airports are properly selected.");
        return null;
      }
    } else if (bookingData.type === 'multiLeg') {
      if (!airportIds.legs || airportIds.legs.some(leg => !leg.fromId || !leg.toId)) {
        setErrorMessage("Airport IDs are missing for one or more legs. Please make sure all airports are properly selected.");
        return null;
      }
    }

    const customerDetails = {
      title: formData.title,
      firstname: formData.firstName,
      lastname: formData.lastName,
      address: formData.address,
      phonenumber: formData.phone,
      receivemails: formData.weeklyUpdates ? "1" : "0"
    };

    const legs: any[] = [];

    if (bookingData.type === 'oneWay') {
      const { from, to, departureDate, departureTime, passengers, pets, luggage } = bookingData.data;

      legs.push({
        origine_id: airportIds.departureId, // Utiliser l'ID stocké
        origine: from, // Conserver le full_name original
        destination_id: airportIds.arrivalId, // Utiliser l'ID stocké
        destination: to, // Conserver le full_name original
        date_heure_depart: `${departureDate} ${departureTime}:00`,
        departureTime: departureTime,
        nb_adults: passengers?.adults || 1,
        nb_children: passengers?.children || 0,
        nb_infant: passengers?.infants || 0,
        nb_carry_on_luggage: luggage?.carryOn || 0,
        nb_hold_luggage: luggage?.holdLuggage || 0,
        nb_skis: luggage?.skis || 0,
        nb_golf_bag: luggage?.golfBag || 0,
        nb_others_luggage: luggage?.others || 0,
        nb_small_pets: pets?.small || 0,
        nb_large_pets: pets?.large || 0,
      });
    } else if (bookingData.type === 'roundTrip') {
      const { outbound, return: returnLeg } = bookingData.data;

      // Outbound leg
      legs.push({
        origine_id: airportIds.departureId, // Utiliser l'ID stocké (from du outbound)
        origine: outbound.from,
        destination_id: airportIds.arrivalId, // Utiliser l'ID stocké (to du outbound)
        destination: outbound.to,
        date_heure_depart: `${outbound.date} ${outbound.time}:00`,
        departureTime: outbound.time,
        nb_adults: outbound.passengers?.adults || 1,
        nb_children: outbound.passengers?.children || 0,
        nb_infant: outbound.passengers?.infants || 0,
        nb_carry_on_luggage: outbound.luggage?.carryOn || 0,
        nb_hold_luggage: outbound.luggage?.holdLuggage || 0,
        nb_skis: outbound.luggage?.skis || 0,
        nb_golf_bag: outbound.luggage?.golfBag || 0,
        nb_others_luggage: outbound.luggage?.others || 0,
        nb_small_pets: outbound.pets?.small || 0,
        nb_large_pets: outbound.pets?.large || 0,
      });

      // Return leg - les IDs sont inversés
      legs.push({
        origine_id: airportIds.arrivalId, // Utiliser l'ID arrival (qui devient le départ du retour)
        origine: returnLeg.from,
        destination_id: airportIds.departureId, // Utiliser l'ID departure (qui devient l'arrivée du retour)
        destination: returnLeg.to,
        date_heure_depart: `${returnLeg.date} ${returnLeg.time}:00`,
        departureTime: returnLeg.time,
        nb_adults: returnLeg.passengers?.adults || 1,
        nb_children: returnLeg.passengers?.children || 0,
        nb_infant: returnLeg.passengers?.infants || 0,
        nb_carry_on_luggage: returnLeg.luggage?.carryOn || 0,
        nb_hold_luggage: returnLeg.luggage?.holdLuggage || 0,
        nb_skis: returnLeg.luggage?.skis || 0,
        nb_golf_bag: returnLeg.luggage?.golfBag || 0,
        nb_others_luggage: returnLeg.luggage?.others || 0,
        nb_small_pets: returnLeg.pets?.small || 0,
        nb_large_pets: returnLeg.pets?.large || 0,
      });
    } else if (bookingData.type === 'multiLeg' && bookingData.data.legs && airportIds.legs) {
      bookingData.data.legs.forEach((leg: FlightLeg, index: number) => {
        const legIds = airportIds.legs![index];

        if (!legIds?.fromId || !legIds?.toId) {
          throw new Error(`Missing airport IDs for leg ${index + 1}`);
        }

        legs.push({
          origine_id: legIds.fromId,
          origine: leg.from,
          destination_id: legIds.toId,
          destination: leg.to,
          date_heure_depart: `${leg.date} ${leg.time}:00`,
          departureTime: leg.time,
          nb_adults: leg.passengers?.adults || 1,
          nb_children: leg.passengers?.children || 0,
          nb_infant: leg.passengers?.infants || 0,
          nb_carry_on_luggage: leg.luggage?.carryOn || 0,
          nb_hold_luggage: leg.luggage?.holdLuggage || 0,
          nb_skis: leg.luggage?.skis || 0,
          nb_golf_bag: leg.luggage?.golfBag || 0,
          nb_others_luggage: leg.luggage?.others || 0,
          nb_small_pets: leg.pets?.small || 0,
          nb_large_pets: leg.pets?.large || 0,
        });
      });
    }

    return {
      customer: customerDetails,
      legs: legs
    };
  };

  /**
   * Soumission du formulaire principal avec envoi API
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!isFormValid) {
      setErrorMessage("Please fill all required fields and accept terms & conditions.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSubmitSuccess(false);

    const apiData = transformBookingDataToAPIFormat();

    if (!apiData) {
      setIsSubmitting(false);
      return;
    }

    console.log("Données envoyées à l'API:", JSON.stringify(apiData, null, 2));

    try {
      const apiUrl = `${API_BASE_URL}/api/envy/vol/newsQuotationRequests`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(apiData)
      });

      console.log("Status de la réponse:", response.status);

      let responseData;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
        console.log('Réponse JSON de l\'API:', responseData);
      } else {
        const textResponse = await response.text();
        console.log('Réponse texte de l\'API:', textResponse);
        responseData = { message: textResponse };
      }

      if (!response.ok) {
        const errorMsg = responseData?.message || responseData?.error || 'Erreur lors de la requête vers l\'API';
        console.error('Erreur API détaillée:', responseData);
        throw new Error(errorMsg);
      }

      console.log('Succès! Réponse complète:', responseData);

      // Envoyer l'email de confirmation après succès API
      await sendConfirmationEmail(formData, bookingData!);

      setSubmitSuccess(true);

      // Rediriger après un délai
      setTimeout(() => {
        sessionStorage.removeItem('bookingData');
        router.push('/booking-last-step');
      }, 1500);

    } catch (error) {
      console.error('Erreur complète:', error);
      const errorMsg = error instanceof Error ? error.message : "Erreur lors de l'envoi des informations !";
      setErrorMessage(errorMsg);
      setIsSubmitting(false);
    }
  };

  /**
   * Annulation de la réservation en cours
   */
  const handleCancel = (): void => {
    sessionStorage.removeItem('bookingData');
    router.back();
  };

  /**
   * Validation globale du formulaire
   */
  const isFormValid: boolean = Boolean(
    formData.firstName?.trim() &&
    formData.lastName?.trim() &&
    formData.address?.trim() &&
    formData.phone?.trim() &&
    formData.acceptTerms
  );

  const inputStyles = "w-full px-3 py-2 border text-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const inputStyletitle = "w-full px-3 py-2 border text-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none";
  const labelStyles = "block text-sm font-medium text-gray-700 mb-2";
  const checkboxStyles = "mt-1 w-4 h-4 text-blue-400 border-gray-300 focus:ring-blue-500";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#d3a936] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("images/arriere-plan-envyjet.jpg")' }}
    >
      <Navbar />

      <div className="min-h-screen pt-26 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto gap-0">

            {/* COLONNE GAUCHE : Formulaire */}
            <section className="bg-white min-h-[630px] md:h-[630px] shadow-lg p-8">
              {showAuth ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-bold text-gray-800">
                      Sign In
                    </h1>
                    <button
                      onClick={() => setShowAuth(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-sm mb-6 text-gray-500">or
                    <button
                      onClick={() => setShowAuth(false)}
                      className="text-[#d3a936] hover:text-[#a98c2f] font-semibold underline ml-2 "
                    >
                      Sign up
                    </button>
                  </p>
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="auth-email" className={labelStyles}>
                        Email Address *
                      </label>
                      <input
                        id="auth-email"
                        type="email"
                        name="email"
                        value={authData.email}
                        onChange={handleAuthInputChange}
                        required
                        className={inputStyles}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="auth-password" className={labelStyles}>
                        Password *
                      </label>
                      <input
                        id="auth-password"
                        type="password"
                        name="password"
                        value={authData.password}
                        onChange={handleAuthInputChange}
                        required
                        className={inputStyles}
                        placeholder="Enter your password"
                        minLength={6}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-[#d3a936] hover:bg-[#a98c2f] text-white font-semibold transition duration-200 mt-6"
                    >
                      SIGN IN
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-800 mb-3 ">
                    Enter your details
                  </h1>

                  <p className=" text-sm text-gray-600 mb-6">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setShowAuth(true)}
                      className="text-[#d3a936] hover:text-[#a98c2f] font-semibold underline"
                    >
                      Sign in here
                    </button>
                  </p>

                  {submitSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
                      <p className="font-semibold">Success!</p>
                      <p>Your flight request has been submitted successfully. A confirmation email has been sent to your address.</p>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {errorMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-4 gap-1">
                      <div className="col-span-1">
                        <label htmlFor="title" className={labelStyles}>
                          Title
                        </label>
                        <select
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className={inputStyletitle}
                          disabled={isSubmitting || submitSuccess}
                        >
                          <option value="">Title</option>
                          <option value="mr">Mr</option>
                          <option value="mrs">Mrs</option>
                          <option value="mis">Miss</option>
                          <option value="dr">Dr</option>
                          <option value="prof">Prof</option>
                        </select>
                      </div>

                      <div className="col-span-3">
                        <label htmlFor="firstName" className={labelStyles}>
                          First Name *
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className={inputStyles}
                          placeholder="Enter your first name"
                          disabled={isSubmitting || submitSuccess}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="lastName" className={labelStyles}>
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className={inputStyles}
                        placeholder="Enter your last name"
                        disabled={isSubmitting || submitSuccess}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className={labelStyles}>
                        Email Address *
                      </label>
                      <input
                        id="address"
                        type="email"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className={inputStyles}
                        placeholder="your.email@example.com"
                        disabled={isSubmitting || submitSuccess}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className={labelStyles}>
                        Phone Number *
                      </label>
                      <PhoneInput
                        country={country}
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        inputProps={{
                          id: "phone",
                          required: true,
                          disabled: isSubmitting || submitSuccess
                        }}
                        inputStyle={{
                          width: "100%",
                          height: "40px",
                          color: "#4A5568",
                          ...(isSubmitting || submitSuccess ? { backgroundColor: "#f3f4f6", cursor: "not-allowed" } : {})
                        }}
                        buttonStyle={{
                          height: "40px",
                          color: "#4A5568",
                          ...(isSubmitting || submitSuccess ? { backgroundColor: "#f3f4f6", cursor: "not-allowed" } : {})
                        }}
                        enableLongNumbers
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="weeklyUpdates"
                          name="weeklyUpdates"
                          checked={formData.weeklyUpdates}
                          onChange={handleInputChange}
                          className={checkboxStyles}
                          disabled={isSubmitting || submitSuccess}
                        />
                        <label htmlFor="weeklyUpdates" className="text-sm text-gray-700">
                          Receive our weekly updates and offers free of charge.
                        </label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="acceptTerms"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleInputChange}
                          required
                          className={checkboxStyles}
                          disabled={isSubmitting || submitSuccess}
                        />
                        <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                          By submitting your flight request, you agree to our
                          <a href="/terms" className="text-blue-600 hover:text-blue-800 underline ml-1">
                            Terms and Conditions
                          </a>
                          <span className="mx-1">and</span>
                          <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                            Privacy Policy
                          </a>.
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting || submitSuccess}
                        className="flex-1 py-3 px-4 font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-200 border border-gray-300 disabled:opacity-50"
                      >
                        CANCEL
                      </button>

                      <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting || submitSuccess}
                        className={`
                          flex-1 py-3 px-4 font-semibold text-white transition duration-200
                          ${isFormValid && !isSubmitting && !submitSuccess
                            ? "bg-[#d3a936] hover:bg-[#a98c2f] cursor-pointer"
                            : "bg-[#d3a936] opacity-50 cursor-not-allowed"
                          }
                        `}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : submitSuccess ? (
                          <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Email sent! Redirecting...
                          </span>
                        ) : (
                          "CONFIRM"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </section>

            {/* COLONNE DROITE : Récapitulatif */}
            <section
              className="relative shadow-lg min-h-[600px] hidden lg:block bg-[#1a1a1a]"
            >
              <div className="absolute w-full flex flex-col h-full px-8 py-6">

                <div className="flex items-center justify-between mb-8 px-4 relative">
                  <div className="text-center relative top-[38px]">
                    <p className="text-xl text-white font-bold">{departureCode}</p>
                    <p className="text-sm text-gray-400">{departureCity}</p>
                  </div>

                  <div className="flex-1 relative mx-4">
                    <svg
                      width="100%"
                      height="80"
                      viewBox="0 0 200 80"
                      preserveAspectRatio="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0,70 Q100,-40 200,70"
                        stroke="#d3a936"
                        strokeWidth="2"
                        fill="transparent"
                      />
                    </svg>

                    <div className="absolute top-[1px] left-1/2 transform -translate-x-1/2 rotate-90">
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="white"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                      </svg>
                    </div>

                    <div className="absolute top-[40px] left-1/2 transform -translate-x-1/2 text-center">
                      <p className="text-xs text-white font-medium tracking-widest">{flightType}</p>
                    </div>
                  </div>

                  <div className="text-center relative top-[38px]">
                    <p className="text-xl text-white font-bold">{arrivalCode}</p>
                    <p className="text-sm text-gray-400">{arrivalCity}</p>
                  </div>
                </div>

                {flightDate && flightTime && (
                  <div className="text-center mb-4">
                    <p className="text-white text-sm">
                      <span className="text-gray-400">Date and Time:</span> {new Date(flightDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}, @{flightTime}
                    </p>
                    {passengers > 0 && (
                      <p className="text-white text-sm mt-1">
                        <span className="text-gray-400">Passengers:</span> {passengers}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-center mb-4">
                  <div className="bg-gray-200 text-black rounded-full w-80 h-80 flex flex-col justify-center items-center p-8">
                    <p className="text-sm text-gray-600 mb-2">Quote 1 of 3</p>

                    <h2 className="text-[.6rem] text-center text-gray-800">OPERATOR & AIRCRAFT INFORMATION</h2>

                    <div className="text-center space-y-2 mt-2">
                      <p className="text-[1rem] font-bold text-gray-900">McDan Aviation</p>
                      <p className="text-sm text-green-600 flex items-center justify-center">
                        <span className="mr-1">✓</span> Client Preferred Operator
                      </p>
                      <p className="text-base font-semibold text-gray-800 mt-3">Mid Jet <span className="font-normal text-gray-600">- Hawker 800XP</span></p>
                      <p className="text-sm text-gray-700"><span className="font-semibold">Seats:</span> 8</p>
                      <p className="text-sm text-gray-700"><span className="font-semibold">Manufactured:</span> 2018</p>

                      <div className="mt-4 pt-4 border-t border-gray-400">
                        <p className="text-base font-semibold text-gray-800 mb-2">FLIGHT FEATURES</p>
                        <div className="text-sm text-gray-700 space-y-1">
                          <p className="flex items-center justify-center">
                            <span className="mr-2">🍽️</span> Catering
                          </p>
                          <p className="flex items-center justify-center">
                            <span className="mr-2">🐾</span> Pets allowed
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto px-8">
                  <p className="text-white text-center text-sm leading-relaxed">
                    EnvyJet will share complete operator and aircraft details, along with authentic images of the exact aircraft you'll be flying in.
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}