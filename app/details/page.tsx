"use client";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

/**
 * Interface pour typer les données du formulaire de contact
 * Contient toutes les informations personnelles du client
 */
interface FormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  weeklyUpdates: boolean;
  acceptTerms: boolean;
}

/**
 * Interface pour les données d'authentification
 * Utilisée pour le formulaire de connexion existant
 */
interface AuthData {
  email: string;
  password: string;
}

/**
 * Interface pour les données de réservation stockées en session
 * Représente la sélection de vol faite par l'utilisateur
 */
interface BookingData {
  type: 'oneWay' | 'roundTrip' | 'multiLeg';
  data: any;
  timestamp: string;
}

/**
 * Interface pour structurer les informations d'aéroport
 * Utilisée pour afficher les détails des aéroports de départ et d'arrivée
 */
interface AirportInfo {
  code: string;
  name: string;
  city: string;
}

/**
 * Parse une chaîne d'aéroport pour extraire le code, nom et ville
 * Format attendu: "LHR - London Heathrow Airport, London"
 * @param airportString - Chaîne brute de l'aéroport
 * @returns Objet AirportInfo structuré
 */
const extractAirportInfo = (airportString: string): AirportInfo => {
  if (!airportString) return { code: '', name: '', city: '' };

  // Séparer le code IATA du reste
  const parts = airportString.split('-');
  const code = parts[0]?.trim() || '';

  // Extraire le nom et la ville depuis la partie restante
  const remaining = parts[1]?.trim() || '';
  const cityParts = remaining.split(',');

  const name = cityParts[0]?.trim() || '';
  const city = cityParts[1]?.trim() || cityParts[0]?.trim() || '';

  return { code, name, city };
};

/**
 * Convertit le type technique de vol en libellé utilisateur
 * @param type - Type technique du vol
 * @returns Libellé formaté pour l'affichage
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
 * Gère à la fois l'authentification et la saisie des informations personnelles
 */
