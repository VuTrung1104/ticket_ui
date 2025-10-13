import MovieGrid from "./components/layout/MovieGrid";
import Poster from "./components/booking/Slider";
import QuickBooking from "./components/booking/QuickBooking";

export default function Home() {

  return (
    <main className="min-h-screen bg-[#181b24]">
      <Poster />
      <QuickBooking />
      <MovieGrid />
    </main>
  );
}