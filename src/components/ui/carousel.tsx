"use client";
import Image from "next/image";
import React, { useState, useRef, useId, useEffect } from "react";
import { IconArrowNarrowRight } from "@tabler/icons-react";

export interface SlideData {
  title: string;
  button: string;
  src: string;
  badge?: string;
  description?: string;
  link?: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);

  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, button, title } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10 cursor-pointer select-none"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-2xl overflow-hidden transition-all duration-150 ease-out shadow-2xl"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          <Image
            className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-100 transition-opacity duration-600 ease-in-out"
            style={{
              opacity: current === index ? 1 : 0.45,
            }}
            alt={title}
            src={src}
            width={1400}
            height={900}
            sizes="100vw"
            priority
            unoptimized
            onLoad={imageLoaded}
          />
          {current === index && (
            <div className="absolute inset-0 bg-black/40 transition-all duration-1000" />
          )}
        </div>

        <article
          className={`relative p-[4vmin] transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          {slide.badge && (
            <span className="inline-block mb-3 px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase text-white border border-white/30 shadow-sm">
              {slide.badge}
            </span>
          )}
          <h2 className="text-lg md:text-2xl lg:text-4xl font-bold relative drop-shadow-md">
            {title}
          </h2>
          {slide.description && (
            <p className="mt-2.5 text-xs md:text-sm text-white/90 max-w-sm mx-auto line-clamp-2 leading-relaxed drop-shadow">
              {slide.description}
            </p>
          )}
          <div className="flex justify-center">
            {slide.link ? (
              <a
                href={slide.link}
                onClick={(e) => e.stopPropagation()}
                className="mt-6 px-5 py-2.5 w-fit mx-auto sm:text-sm text-black bg-white font-bold h-11 border border-transparent text-xs flex justify-center items-center rounded-2xl hover:bg-slate-100 hover:shadow-xl transition duration-200 shadow-[0px_2px_8px_rgba(0,0,0,0.15)] cursor-pointer"
              >
                {button}
              </a>
            ) : (
              <button 
                onClick={(e) => e.stopPropagation()}
                className="mt-6 px-5 py-2.5 w-fit mx-auto sm:text-sm text-black bg-white font-bold h-11 border border-transparent text-xs flex justify-center items-center rounded-2xl hover:bg-slate-100 hover:shadow-xl transition duration-200 shadow-[0px_2px_8px_rgba(0,0,0,0.15)] cursor-pointer"
              >
                {button}
              </button>
            )}
          </div>
        </article>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={`w-11 h-11 flex items-center mx-2 justify-center bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-full focus:border-blue-600 focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 shadow-sm cursor-pointer ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-slate-700 w-5 h-5" />
    </button>
  );
};

export interface CarouselProps {
  slides: SlideData[];
}

export default function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const id = useId();

  return (
    <div
      className="relative w-[70vmin] h-[70vmin] mx-auto"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <ul
        className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out list-none p-0 m-0"
        style={{
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
          />
        ))}
      </ul>

      <div className="absolute flex justify-center w-full top-[calc(100%+1.5rem)] z-20">
        <CarouselControl
          type="previous"
          title="Slide anterior"
          handleClick={handlePreviousClick}
        />

        <CarouselControl
          type="next"
          title="Próximo slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}
