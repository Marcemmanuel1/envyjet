"use client";
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems
}) => {
  if (totalPages <= 1) return null;

  // Fonction pour gérer le changement de page avec défilement
  const handlePageChange = (page: number) => {
    // Appeler la fonction de changement de page
    onPageChange(page);

    // Attendre un peu pour que les nouvelles cartes se chargent
    setTimeout(() => {
      // Essayer de trouver la première carte de la nouvelle page
      const flightCards = document.querySelectorAll('.bg-white.border.border-gray-200');

      if (flightCards.length > 0) {
        const firstCard = flightCards[0] as HTMLElement;

        // Calculer la position avec un offset pour la navbar
        const navbarHeight = 80; // Hauteur approximative de la navbar
        const cardTop = firstCard.getBoundingClientRect().top + window.pageYOffset;

        // Défiler vers la première carte avec animation smooth
        window.scrollTo({
          top: cardTop - navbarHeight - 20, // -20 pour un peu d'espace
          behavior: 'smooth'
        });
      } else {
        // Fallback: défiler vers le haut de la section
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 50); // Petit délai pour s'assurer que le DOM est mis à jour
  };

  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
      {/* Contrôles de pagination */}
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border transition-colors ${currentPage === index + 1
              ? 'bg-[#d3a936] text-white border-[#d3a936] font-semibold'
              : 'border-gray-300 hover:bg-gray-50'
              }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;