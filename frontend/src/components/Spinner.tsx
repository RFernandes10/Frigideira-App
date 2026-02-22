// src/components/Spinner.tsx
import { Loader } from 'lucide-react';

export function Spinner() {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-secondary-light/60 backdrop-blur-sm animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
        <Loader className="animate-spin text-primary relative z-10" size={64} strokeWidth={1.5} />
      </div>
      <p className="mt-6 font-display text-xl text-accent-brown animate-pulse">
        Preparando o sabor...
      </p>
    </div>
  );
}
  