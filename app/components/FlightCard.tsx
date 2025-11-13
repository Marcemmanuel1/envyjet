"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

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
}

interface FlightCardProps {
  flight: Flight;
  onMoreInfo: (flight: Flight) => void;
}

// Galerie d'images organisée par modèle d'avion
// Chaque modèle a trois vues : exterieur, interieur et plan de cabine
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

const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  onMoreInfo
}) => {
  // Gestion de l'état de la modale et de la navigation entre images
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Ouvre la galerie d'images avec la première image sélectionnée
  const handleImageClick = () => {
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };

  // Ferme la modale et réinitialise l'index d'image
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImageIndex(0);
  };

  // Navigation vers l'image suivante avec bouclage
  const nextImage = () => {
    const images = aircraftImages[flight.aircraft] || [flight.image];
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // Navigation vers l'image précédente avec bouclage
  const prevImage = () => {
    const images = aircraftImages[flight.aircraft] || [flight.image];
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // Récupère les images disponibles pour l'avion courant, avec fallback sur l'image principale
  const currentImages = aircraftImages[flight.aircraft] || [flight.image];

  return (
    <>
      {/* Carte de vol principale */}
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
              <div className="flex flex-col md:flex-row md:items-center text-gray-800 text-base mb-4">
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
              onClick={() => onMoreInfo(flight)}
              className="w-full md:w-auto bg-[#d3a936] hover:bg-[#b8922e] text-white font-semibold px-6 py-3 transition-colors duration-200"
            >
              MORE INFO
            </button>
          </div>
        </div>
      </div>

      {/* Modale de galerie d'images */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 bg-opacity-90 z-50 flex items-center justify-center p-4">
          {/* Bouton de fermeture */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 text-white hover:text-[#d3a936] transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-6xl max-h-full w-full">
            {/* Conteneur d'image principale avec navigation */}
            <div className="relative">
              <img
                src={currentImages[currentImageIndex]}
                alt={`Vue de l'appareil ${flight.aircraft}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />

              {/* Boutons de navigation latéraux - affichés seulement si multiple images */}
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

            {/* Indicateurs de position - points cliquables */}
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

            {/* Compteur d'images */}
            <div className="text-white text-center mt-2 text-sm">
              {currentImageIndex + 1} / {currentImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlightCard;