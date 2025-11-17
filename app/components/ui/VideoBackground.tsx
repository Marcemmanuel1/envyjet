// components/ui/VideoBackground.tsx

'use client';

import React, { useState, useCallback } from 'react';

const VideoBackground: React.FC = () => {
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = useCallback(() => {
    setVideoError(true);
  }, []);

  if (videoError) {
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#193650]/80 via-[#193650]/60 to-[#193650]/80" />
      </div>
    );
  }

  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{
          filter: "brightness(0.7) contrast(1.1) saturate(1.1)",
        }}
        onError={handleVideoError}
      >
        <source src="/images/video-envyjet.MP4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-[#193650]/80 via-[#193650]/60 to-[#193650]/80" />
    </>
  );
};

export default VideoBackground;