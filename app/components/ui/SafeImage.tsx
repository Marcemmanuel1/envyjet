// components/ui/SafeImage.tsx - Version avec Next.js Image
'use client';

import React from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  [key: string]: any;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = "",
  ...props
}) => {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={(e) => {
          // Fallback si l'image échoue
          e.currentTarget.src = '/images/placeholder.jpg';
        }}
        {...props}
      />
    </div>
  );
};

export default SafeImage;