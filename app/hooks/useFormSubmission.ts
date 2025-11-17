// hooks/useFormSubmission.ts

import { useState, useCallback } from "react";

export const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = useCallback(async (url: string, data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, ...result };
    } catch (error) {
      console.error("Form submission error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submitForm, isSubmitting };
};