export default function Details() {
  const router = useRouter();

  // États de contrôle d'accès et de chargement
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // États des données formulaire
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
    weeklyUpdates: false,
    acceptTerms: false
  });

  // États pour la localisation et les données de vol
  const [country, setCountry] = useState<string>("ci");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [departureInfo, setDepartureInfo] = useState<AirportInfo>({
    code: 'ABJ',
    name: 'Félix-Houphouët-Boigny International Airport',
    city: 'Abidjan'
  });
  const [arrivalInfo, setArrivalInfo] = useState<AirportInfo>({
    code: 'MBW',
    name: 'Mbalmayo Airport',
    city: 'Mount Vernon'
  });
  const [flightType, setFlightType] = useState<string>('ONE-WAY');
  const [flightDate, setFlightDate] = useState<string>("");
  const [flightTime, setFlightTime] = useState<string>("");
  const [passengers, setPassengers] = useState<number>(0);

  /**
   * VÉRIFICATION D'ACCÈS : S'assure que l'utilisateur arrive bien d'un processus de réservation
   * Effectue plusieurs contrôles de sécurité avant d'autoriser l'accès à la page
   */
  useEffect(() => {
    const checkAccess = () => {
      const storedData = sessionStorage.getItem('bookingData');

      // Redirection immédiate si pas de données de réservation
      if (!storedData) {
        console.warn('Accès non autorisé: aucune donnée de réservation trouvée');
        router.push('/');
        return;
      }

      try {
        const parsed: BookingData = JSON.parse(storedData);

        // Vérification de la fraîcheur des données (1 heure max)
        const timestamp = new Date(parsed.timestamp).getTime();
        const now = new Date().getTime();
        const oneHour = 60 * 60 * 1000;

        if (now - timestamp > oneHour) {
          console.warn('Accès non autorisé: données de réservation expirées');
          sessionStorage.removeItem('bookingData');
          router.push('/');
          return;
        }

        // Validation structurelle des données selon le type de vol
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

        // Accès autorisé - initialisation des données d'affichage
        setBookingData(parsed);
        setFlightType(getFlightTypeLabel(parsed.type));
        setIsAuthorized(true);
        setIsLoading(false);

        // Extraction des informations de vol selon le type de réservation
        if (parsed.type === 'oneWay') {
          const { from, to, departureDate, departureTime, passengers: pass } = parsed.data;
          setDepartureInfo(extractAirportInfo(from));
          setArrivalInfo(extractAirportInfo(to));
          setFlightDate(departureDate);
          setFlightTime(departureTime);
          setPassengers((pass.adults || 0) + (pass.children || 0) + (pass.infants || 0));
        }
        else if (parsed.type === 'roundTrip') {
          const { outbound } = parsed.data;
          setDepartureInfo(extractAirportInfo(outbound.from));
          setArrivalInfo(extractAirportInfo(outbound.to));
          setFlightDate(outbound.date);
          setFlightTime(outbound.time);
          setPassengers((outbound.passengers.adults || 0) + (outbound.passengers.children || 0) + (outbound.passengers.infants || 0));
        }
        else if (parsed.type === 'multiLeg') {
          const firstLeg = parsed.data.legs[0];
          if (firstLeg) {
            setDepartureInfo(extractAirportInfo(firstLeg.from));
            setArrivalInfo(extractAirportInfo(firstLeg.to));
            setFlightDate(firstLeg.date);
            setFlightTime(firstLeg.time);
            setPassengers((firstLeg.passengers.adults || 0) + (firstLeg.passengers.children || 0) + (firstLeg.passengers.infants || 0));
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'accès:', error);
        sessionStorage.removeItem('bookingData');
        router.push('/');
      }
    };

    checkAccess();
  }, [router]);

  /**
   * DÉTECTION AUTOMATIQUE DU PAYS : Récupère le pays de l'utilisateur via son IP
   * Utilisé pour pré-remplir le sélecteur de numéro de téléphone
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
        // Log silencieux en production, détaillé en développement
        if (process.env.NODE_ENV === 'development') {
          console.warn("Détection du pays échouée:", error);
        }
      }
    };

    detectCountry();
  }, [isAuthorized]);

  /**
   * Gestionnaire générique pour les champs de formulaire
   * Supporte les inputs textuels, emails, selects et checkboxes
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
   * Utilise le composant PhoneInput qui a sa propre API
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
   * TODO: Intégration avec l'API d'authentification
   */
  const handleAuthSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    // TODO: Implémenter la logique de connexion réelle
    console.log('Login:', authData);
    // Exemple: await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(authData) });

    // Simulation de connexion réussie
    setShowAuth(false);
    setAuthData({
      email: '',
      password: ''
    });
  };

  /**
   * Soumission du formulaire principal de réservation
   * Valide les données, envoie la réservation et redirige
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (!isFormValid) {
      console.warn("Formulaire invalide");
      return;
    }

    // Construction de l'objet de réservation complet
    const completeBooking = {
      ...formData,
      bookingDetails: bookingData,
      submittedAt: new Date().toISOString()
    };

    console.log("Réservation complète:", completeBooking);

    // Nettoyage des données temporaires
    sessionStorage.removeItem('bookingData');

    // TODO: Redirection vers page de confirmation
    // router.push('/confirmation');
  };

  /**
   * Annulation de la réservation en cours
   * Supprime les données et redirige vers l'accueil sans confirmation
   */
  const handleCancel = (): void => {
    sessionStorage.removeItem('bookingData');
    router.push('/');
  };

  /**
   * Validation globale du formulaire
   * Vérifie que tous les champs obligatoires sont remplis et valides
   */
  const isFormValid: boolean = Boolean(
    formData.firstName?.trim() &&
    formData.lastName?.trim() &&
    formData.email?.trim() &&
    formData.phone?.trim() &&
    formData.acceptTerms
  );

  // Styles réutilisables pour maintenir la cohérence UI
  const inputStyles = "w-full px-3 py-2 border text-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const inputStyletitle = "w-full px-3 py-2 border text-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none";
  const labelStyles = "block text-sm font-medium text-gray-700 mb-2";
  const checkboxStyles = "mt-1 w-4 h-4 text-blue-400 border-gray-300 focus:ring-blue-500";

  // État de chargement pendant la vérification d'accès
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

  // Rendu nul si accès non autorisé (redirection en cours)
  if (!isAuthorized) {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("images/arriere-plan-envyjet.jpg")' }}
    >
      <Navbar />

      {/* Contenu principal avec grille responsive */}
      <div className="min-h-screen pt-26 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto gap-0">

            {/* COLONNE GAUCHE : Formulaire dynamique (auth ou details) */}
            <section className="bg-white min-h-[630px] md:h-[630px] shadow-lg p-8">
              {showAuth ? (
                // FORMULAIRE D'AUTHENTIFICATION
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
                // FORMULAIRE PRINCIPAL DES DÉTAILS CLIENT
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

                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* Grille Titre + Prénom */}
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
                        />
                      </div>
                    </div>

                    {/* Champ Nom */}
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
                      />
                    </div>

                    {/* Champ Email */}
                    <div>
                      <label htmlFor="email" className={labelStyles}>
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={inputStyles}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Champ Téléphone avec sélecteur de pays */}
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
                        }}
                        inputStyle={{
                          width: "100%",
                          height: "40px",
                          color: "#4A5568"
                        }}
                        buttonStyle={{
                          height: "40px",
                          color: "#4A5568"
                        }}
                        enableLongNumbers
                      />
                    </div>

                    {/* Checkboxes options et CGU */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="weeklyUpdates"
                          name="weeklyUpdates"
                          checked={formData.weeklyUpdates}
                          onChange={handleInputChange}
                          className={checkboxStyles}
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
                        />
                        <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                          By submitting your flight request, you agree to our Terms
                          and Conditions and Privacy Policy.
                        </label>
                      </div>
                    </div>

                    {/* Actions principales */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 py-3 px-4 font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-200 border border-gray-300"
                      >
                        CANCEL
                      </button>

                      <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`
                          flex-1 py-3 px-4 font-semibold text-white transition duration-200
                          ${isFormValid
                            ? "bg-[#d3a936] hover:bg-[#a98c2f] cursor-pointer"
                            : "bg-[#d3a936] cursor-not-allowed"
                          }
                        `}
                      >
                        CONFIRM
                      </button>
                    </div>
                  </form>
                </>
              )}
            </section>

            {/* COLONNE DROITE : Récapitulatif visuel du vol */}
            <section
              className="relative shadow-lg min-h-[600px] hidden lg:block bg-[#1a1a1a]"
            >
              {/* Overlay de contenu structuré */}
              <div className="absolute w-full flex flex-col h-full px-8 py-6">

                {/* En-tête avec trajet visuel */}
                <div className="flex items-center justify-between mb-8 px-4 relative">
                  {/* Aéroport de départ */}
                  <div className="text-center relative top-[38px]">
                    <p className="text-xl text-white font-bold">{departureInfo.code}</p>
                    <p className="text-sm text-gray-400">{departureInfo.city}</p>
                  </div>

                  {/* Représentation graphique du trajet */}
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

                    {/* Icône avion positionnée au centre de la courbe */}
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

                    {/* Type de vol affiché sous la courbe */}
                    <div className="absolute top-[40px] left-1/2 transform -translate-x-1/2 text-center">
                      <p className="text-xs text-white font-medium tracking-widest">{flightType}</p>
                    </div>
                  </div>

                  {/* Aéroport d'arrivée */}
                  <div className="text-center relative top-[38px]">
                    <p className="text-xl text-white font-bold">{arrivalInfo.code}</p>
                    <p className="text-sm text-gray-400">{arrivalInfo.city}</p>
                  </div>
                </div>

                {/* Informations détaillées du vol */}
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

                {/* Carte de cotation de l'opérateur */}
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

                {/* Message informatif */}
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