import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaPenNib, FaArrowRight } from "react-icons/fa6";

export default function HeroSection() {
  const authStatus = useSelector((state) => state.auth.status);

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#FCF5EE]">
      {/* Background blobs */}
      <div className="absolute -top-20 -right-20 w-100 h-100 rounded-full bg-[#FFC4C4] opacity-30 blur-3xl" />
      <div className="absolute -bottom-15 -left-15 w-75 h-75 rounded-full bg-[#FFC4C4] opacity-20 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-[#EE6983] text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <FaPenNib size={11} />A space to think, write & connect
            </div>

            <h1
              className="text-5xl md:text-7xl font-black text-[#2d2d2d] leading-tight mb-6"
              style={{ fontFamily: "Quicksand, sans-serif" }}
            >
              Where
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EE6983] to-[#FFC4C4]">
                Stories
              </span>
              <br />
              Bloom.
            </h1>

            <p className="text-gray-500 text-lg max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed">
              PinkPages is your cozy corner of the internet — read stories that
              matter, write ones that last.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              {authStatus ? (
                <Link
                  to="/add-post"
                  className="flex items-center justify-center gap-2 bg-[#EE6983] hover:bg-[#d45570] text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-pink-200"
                >
                  <FaPenNib size={14} />
                  Write a Post
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="flex items-center justify-center gap-2 bg-[#EE6983] hover:bg-[#d45570] text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-pink-200"
                >
                  Get Started
                  <FaArrowRight size={14} />
                </Link>
              )}
              <Link
                to="/all-posts"
                className="flex items-center justify-center gap-2 bg-white hover:bg-pink-50 text-[#EE6983] font-semibold px-8 py-3.5 rounded-full border border-[#FFC4C4] transition-all duration-200"
              >
                Explore Posts
              </Link>
            </div>
          </div>

          {/* Right — decorative card stack */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-72 h-80">
              {/* Card 3 */}
              <div className="absolute top-8 left-8 w-56 h-64 bg-[#FFC4C4] rounded-3xl rotate-6 opacity-40" />
              {/* Card 2 */}
              <div className="absolute top-4 left-4 w-56 h-64 bg-[#EE6983] rounded-3xl rotate-3 opacity-30" />
              {/* Card 1 — main */}
              <div className="absolute top-0 left-0 w-56 h-64 bg-white rounded-3xl shadow-xl border border-pink-100 p-6 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                    <FaPenNib size={14} className="text-[#EE6983]" />
                  </div>
                  <div className="h-3 bg-pink-100 rounded-full w-3/4 mb-2" />
                  <div className="h-3 bg-pink-50 rounded-full w-full mb-2" />
                  <div className="h-3 bg-pink-50 rounded-full w-5/6 mb-2" />
                  <div className="h-3 bg-pink-50 rounded-full w-4/6" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#FFC4C4] flex items-center justify-center text-xs font-bold text-white">
                    R
                  </div>
                  <div>
                    <div className="h-2 bg-pink-100 rounded w-16 mb-1" />
                    <div className="h-2 bg-pink-50 rounded w-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
