import { useCallback, useEffect, useState } from 'react';

import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

import { Image } from '@ahomevilla-hotel/node-sdk';
import { ImageThumbButton } from './ImageThumbButton';
import { cn } from '@/lib/utils';

interface ImageGalleryCarouselProps {
  slides: Image[];
  options?: EmblaOptionsType;
  className?: string;
  thumbClassName?: string;
  thumbContainerClassName?: string;
}

const ImageGalleryCarousel = ({
  slides,
  options,
  className,
  thumbClassName,
  thumbContainerClassName,
}: ImageGalleryCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;

      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;

    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on('select', onSelect).on('reInit', onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <div className='max-w-[560px]'>
      {/* main */}
      <div className='overflow-hidden' ref={emblaMainRef}>
        <div className='flex touch-pan-y ml-[calc(1rem*-1)]'>
          {slides.map((slide) => (
            <div
              key={slide.publicId}
              className='min-w-0 flex-[0_0_100%] pl-4'
              style={{ transform: 'translate3d(0, 0, 0)' }}
            >
              <div
                className={cn(
                  'rounded-xl flex h-[300px] select-none shadow-md overflow-hidden',
                  className,
                )}
              >
                <img
                  src={slide.url}
                  alt='slide'
                  className='object-cover object-center w-full h-full'
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* thumbs */}
      <div className={cn('mt-3', thumbContainerClassName)}>
        <div className='overflow-hidden' ref={emblaThumbsRef}>
          <div className='flex flex-row ml-[calc(0.75rem*-1)]'>
            {slides.map((slide, index) => (
              <ImageThumbButton
                key={slide.publicId}
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                src={slide.url}
                className={thumbClassName}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryCarousel;
