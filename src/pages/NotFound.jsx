import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCF5EE] px-4">
      {/* Big 404 */}
      <div className="relative mb-6">
        <p
          className="text-[10rem] font-bold leading-none select-none"
          style={{
            color: "#fce7f3",
            fontFamily: "Georgia, serif",
            lineHeight: 1,
          }}
        >
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl">🌸</span>
        </div>
      </div>

      {/* Message */}
      <h1
        className="text-2xl font-bold text-rose-900 mb-2"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Page not found
      </h1>
      <p className="text-pink-400 text-sm text-center max-w-xs mb-8 leading-relaxed">
        Oops! Looks like this page has wandered off. Let's get you back to the
        good stuff.
      </p>

      {/* Buttons */}
      <div className="flex gap-3">
        <Link
          to="/"
          className="px-6 py-2.5 rounded-full bg-pink-400 text-white text-sm font-semibold hover:bg-pink-500 transition"
        >
          Go Home
        </Link>
        <Link
          to="/all-posts"
          className="px-6 py-2.5 rounded-full border border-pink-300 text-pink-500 text-sm font-semibold hover:bg-pink-50 transition"
        >
          Explore Posts
        </Link>
      </div>
    </div>
  );
}
