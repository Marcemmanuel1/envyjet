// app/booking-last-step/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

/**
 * Composant de page de remerciement affiché après la soumission réussie
 * du formulaire de contact. Cette page confirme la réception de la demande
 * et fournit les prochaines étapes au client.
 */
export default function ThankYou() {
  const router = useRouter();

  const handleReturn = (): void => {
    sessionStorage.removeItem('bookingData');
    router.back(); // Retour à la page précédente
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("images/arriere-plan-envyjet.jpg")' }}
    >
      <Navbar />

      {/* Contenu principal centré verticalement */}
      <div className="min-h-screen pt-26 pb-8 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Carte de remerciement avec ombre portée pour mise en valeur */}
            <div className="bg-white shadow-2xl p-8 md:p-12 text-center">

              {/* Indicateur visuel de succès - icône de validation */}
              <div className="mb-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-12 h-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Titre principal de confirmation */}
              <h1 className="text-3xl md:text-4xl font-bold text-[#d3a936] mb-6">
                Thank You for Contacting EnvyJet
              </h1>

              {/* Message détaillant le processus de suivi */}
              <div className="max-w-2xl mx-auto">
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8">
                  You will soon be assigned a client manager who will promptly
                  contact you to better understand your needs.
                </p>

                {/* Section des contacts urgents - séparée visuellement */}
                <div className="border-t border-gray-200 pt-8">
                  <p className="text-gray-600 mb-4">
                    For urgent matters, you can reach us at:
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    {/* Lien téléphone avec icône */}
                    <a
                      href="tel:+2250759102503"
                      className="inline-flex items-center text-[#d3a936] hover:text-[#a98c2f] font-semibold transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      +225 07 59 10 25 03
                    </a>

                    {/* Lien email avec icône */}
                    <a
                      href="mailto:contact@envyjet.com"
                      className="inline-flex items-center text-[#d3a936] hover:text-[#a98c2f] font-semibold transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      contact@envyjet.com
                    </a>
                  </div>
                </div>

                {/* Call-to-action principal pour retour à l'accueil */}
                <div className="mt-8">
                  <button
                    onClick={handleReturn}
                    className="inline-block bg-[#d3a936] hover:bg-[#a98c2f] text-white font-semibold py-3 px-8 transition duration-200 transform hover:scale-105 cursor-pointer"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}