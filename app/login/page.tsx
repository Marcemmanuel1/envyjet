"use client";
import { API_BASE_URL } from '../config/api';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Interface pour les données de connexion
 */
interface LoginData {
  email: string;
  password: string;
}

/**
 * Page de connexion avec informations à gauche et formulaire à droite
 */
export default function Login() {
  const router = useRouter();

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  /**
   * Gestionnaire pour les champs du formulaire
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (error) setError(null);
  };

  /**
   * Soumission du formulaire de connexion
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Appel à l'API de connexion
      const response = await fetch('${API_BASE_URL}/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Connexion réussie
        console.log('Login successful:', data);

        // Stocker le token si présent
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }

        // Redirection après connexion réussie
        router.push('/dashboard');
      } else {
        // Gestion des erreurs
        setError(data.message || 'Erreur de connexion');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Soumission du formulaire de réinitialisation de mot de passe
   */
  const handleForgotPasswordSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Appel à l'API de réinitialisation de mot de passe
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Email de réinitialisation envoyé avec succès
        setResetEmailSent(true);
      } else {
        // Gestion des erreurs
        setError(data.message || 'Erreur lors de l\'envoi de l\'email de réinitialisation');
      }

    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Redirection vers la page d'inscription
   */
  const handleSignUpRedirect = (): void => {
    router.push('/join');
  };

  /**
   * Retour au formulaire de connexion
   */
  const handleBackToLogin = (): void => {
    setIsForgotPassword(false);
    setResetEmailSent(false);
    setError(null);
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
            <section className="bg-black/70 min-h-[630px] md:h-[630px] shadow-lg p-8 flex flex-col justify-center">
              <div className="max-w-md mx-auto lg:mx-0">
                <h1 className="text-4xl font-bold text-white mb-8">
                  Join us
                </h1>

                <div className="space-y-6">
                  {/* Point 1 */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#d3a936] rounded-full flex items-center justify-center mt-1">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Exceptional client service
                      </h3>
                    </div>
                  </div>

                  {/* Point 2 */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#d3a936] rounded-full flex items-center justify-center mt-1">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Jet Cards & premium charter membership
                      </h3>
                    </div>
                  </div>

                  {/* Point 3 */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#d3a936] rounded-full flex items-center justify-center mt-1">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Part of a leading global group
                      </h3>
                    </div>
                  </div>

                  {/* Point 4 */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#d3a936] rounded-full flex items-center justify-center mt-1">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Access to premium, certified aircraft
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Bouton d'inscription */}
                <div className="mt-5 pt-6">
                  <button
                    onClick={handleSignUpRedirect}
                    className="w-full py-3 px-4 bg-transparent border-2 border-[#d3a936] text-[#d3a936] hover:bg-[#d3a936] hover:text-white font-semibold transition duration-400"
                  >
                    CREATE ACCOUNT
                  </button>
                </div>
              </div>
            </section>

            {/* COLONNE DROITE : Formulaire de connexion ou réinitialisation */}
            <section className="bg-gray-50 min-h-[630px] md:h-[630px] shadow-lg p-8 flex items-center flex-col justify-center">
              <div className="max-w-md mx-auto lg:mx-0 w-full">
                <div className="text-center mb-8">
                  {/* Logo à la place du texte */}
                  <div className="flex justify-center mb-4">
                    <img
                      src="/images/logo_mobile.webp"
                      alt="EnvyJet Logo"
                      className="h-18 w-auto"
                    />
                  </div>
                </div>

                {!isForgotPassword ? (
                  // FORMULAIRE DE CONNEXION
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Champ Email */}
                    <div>
                      <label htmlFor="email" className={labelStyles}>
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleInputChange}
                        required
                        className={inputStyles}
                        placeholder="your.email@example.com"
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
                        value={loginData.password}
                        onChange={handleInputChange}
                        required
                        className={inputStyles}
                        placeholder="Enter your password"
                        minLength={6}
                      />
                    </div>

                    {/* Affichage des erreurs */}
                    {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                      </div>
                    )}

                    {/* Lien mot de passe oublié */}
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-sm text-[#d3a936] hover:text-[#a98c2f] font-medium"
                      >
                        Forgot your password?
                      </button>
                    </div>

                    {/* Bouton de connexion */}
                    <button
                      type="submit"
                      disabled={isLoading || !loginData.email || !loginData.password}
                      className={`
                        w-full py-3 px-4 font-semibold text-white transition duration-200
                        ${isLoading || !loginData.email || !loginData.password
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#d3a936] hover:bg-[#a98c2f] cursor-pointer"
                        }
                      `}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          SIGNING IN...
                        </div>
                      ) : (
                        "SIGN IN"
                      )}
                    </button>
                  </form>
                ) : (
                  // FORMULAIRE DE RÉINITIALISATION DE MOT DE PASSE
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                    {!resetEmailSent ? (
                      <>
                        <div className="text-center mb-4">
                          <h2 className="text-2xl font-bold text-gray-900">Reset Your Password</h2>
                          <p className="text-gray-600 mt-2">
                            Enter your email address and we'll send you instructions to reset your password.
                          </p>
                        </div>

                        {/* Champ Email */}
                        <div>
                          <label htmlFor="forgot-email" className={labelStyles}>
                            Email Address *
                          </label>
                          <input
                            id="forgot-email"
                            type="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleInputChange}
                            required
                            className={inputStyles}
                            placeholder="your.email@example.com"
                          />
                        </div>

                        {/* Affichage des erreurs */}
                        {error && (
                          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                          </div>
                        )}

                        {/* Boutons */}
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="flex-1 py-3 px-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold transition duration-200"
                          >
                            BACK
                          </button>
                          <button
                            type="submit"
                            disabled={isLoading || !loginData.email}
                            className={`
                              flex-1 py-3 px-4 font-semibold text-white transition duration-200
                              ${isLoading || !loginData.email
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#d3a936] hover:bg-[#a98c2f] cursor-pointer"
                              }
                            `}
                          >
                            {isLoading ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                SENDING...
                              </div>
                            ) : (
                              "SEND RESET LINK"
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      // MESSAGE DE SUCCÈS
                      <div className="text-center space-y-6">
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                          <p className="font-semibold">Reset Email Sent!</p>
                          <p className="mt-2">
                            We've sent instructions to reset your password to <strong>{loginData.email}</strong>.
                            Please check your email inbox.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleBackToLogin}
                          className="w-full py-3 px-4 bg-[#d3a936] hover:bg-[#a98c2f] text-white font-semibold transition duration-200"
                        >
                          BACK TO LOGIN
                        </button>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}