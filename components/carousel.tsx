"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import MovieCard from "@/components/movie-card";

export default function Carousel({ movies }: { movies: any[] }) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slides: { perView: 5, spacing: 15 },
    breakpoints: {
      "(max-width: 1024px)": { slides: { perView: 3, spacing: 10 } },
      "(max-width: 640px)": { slides: { perView: 2, spacing: 8 } },
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider">
      {movies.map((m) => (
        <div key={m.id} className="keen-slider__slide">
          <MovieCard movie={m} />
        </div>
      ))}
    </div>
  );
}
