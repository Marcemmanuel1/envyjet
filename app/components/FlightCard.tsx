"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

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
  pricestarting: string;
  codeFrom: string;
  codeTo: string;
  cityFrom: string;
  cityTo: string;
}

interface FlightCardProps {
  flight: Flight;
  onMoreInfo?: (flight: Flight) => void;
  useIntegratedModal?: boolean;
}

// Galerie d'images organisée par modèle d'avion
const aircraftImages: { [key: string]: string[] } = {
  'Gulfstream G-IV': [
    'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop',
    '/images/interieur-un.jpg',
    '/images/plan-un.jpg'
  ],
  'Citation X': [
    '/images/avion-un.jpg',
    '/images/interieur-deux.jpg',
    'images/plan-deux.png'
  ],
  'Challenger 350': [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop',
    '/images/interieur-trois.jpg',
    '/images/plan-trois.webp'
  ],
  'Learjet 75': [
    '/images/avion-deux.jpg',
    '/images/interieur-quatre.jpg',
    '/images/plan-quatre.webp'
  ],
  'Citation Sovereign': [
    'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop',
    'inages/interieur-cinq.jpg',
    '/images/plan-un.jpg'
  ],
  'Phenom 300': [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop',
    '/images/interieur-six.jpg',
    '/images/plan-deux.png'
  ],
  'Global 6000': [
    'images/avion-un.jpg',
    '/images/interieur-sept.jpg',
    '/images/plan-trois.webp'
  ],
  'Citation CJ3': [
    'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop',
    '/images/interieur-huit.webp',
    '/images/plan-quatre.webp'
  ]
};

// Styles réutilisables
const inputStyles = "w-full px-3 py-2 border text-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500";
const inputStyletitle = "w-full px-3 py-2 border text-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none";
const labelStyles = "block text-sm font-medium text-gray-700 mb-2";
const checkboxStyles = "mt-1 w-4 h-4 text-blue-400 border-gray-300 focus:ring-blue-500";

