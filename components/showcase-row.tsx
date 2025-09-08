import Carousel from "@/components/carousel";

const demo = [
  // just posters + tiny info; you can replace later with a /popular endpoint
  { id: 1, title: "Inception", year: "2010", poster: "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg", overview:"", rationale:"Popular mind-bender." },
  { id: 2, title: "Interstellar", year: "2014", poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", overview:"", rationale:"Epic, hopeful sci-fi." },
  { id: 3, title: "The Dark Knight", year: "2008", poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", overview:"", rationale:"Gritty, intense classic." },
  { id: 4, title: "La La Land", year: "2016", poster: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg", overview:"", rationale:"Bittersweet comfort." },
  { id: 5, title: "Up", year: "2009", poster: "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/mFvoEwSfLqbcWwFsDjQebn9bzFe.jpg", overview:"", rationale:"Wholesome, uplifting." },
  { id: 6, title: "Whiplash", year: "2014", poster: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/7fn624j5lj3xTme2SgiLCeuedmO.jpg", overview:"", rationale:"Driven & cathartic." },
];

export default function ShowcaseRow() {
  return (
    <section className="w-full flex justify-center mt-10">
      <div className="w-full max-w-5xl px-4">
        <h2 className="text-2xl section-title mb-3">Trending now</h2>
        <Carousel movies={demo} />
      </div>
    </section>
  );
}
