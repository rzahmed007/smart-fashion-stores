import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ANNOUNCEMENTS } from '@/data/homepage';

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  return (
    <div className="bg-brand-green text-ivory border-b border-brand-green-hover">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="text-ivory/75 hover:text-ivory p-1 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <p className="font-sans text-[11px] sm:text-xs font-normal tracking-[0.08em] text-center truncate">
          {ANNOUNCEMENTS[index]}
        </p>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next announcement"
          className="text-ivory/75 hover:text-ivory p-1 transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
