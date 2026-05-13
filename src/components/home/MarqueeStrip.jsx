import { FaStar } from "react-icons/fa6";

const items = [
  "Read",
  "Write",
  "React",
  "Explore",
  "Share",
  "Inspire",
  "Connect",
  "Bloom",
];

export default function MarqueeStrip() {
  return (
    <div className="bg-[#EE6983] py-4 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 mx-4 text-white font-bold text-sm uppercase tracking-widest"
          >
            <FaStar size={10} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
