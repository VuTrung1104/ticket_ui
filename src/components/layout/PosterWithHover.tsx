import Image from "next/image";

type PosterWithHoverProps = {
  src: string;
  alt: string;
  rating?: number;
};

export default function PosterWithHover({
  src,
  alt,
  rating = 8.5,
}: PosterWithHoverProps) {
  return (
    <div className="rounded-xl overflow-hidden shadow-md relative aspect-[2/3] group">
      {/* Poster */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Rating */}
      <span className="absolute top-2 left-2 flex items-center gap-1 rounded bg-black/80 text-white px-2 py-1 etxt-sm font-semibold z-10">
        ⭐ {rating.toFixed(1)}
      </span>
    </div>
  );
}
