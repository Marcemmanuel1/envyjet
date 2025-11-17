// hooks/useClientCheck.ts

import { useState, useEffect } from "react";

export const useClientCheck = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
