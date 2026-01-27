import React from "react";

function Hero() {
  return (
    <div
      className="w-full h-[90vh] flex items-center justify-center text-center bg-cover bg-center relative rounded-b-lg"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1515339760107-1952b7a08454?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      {/* Gradient overlay instead of solid black */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30 rounded-b-lg"></div>

      <div className="relative text-gray-700 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Welcome to My Blog
        </h1>
        <p className="text-lg md:text-2xl drop-shadow-md">
          Discover stories, tutorials, and insights from around the world
        </p>
      </div>
    </div>
  );
}

export default Hero;
