"use client";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

/**
 * Interface pour typer les données du formulaire
 * Assure la sécurité TypeScript et une meilleure maintenabilité
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
 * Composant principal pour la page de détails de demande de vol
 * Gère le formulaire de réservation avec validation et soumission
 */
export default function Details() {
  // État pour stocker les données du formulaire
  const [formData, setFormData] = useState<FormData>({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    weeklyUpdates: false,
    acceptTerms: false
  });

  // État pour le pays par défaut (Côte d'Ivoire)
  const [country, setCountry] = useState<string>("ci");

  /**
   * Effet pour détecter automatiquement le pays de l'utilisateur
   * Utilise l'API ipapi.co pour une détection précise
   */
  useEffect(() => {
    const detectCountry = async (): Promise<void> => {
      try {
        const response = await fetch("https://ipapi.co/json/");

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Met à jour le pays si la donnée est valide
        if (data?.country_code && typeof data.country_code === 'string') {
          setCountry(data.country_code.toLowerCase());
        }
      } catch (error) {
        // Log silencieux en production, détaillé en développement
        if (process.env.NODE_ENV === 'development') {
          console.warn("Détection du pays échouée, utilisation de la Côte d'Ivoire par défaut:", error);
        }
      }
    };

    detectCountry();
  }, []); // Tableau de dépendances vide = exécution une seule fois

  /**
   * Gestionnaire générique pour les changements dans les champs du formulaire
   * @param e - Événement de changement d'input/select
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
   * Gestionnaire spécifique pour le champ téléphone
   * @param value - Numéro de téléphone formaté
   */
  const handlePhoneChange = (value: string): void => {
    setFormData(prevState => ({
      ...prevState,
      phone: value,
    }));
  };

  /**
   * Gestionnaire de soumission du formulaire
   * @param e - Événement de soumission du formulaire
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    // Validation supplémentaire côté client
    if (!isFormValid) {
      console.warn("Formulaire invalide, soumission bloquée");
      return;
    }

    console.log("Formulaire soumis avec succès:", formData);

  };

  /**
   * Validation complète du formulaire
   * Vérifie que tous les champs obligatoires sont remplis et valides
   */
  const isFormValid: boolean = Boolean(
    formData.firstName?.trim() &&
    formData.lastName?.trim() &&
    formData.email?.trim() &&
    formData.phone?.trim() &&
    formData.acceptTerms
  );

  // Styles réutilisables pour une meilleure maintenabilité
  const inputStyles = "w-full px-3 py-2 border text-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const inputStyletitle = "w-full px-3 py-2 border text-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none";
  const labelStyles = "block text-sm font-medium text-gray-700 mb-2";
  const checkboxStyles = "mt-1 w-4 h-4 text-blue-400 border-gray-300 focus:ring-blue-500";

  return (
    // Conteneur principal avec image de fond
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("images/arriere-plan-envyjet.jpg")' }}
      role="main"
      aria-label="Page de réservation de vol privé"
    >
      <Navbar />

      {/* Contenu principal avec padding pour éviter la navbar fixe */}
      <div className="min-h-screen pt-32 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto gap-0">

            {/* Section Formulaire */}
            <section
              className="bg-white shadow-lg p-8"
              aria-labelledby="form-title"
            >
              <h1
                id="form-title"
                className="text-3xl font-bold text-gray-800 mb-6 text-center"
              >
                Enter your details
              </h1>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                noValidate // Désactive la validation HTML native pour un contrôle personnalisé
              >
                {/* Groupe: Titre et Prénom */}
                <div className="grid grid-cols-4 gap-1">
                  {/* Sélecteur de titre */}
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
                      aria-label="Sélectionnez votre titre"
                    >
                      <option value="">Title</option>
                      <option value="mr">Mr</option>
                      <option value="mrs">Mrs</option>
                      <option value="mis">Miss</option>
                      <option value="dr">Dr</option>
                      <option value="prof">Prof</option>
                    </select>
                  </div>

                  {/* Champ Prénom */}
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
                      aria-required="true"
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
                    aria-required="true"
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
                    aria-required="true"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Champ Téléphone */}
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
                      "aria-required": "true",
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

                {/* Groupe de cases à cocher */}
                <div className="space-y-4">
                  {/* Case à cocher: Mises à jour hebdomadaires */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="weeklyUpdates"
                      name="weeklyUpdates"
                      checked={formData.weeklyUpdates}
                      onChange={handleInputChange}
                      className={checkboxStyles}
                      aria-describedby="weeklyUpdates-description"
                    />
                    <label
                      htmlFor="weeklyUpdates"
                      className="text-sm text-gray-700"
                      id="weeklyUpdates-description"
                    >
                      Receive our weekly updates and offers free of charge.
                    </label>
                  </div>

                  {/* Case à cocher: Acceptation des conditions (obligatoire) */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      required
                      className={checkboxStyles}
                      aria-required="true"
                      aria-describedby="terms-description"
                    />
                    <label
                      htmlFor="acceptTerms"
                      className="text-sm text-gray-700"
                      id="terms-description"
                    >
                      By submitting your flight request, you agree to our Terms
                      and Conditions and Privacy Policy, as well as to receiving
                      further communications regarding your flight.
                    </label>
                  </div>
                </div>

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`
                    w-full py-3 px-4 font-semibold text-white transition duration-200
                    ${isFormValid
                      ? "bg-[#d3a936] hover:bg-[#a98c2f] cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                    }
                  `}
                  aria-disabled={!isFormValid}
                >
                  BOOK
                </button>
              </form>
            </section>

            {/* Section Image avec overlay de texte - Masquée sur mobile et tablette */}
            <section
              className="relative shadow-lg min-h-[600px] hidden lg:block"
              aria-label="Image d'un jet privé"
            >
              {/* Image de fond */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url("images/fond_jet.png")' }}
                role="img"
                aria-label="Jet privé EnvyJet"
              />

              {/* Overlay de texte avec fond semi-transparent */}
              <div className="absolute w-full flex flex-col justify-center p-8">

                <h1 className="text-white text-4xl text-center mb-8 mt-4 font-bold">
                  Flight Details
                </h1>


                <div className="bg-black/60 text-white px-20 w-[90%] mx-auto">
                  <div className="relative z-0 flex items-center justify-between">
                    <div className="text-center absolute left-3">
                      <p className="text-xl">ABJ</p>
                    </div>
                    <div className="relative pt-4 left-7 z-10">
                      <svg width="240" height="180" viewBox="0 0 240 60" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,10 A100,60 0 0,1 240,60" stroke="#d3a936" strokeWidth="2" fill="transparent" />
                      </svg>

                      <img src="images/plane.png" width="70px" style={{
                        top: "1px",
                        left: "35%",
                        position: "absolute",
                      }} />
                    </div>

                    {/* Arrivée - MBW */}
                    <div className="text-center absolute right-3">
                      <p className="text-xl">MBW</p>
                    </div>
                  </div>


                </div>

                <div className="bg-black/70 text-white rounded-[50%] border-2 border-[#d3a936] items-center mt-[2rem] w-[50%] h-[30vh] mx-auto">

                  <h1 className="text-xl mt-[3rem] text-center">
                    Cotation 1 sur 3
                  </h1>

                  <p className="text-center mt-[3rem] ">
                    McDan Aviation
                    Hawker 8xp
                    midsize jet
                    8 seats
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