import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaPenNib, FaArrowRight } from "react-icons/fa6";

export default function CTABanner() {
  const authStatus = useSelector((state) => state.auth.status);

  return (
    <section className="bg-[#FCF5EE] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-3xl px-10 py-16 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #EE6983, #FFC4C4)" }}
        >
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white opacity-10 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-white opacity-10 rounded-full" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <FaPenNib size={11} />
              Join PinkPages today
            </div>

            <h2
              className="text-4xl md:text-5xl font-black text-white mb-4"
              style={{ fontFamily: "Quicksand, sans-serif" }}
            >
              Ready to share
              <br />
              your story?
            </h2>

            <p className="text-white/80 text-base mb-8 max-w-md mx-auto">
              Every great story starts with a single word. Write yours on
              PinkPages — where every voice belongs.
            </p>

            {authStatus ? (
              <Link
                to="/add-post"
                className="inline-flex items-center gap-2 bg-white text-[#EE6983] font-bold px-8 py-3.5 rounded-full hover:bg-pink-50 transition shadow-lg"
              >
                <FaPenNib size={14} />
                Write a Post
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#EE6983] font-bold px-8 py-3.5 rounded-full hover:bg-pink-50 transition shadow-lg"
                >
                  Sign Up Free
                  <FaArrowRight size={14} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-white/20 text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/30 transition"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
