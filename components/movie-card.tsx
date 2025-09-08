import Card from "@/components/ui/card";

export default function MovieCard({ movie }: { movie: any }) {
  return (
    <Card className="bg-zinc-900 hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-3">
        <h3 className="font-semibold text-white">
          {movie.title} <span className="text-gray-400">({movie.year})</span>
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2">{movie.overview}</p>
        <p className="text-sm text-[var(--brand)] mt-2">{movie.rationale}</p>
      </div>
    </Card>
  );
}
