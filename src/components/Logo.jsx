import React from "react";

function Logo() {
  return (
    <div className="flex items-center">
      <img
        src="/pinkpages_logo.png"
        alt="PinkPages"
        className="h-20 w-22"
        style={{ mixBlendMode: "multiply" }}
      />
    </div>
  );
}

export default Logo;
