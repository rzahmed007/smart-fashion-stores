import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { HERO_SLIDES } from '@/data/homepage';
import { Button } from '@/components/ui/Button';

export function HeroBanner() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section aria-label="Featured Collections" className="relative bg-ivory border-b border-border">
      <div className="relative sfs-swiper">
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          slidesPerView={1}
          loop
          speed={650}
          pagination={{ clickable: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="w-full"
        >
          {HERO_SLIDES.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full overflow-hidden">
                {/* Desktop & Tablet Editorial Layout */}
                <div className="relative min-h-[460px] sm:min-h-[520px] lg:h-[600px] w-full">
                  <img
                    src={slide.image}
                    alt={slide.headline}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="h-[340px] sm:h-full w-full object-cover object-center sm:object-right lg:object-center"
                  />

                  {/* Subtle warm editorial scrim for readable typography on desktop/tablet */}
                  <div
                    className="hidden sm:block absolute inset-0 bg-gradient-to-r from-ivory via-ivory/85 via-45% to-transparent"
                    aria-hidden="true"
                  />

                  {/* Content Overlay (Desktop/Tablet left aligned; Mobile clean ivory card below image) */}
                  <div className="sm:absolute sm:inset-0 flex items-center bg-ivory sm:bg-transparent">
                    <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:py-12">
                      <div className="max-w-xl">
                        <p className="font-sans text-[11px] sm:text-xs font-medium uppercase tracking-[0.22em] text-brand-secondary">
                          {slide.collectionName}
                        </p>
                        {index === 0 ? (
                          <h1 className="mt-2.5 font-serif text-[34px] sm:text-[48px] lg:text-[62px] font-medium leading-[1.06] tracking-[-0.015em] text-ink">
                            {slide.headline}
                          </h1>
                        ) : (
                          <h2 className="mt-2.5 font-serif text-[34px] sm:text-[48px] lg:text-[62px] font-medium leading-[1.06] tracking-[-0.015em] text-ink">
                            {slide.headline}
                          </h2>
                        )}
                        <p className="mt-3.5 font-sans text-sm sm:text-base leading-relaxed text-ink-secondary max-w-md">
                          {slide.description}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          <Button asChild variant="primary" size="lg">
                            <Link to={slide.primaryCta.to}>{slide.primaryCta.label}</Link>
                          </Button>
                          <Button asChild variant="outline" size="lg">
                            <Link to={slide.secondaryCta.to}>{slide.secondaryCta.label}</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Manual Slider Controls */}
        <div className="hidden sm:flex items-center gap-2 absolute bottom-6 right-6 lg:right-10 z-10">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous slide"
            className="h-10 w-10 rounded-[4px] bg-ivory/90 border border-border text-ink hover:bg-brand-green hover:text-white hover:border-brand-green flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next slide"
            className="h-10 w-10 rounded-[4px] bg-ivory/90 border border-border text-ink hover:bg-brand-green hover:text-white hover:border-brand-green flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
