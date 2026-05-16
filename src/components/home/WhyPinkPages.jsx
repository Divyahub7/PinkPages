import { FaPenNib, FaHeart, FaUsers } from "react-icons/fa6";

const features = [
  {
    icon: FaPenNib,
    color: "bg-pink-100 text-[#EE6983]",
    title: "Write Freely",
    desc: "Express yourself without limits. Your stories, your voice, your way — with a beautiful rich text editor.",
  },
  {
    icon: FaHeart,
    color: "bg-pink-100 text-[#EE6983]",
    title: "React & Connect",
    desc: "Leave reactions, drop comments, reply to thoughts. Real conversations around real stories.",
  },
  {
    icon: FaUsers,
    color: "bg-pink-100 text-[#EE6983]",
    title: "Build Your Presence",
    desc: "Every author gets a profile. Share your story, grow your readers, leave your mark on PinkPages.",
  },
];

export default function WhyPinkPages() {
  return (
    <section className="py-20 px-6 bg-white m-b">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#EE6983] text-sm font-semibold uppercase tracking-widest mb-2">
            Why PinkPages?
          </p>
          <h2
            className="text-4xl font-black text-[#2d2d2d]"
            style={{ fontFamily: "Quicksand, sans-serif" }}
          >
            More than just a blog
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* eslint-disable-next-line */}
          {features.map(({ icon: FeatureIcon, color, title, desc }) => (
            <div
              key={title}
              className="bg-[#FCF5EE] rounded-3xl p-8 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300 border border-pink-100"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}
              >
                <FeatureIcon size={22} />
              </div>
              <h3 className="text-xl font-bold text-[#2d2d2d]">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
