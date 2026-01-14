"use client";
import { API_BASE_URL } from '../config/api';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

/**
 * Interface pour les données d'inscription
 */
interface SignupData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
}

/**
 * Page d'inscription avec informations à gauche et formulaire à droite
 */
export default function Signup() {
  const router = useRouter();

  const [signupData, setSignupData] = useState<SignupData>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Gestionnaire pour les champs du formulaire
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (error) setError(null);
  };

  /**
   * Gestionnaire pour le champ téléphone
   */
  const handlePhoneChange = (value: string): void => {
    setSignupData(prev => ({
      ...prev,
      phone: value
    }));
    if (error) setError(null);
  };

  /**
   * Soumission du formulaire d'inscription
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Appel à l'API d'inscription
      const response = await fetch('${API_BASE_URL}/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
        // Inscription réussie
        console.log('Signup successful:', data);

        // Stocker le token si présent
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }

        // Redirection après inscription réussie
        router.push('/dashboard');
      } else {
        // Gestion des erreurs
        setError(data.message || 'Erreur lors de l\'inscription');
      }

    } catch (error) {
      console.error('Signup error:', error);
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Redirection vers la page de connexion
   */
  const handleLoginRedirect = (): void => {
    router.push('/login');
  };

  // Styles réutilisables
  const inputStyles = "w-full px-3 py-2 border text-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelStyles = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("images/arriere-plan-envyjet.webp")' }}
    >
      <Navbar />

      {/* Contenu principal avec grille responsive */}
      <div className="min-h-screen pt-26 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto gap-0">

            {/* COLONNE GAUCHE : Informations */}
            <section className="bg-black/70 min-h-[300px] flex items-center justify-center shadow-lg p-8">
              <div className="max-w-md w-full text-center">
                <p className="text-white text-5xl mb-6">
                  Vous avez déjà un compte !
                </p>
                <button
                  onClick={handleLoginRedirect}
                  className="w-full py-3 px-4 bg-transparent border-2 border-[#d3a936] text-[#d3a936] hover:bg-[#d3a936] hover:text-white font-semibold transition duration-400"
                >
                  SE CONNECTER
                </button>
              </div>
            </section>


            {/* COLONNE DROITE : Formulaire d'inscription */}
            <section className="bg-gray-50 min-h-[630px] md:h-[630px] shadow-lg p-8 flex items-center flex-col justify-center">
              <div className="max-w-md mx-auto lg:mx-0 w-full">
                <div className="text-center mb-8">
                  {/* Logo */}
                  <div className="flex justify-center mb-4">
                    <img
                      src="/images/logo_mobile.webp"
                      alt="EnvyJet Logo"
                      className="h-18 w-auto"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create your account
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Champs Prénom et Nom sur la même ligne */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Champ Prénom */}
                    <div>
                      <label htmlFor="firstname" className={labelStyles}>
                        First Name *
                      </label>
                      <input
                        id="firstname"
                        type="text"
                        name="firstname"
                        value={signupData.firstname}
                        onChange={handleInputChange}
                        required
                        className={inputStyles}
                        placeholder="John"
                      />
                    </div>

                    {/* Champ Nom */}
                    <div>
                      <label htmlFor="lastname" className={labelStyles}>
                        Last Name *
                      </label>
                      <input
                        id="lastname"
                        type="text"
                        name="lastname"
                        value={signupData.lastname}
                        onChange={handleInputChange}
                        required
                        className={inputStyles}
                        placeholder="Doe"
                      />
                    </div>
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
                      value={signupData.email}
                      onChange={handleInputChange}
                      required
                      className={inputStyles}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Champ Téléphone */}
                  <div>
                    <label htmlFor="phone" className={labelStyles}>
                      Phone Number *
                    </label>
                    <PhoneInput
                      country={'fr'}
                      value={signupData.phone}
                      onChange={handlePhoneChange}
                      inputProps={{
                        id: 'phone',
                        name: 'phone',
                        required: true,
                      }}
                      inputStyle={{
                        width: '100%',
                        paddingLeft: '48px',
                        height: '42px',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem'
                      }}
                      buttonStyle={{
                        border: '1px solid #d1d5db',
                        borderRight: 'none',
                        borderTopLeftRadius: '0.375rem',
                        borderBottomLeftRadius: '0.375rem'
                      }}
                      containerStyle={{
                        width: '100%'
                      }}
                    />
                  </div>

                  {/* Champ Mot de passe */}
                  <div>
                    <label htmlFor="password" className={labelStyles}>
                      Password *
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={signupData.password}
                      onChange={handleInputChange}
                      required
                      className={inputStyles}
                      placeholder="Enter your password"
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 6 caractères
                    </p>
                  </div>

                  {/* Affichage des erreurs */}
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  {/* Bouton d'inscription */}
                  <button
                    type="submit"
                    disabled={isLoading || !signupData.firstname || !signupData.lastname || !signupData.email || !signupData.password || !signupData.phone}
                    className={`
                      w-full py-3 px-4 font-semibold text-white transition duration-200
                      ${isLoading || !signupData.firstname || !signupData.lastname || !signupData.email || !signupData.password || !signupData.phone
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#d3a936] hover:bg-[#a98c2f] cursor-pointer"
                      }
                    `}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        CREATING ACCOUNT...
                      </div>
                    ) : (
                      "CREATE ACCOUNT"
                    )}
                  </button>
                </form>
              </div>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}