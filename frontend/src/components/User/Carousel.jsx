import React, { useState, useEffect } from 'react';
import { useTransition, animated } from '@react-spring/web';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = () => {
  const [index, setIndex] = useState(0);

  const banners = [
    {
      id: 'banner1',
      image: './src/assets/banner2.jpg',
      title: 'Summer Special Offer',
      description: 'Get 20% off on all bookings this summer!',
      overlayColor: 'from-blue-900/80',
    },
    {
      id: 'banner2',
      image: './src/assets/banner3.webp',
      title: 'Luxury Weekend Getaway',
      description: 'Experience luxury at its finest with our weekend packages',
      overlayColor: 'from-blue-900/80',
    },
    {
      id: 'banner3',
      image: './src/assets/banner4.jpg',
      title: 'Family Fun Package',
      description: 'Kids stay free! Limited time offer for family bookings',
      overlayColor: 'from-blue-900/80',
    },
  ];

  const transitions = useTransition(index, {
    key: index,
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
    config: { duration: 500 },
  });

  const nextSlide = () => {
    setIndex((state) => (state + 1) % banners.length);
  };

  const prevSlide = () => {
    setIndex((state) => (state - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {transitions((style, i) => {
        const banner = banners[i];
        return (
          <animated.div
            style={style}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${banner.overlayColor} via-transparent to-blue-900/30`}>
              <div className="absolute bottom-20 left-0 right-0 container mx-auto px-4">
                <div className="max-w-3xl">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    {banner.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-white/90">
                    {banner.description}
                  </p>
                </div>
              </div>
            </div>
          </animated.div>
        );
      })}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 
              ${i === index 
                ? 'bg-white scale-100' 
                : 'bg-white/50 hover:bg-white/75 scale-75 hover:scale-90'
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;