const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  onMoreInfo,
  useIntegratedModal = true
}) => {
  // États pour la galerie d'images
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // État pour la modale d'informations détaillées
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // États pour le formulaire
  const [showAuth, setShowAuth] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    weeklyUpdates: false,
    acceptTerms: false
  });
  const [authData, setAuthData] = useState({
    email: '',
    password: ''
  });
  const [country, setCountry] = useState<string>("fr");

  // Fonctions pour la galerie d'images
  const handleImageClick = () => {
    setCurrentImageIndex(0);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    const images = aircraftImages[flight.aircraft] || [flight.image];
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    const images = aircraftImages[flight.aircraft] || [flight.image];
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // Fonction principale pour "MORE INFO"
  const handleMoreInfoClick = () => {
    // Si useIntegratedModal est true, ouvrir la modale intégrée
    if (useIntegratedModal) {
      setIsInfoModalOpen(true);
    }

    // Si onMoreInfo existe, on l'appelle aussi (pour SharedFlights)
    if (onMoreInfo) {
      onMoreInfo(flight);
    }
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
    setShowAuth(false);
    // Réinitialiser les formulaires
    setFormData({
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      weeklyUpdates: false,
      acceptTerms: false
    });
    setAuthData({
      email: '',
      password: ''
    });
  };

  const handleBookFlight = () => {
    closeInfoModal();
    // Ici vous pouvez ajouter la logique de réservation
    console.log('Vol réservé:', flight);
  };

  // Gestionnaires de formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prevState => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAuthInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setAuthData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (value: string): void => {
    setFormData(prevState => ({
      ...prevState,
      phone: value,
    }));
  };

  const handleAuthSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // TODO: Implémenter la logique de connexion
    console.log('Login attempt:', authData);
    setShowAuth(false);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!isFormValid) {
      console.warn("Formulaire invalide");
      return;
    }
    // TODO: Implémenter la logique de réservation
    console.log('Form submitted:', formData);
    handleBookFlight();
  };

  // Validation du formulaire
  const isFormValid = Boolean(
    formData.firstName?.trim() &&
    formData.lastName?.trim() &&
    formData.email?.trim() &&
    formData.phone?.trim() &&
    formData.acceptTerms
  );

  const currentImages = aircraftImages[flight.aircraft] || [flight.image];

  // Extraction des informations de date et heure
  const extractDateTime = (departureString: string) => {
    const parts = departureString.split(' ');
    if (parts.length < 4) return { date: "", time: "12:00" };

    const day = parts[1];
    const month = parts[2];
    const year = parts[3];

    const months: { [key: string]: string } = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };

    const monthNumber = months[month];
    if (!monthNumber) return { date: "", time: "12:00" };

    return {
      date: `${year}-${monthNumber}-${day.padStart(2, '0')}`,
      time: "12:00"
    };
  };

  const { date, time } = extractDateTime(flight.departure);

  // Données pour la colonne droite
  const flightType = "EMPTY LEG";
  const passengers = flight.capacity;
  const departureInfo = {
    code: flight.codeFrom || "N/A",
    city: flight.cityFrom || flight.from
  };
  const arrivalInfo = {
    code: flight.codeTo || "N/A",
    city: flight.cityTo || flight.to
  };
  const flightDate = date;
  const flightTime = time;

  return (
    <>
      {/* Carte de vol principale - INCHANGÉE */}
      <div className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col md:flex-row">

          {/* Section image - cliquable pour ouvrir la galerie */}
          <div
            className="md:w-60 h-48 md:h-auto cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={flight.image}
              alt={flight.aircraft}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
            />
          </div>

          {/* Section informations du vol */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-4">
                Departure: <span className="font-semibold text-gray-800">{flight.departure}</span>
              </p>
              <div className="flex flex-col md:flex-row md:items-center text-gray-800 text-base">
                <span className="font-medium">{flight.from}</span>
                <span className="mx-2 text-[#d3a936] my-1 md:my-0">→</span>
                <span className="font-medium">{flight.to}</span>
              </div>
            </div>

            <div className="text-gray-600 text-sm">
              <span>Aircraft: </span>
              <span className="text-[#d3a936] font-semibold">{flight.aircraft}</span>
              <span>, {flight.type}, Capacity: {flight.capacity} passengers</span>
            </div>
          </div>

          {/* Section prix et action */}
          <div className="p-6 md:w-54 flex md:flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-gray-200 bg-gray-50">
            <div className="w-full mb-4">
              <p className="text-gray-600 text-left md:text-right text-sm mb-1">
                {flight.pricestarting || "Price starting from"}
              </p>
              <p className="text-2xl md:text-3xl text-left md:text-right font-bold text-gray-800">
                €{flight.price.toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleMoreInfoClick}
              className="w-full md:w-auto bg-[#d3a936] hover:bg-[#b8922e] text-white font-semibold px-6 py-3 transition-colors duration-200"
            >
              MORE INFO
            </button>
          </div>
        </div>
      </div>

      {/* Modale de galerie d'images */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/85 bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 z-10 text-white hover:text-[#d3a936] transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-6xl max-h-full w-full">
            <div className="relative">
              <img
                src={currentImages[currentImageIndex]}
                alt={`Vue de l'appareil ${flight.aircraft}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />

              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#d3a936] bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    aria-label="Image précédente"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#d3a936] bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    aria-label="Image suivante"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            <div className="flex justify-center mt-4 space-x-2">
              {currentImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex
                    ? 'bg-[#d3a936]'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                    }`}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>

            <div className="text-white text-center mt-2 text-sm">
              {currentImageIndex + 1} / {currentImages.length}
            </div>
          </div>
        </div>
      )}

      {/* MODALE D'INFORMATIONS DÉTAILLÉES - Seulement si useIntegratedModal est true */}
      {useIntegratedModal && isInfoModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="min-h-screen pt-26 pb-8 w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

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
                    <div className="flex justify-between items-center mb-2">
                      <h1 className="text-3xl font-bold text-gray-800">
                        Enter your details
                      </h1>
                      <button
                        onClick={closeInfoModal}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
                        aria-label="Close"
                      >
                        ×
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-6">
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
              <section className="relative shadow-lg min-h-[600px] hidden lg:block bg-[#1a1a1a]">
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
      )}
    </>
  );
};

export default FlightCard;