"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useRouter } from 'next/navigation';
import { Flight } from '../types';
interface FlightCardProps {
  flight: Flight;
  onMoreInfo?: (flight: Flight) => void;
  useIntegratedModal?: boolean;
}

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
  const router = useRouter();

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

  // États pour les messages d'erreur
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // État pour le chargement et les messages d'API
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Construire la galerie d'images depuis l'API
  const getFlightImages = (): string[] => {
    const images: string[] = [];

    // Image principale (exterior ou image par défaut)
    if (flight.exterior_photo) {
      images.push(flight.exterior_photo);
    }

    // Photo intérieur
    if (flight.interior_photo) {
      images.push(flight.interior_photo);
    }

    // Plan de cabine
    if (flight.cabin_layout) {
      images.push(flight.cabin_layout);
    }

    // Si aucune image, utiliser l'image par défaut
    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop');
    }

    return images;
  };

  const currentImages = getFlightImages();

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
    setCurrentImageIndex((prev) =>
      prev === currentImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentImages.length - 1 : prev - 1
    );
  };

  // Fonction principale pour "MORE INFO"
  const handleMoreInfoClick = () => {
    if (useIntegratedModal) {
      setIsInfoModalOpen(true);
    }
    if (onMoreInfo) {
      onMoreInfo(flight);
    }
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
    setShowAuth(false);
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
    setFormErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(false);
  };

  // Gestionnaires de formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prevState => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Effacer l'erreur du champ quand l'utilisateur commence à taper
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAuthInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setAuthData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (value: string, countryData: any): void => {
    setFormData(prevState => ({
      ...prevState,
      phone: value,
    }));
    setCountry(countryData.countryCode);

    // Effacer l'erreur du téléphone
    if (formErrors.phone) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const handleAuthSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log('Login attempt:', authData);
    setShowAuth(false);
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.firstName?.trim()) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName?.trim()) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email?.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.phone?.trim()) {
      errors.phone = "Phone number is required";
    } else if (formData.phone.replace(/\D/g, '').length < 8) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = "You must accept the terms and conditions";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumission du formulaire à l'API
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!validateForm()) {
      console.warn("Form validation failed:", formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Préparation des données pour l'API
      const payload = {
        flight: flight.id.toString(), // ID du vol
        // Customer details
        title: formData.title,
        firstname: formData.firstName.trim(),
        lastname: formData.lastName.trim(),
        address: "", // Pas de champ address dans le formulaire actuel
        phonenumber: formData.phone,
        receivemails: formData.weeklyUpdates,
        bookingstage: 1
      };

      // Envoi à l'API
      const response = await fetch('https://envyjet.com/api/envy/vol/newInterest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      // Succès - redirection vers booking-last-step
      setSubmitSuccess(true);

      // Redirection après 1.5 secondes pour laisser voir le message de succès
      setTimeout(() => {
        closeInfoModal();
        router.push('/booking-last-step');
      }, 1500);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error instanceof Error ? error.message : 'An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonctions d'extraction des données
  const extractAirportCode = (airportString: string): string => {
    if (!airportString) return 'N/A';
    const match = airportString.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : '';
  };

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

  // Déterminer le type d'avion basé sur la capacité
  const getAircraftType = (capacity: number | null): string => {
    if (!capacity || capacity <= 6) return 'Light Jet';
    if (capacity <= 8) return 'Midsize Jet';
    if (capacity <= 12) return 'Super Midsize Jet';
    return 'Heavy Jet';
  };

  // Obtenir le nom de l'avion
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

  // Préparer les données pour l'affichage
  const departure = formatDate(flight.departureTime);
  const aircraftType = getAircraftType(flight.nbSeats);
  const aircraftName = getAircraftName(aircraftType);
  const capacity = flight.nbSeats || 0;

  // Données pour la colonne droite
  const flightType = "EMPTY LEG";
  const passengers = capacity;

  // Extraire le code IATA pour l'affichage dans le modal
  const departureCode = extractAirportCode(flight.from);
  const arrivalCode = extractAirportCode(flight.to);

  // Extraction des informations de date et heure
  const extractDateTime = (departureString: string) => {
    if (departureString === 'Date not available') return { date: "", time: "12:00" };

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

  const { date, time } = extractDateTime(departure);

  // Fonction pour extraire la ville seulement (pour le modal)
  const extractCityOnly = (airportString: string): string => {
    if (!airportString) return '';
    const parts = airportString.split(',');
    if (parts.length >= 2) {
      // Prendre la deuxième partie (après la virgule) et enlever le code pays
      const cityPart = parts[1].trim();
      // Enlever tout ce qui est entre parenthèses et le code pays à la fin
      return cityPart.replace(/\([^)]*\)/g, '').replace(/,?\s*[A-Z]{2}$/, '').trim();
    }
    return parts[0].trim();
  };

  return (
    <>
      {/* Carte de vol principale - STYLE DE L'ANCIEN FICHIER */}
      <div className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col md:flex-row">

          {/* Section image - cliquable pour ouvrir la galerie */}
          <div
            className="md:w-60 h-48 md:h-auto cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={currentImages[0]}
              alt={aircraftName}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
            />
          </div>

          {/* Section informations du vol - STYLE ORIGINAL MAIS AVEC AÉROPORTS COMPLETS */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-4">
                Departure: <span className="font-semibold text-gray-800">{departure}</span>
              </p>
              <div className="flex flex-col md:flex-row md:items-center text-gray-800">
                <div className="mb-2 md:mb-0 md:mr-4 flex-1">
                  <p className="font-medium text-base text-gray-800 leading-tight">
                    {flight.from}
                  </p>
                </div>
                <span className="mx-2 text-[#d3a936] my-1 md:my-0 text-xl">→</span>
                <div className="mt-2 md:mt-0 flex-1">
                  <p className="font-medium text-base text-gray-800 leading-tight">
                    {flight.to}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-gray-600 text-sm mt-4">
              <span>Aircraft: </span>
              <span className="text-[#d3a936] font-semibold">{aircraftName}</span>
              <span>, {aircraftType}, Capacity: {capacity} passengers</span>
            </div>
          </div>

          {/* Section prix et action - STYLE ORIGINAL */}
          <div className="p-6 md:w-54 flex md:flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-gray-200 bg-gray-50">
            <div className="w-full mb-4">
              <p className="text-gray-600 text-left md:text-right text-sm mb-1">
                Price starting from
              </p>
              <p className="text-2xl md:text-3xl text-left md:text-right font-bold text-gray-800">
                €{flight.cost.toLocaleString()}
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
                alt={`Vue ${currentImageIndex + 1} de l'appareil ${aircraftName}`}
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

      {/* MODALE D'INFORMATIONS DÉTAILLÉES */}
      {useIntegratedModal && isInfoModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="min-h-screen pt-26 pb-8 w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

              {/* COLONNE GAUCHE : Formulaire */}
              <section className="bg-white min-h-[630px] md:h-auto shadow-lg p-8 overflow-visible">
                {showAuth ? (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <h1 className="text-3xl font-bold text-gray-800">Sign In</h1>
                      <button
                        onClick={() => setShowAuth(false)}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-sm mb-6 text-gray-500">or
                      <button
                        onClick={() => setShowAuth(false)}
                        className="text-[#d3a936] hover:text-[#a98c2f] font-semibold underline ml-2"
                      >
                        Sign up
                      </button>
                    </p>
                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="auth-email" className={labelStyles}>Email Address *</label>
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
                        <label htmlFor="auth-password" className={labelStyles}>Password *</label>
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
                    <div className="flex justify-between items-center mb-2">
                      <h1 className="text-3xl font-bold text-gray-800">Enter your details</h1>
                      <button
                        onClick={closeInfoModal}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
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

                    {/* Messages de succès/erreur */}
                    {submitSuccess && (
                      <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
                        <p className="font-semibold">Success!</p>
                        <p>Your flight interest has been submitted successfully. Redirecting to next step...</p>
                      </div>
                    )}

                    {submitError && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                        <p className="font-semibold">Error!</p>
                        <p>{submitError}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                      <div className="grid grid-cols-4 gap-1">
                        <div className="col-span-1">
                          <label htmlFor="title" className={labelStyles}>Title</label>
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
                          <label htmlFor="firstName" className={labelStyles}>First Name *</label>
                          <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className={`${inputStyles} ${formErrors.firstName ? 'border-red-500' : ''}`}
                            placeholder="Enter your first name"
                            disabled={isSubmitting || submitSuccess}
                          />
                          {formErrors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="lastName" className={labelStyles}>Last Name *</label>
                        <input
                          id="lastName"
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className={`${inputStyles} ${formErrors.lastName ? 'border-red-500' : ''}`}
                          placeholder="Enter your last name"
                          disabled={isSubmitting || submitSuccess}
                        />
                        {formErrors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email" className={labelStyles}>Email Address *</label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={`${inputStyles} ${formErrors.email ? 'border-red-500' : ''}`}
                          placeholder="your.email@example.com"
                          disabled={isSubmitting || submitSuccess}
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="phone" className={labelStyles}>
                          Phone Number *
                        </label>
                        <div>
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
                        {formErrors.phone && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                        )}
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
                            className={`${checkboxStyles} ${formErrors.acceptTerms ? 'border-red-500' : ''}`}
                            disabled={isSubmitting || submitSuccess}
                          />
                          <div className="flex-1">
                            <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                              By submitting your flight request, you agree to our Terms and Conditions and Privacy Policy.
                            </label>
                            {formErrors.acceptTerms && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.acceptTerms}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="w-full py-3 px-4 bg-[#d3a936] hover:bg-[#a98c2f] text-white font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting || submitSuccess}
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
                              Redirecting...
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

              {/* COLONNE DROITE : Récapitulatif du vol */}
              <section className="relative shadow-lg min-h-[600px] hidden lg:block bg-[#1a1a1a]">
                <div className="absolute w-full flex flex-col h-full px-8 py-6">
                  <div className="flex items-center justify-between mb-8 px-4 relative">
                    <div className="text-center relative top-[38px] max-w-[160px]">
                      <p className="text-xl text-white font-bold">{departureCode}</p>
                      <p className="text-sm text-gray-400 truncate">{extractCityOnly(flight.from)}</p>
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
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                      </div>
                      <div className="absolute top-[40px] left-1/2 transform -translate-x-1/2 text-center">
                        <p className="text-xs text-white font-medium tracking-widest">{flightType}</p>
                      </div>
                    </div>
                    <div className="text-center relative top-[38px] max-w-[160px]">
                      <p className="text-xl text-white font-bold">{arrivalCode}</p>
                      <p className="text-sm text-gray-400 truncate">{extractCityOnly(flight.to)}</p>
                    </div>
                  </div>
                  {date && time && (
                    <div className="text-center mb-4">
                      <p className="text-white text-sm">
                        <span className="text-gray-400">Date and Time:</span> {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}, @{time}
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
                        <p className="text-base font-semibold text-gray-800 mt-3">
                          {aircraftType} <span className="font-normal text-gray-600">- {aircraftName}</span>
                        </p>
                        <p className="text-sm text-gray-700"><span className="font-semibold">Seats:</span> {capacity}</p>
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
      )}
    </>
  );
};

export default FlightCard;