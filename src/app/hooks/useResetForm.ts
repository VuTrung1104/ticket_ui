import { useEffect } from "react";

export function useResetForm(
  isOpen: boolean,
  reset: () => void
) {
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);
}
