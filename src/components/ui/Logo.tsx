import { Link } from 'react-router-dom';

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`font-serif text-2xl font-bold tracking-widest uppercase ${className}`}>
      C<span className="text-[#E5B80B]">E</span>NES<span className="text-[#8A9A5B]">K</span>
    </Link>
  );
}
