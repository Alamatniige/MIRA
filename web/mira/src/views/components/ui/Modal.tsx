import { useEffect } from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="mira-card w-full max-w-md p-6 shadow-[var(--shadow-md)]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
