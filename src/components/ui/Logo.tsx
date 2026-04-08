import { Link } from 'react-router-dom';

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex flex-col items-center justify-center ${className}`}>
      <span className="font-serif text-2xl md:text-3xl tracking-[0.3em] uppercase text-[#111111] font-light">
        SURRIELS
      </span>
      <span className="text-[0.6rem] md:text-xs tracking-[0.2em] uppercase text-gray-500 mt-1 font-sans">
        Timeless Elegance
      </span>
    </Link>
  );
}
