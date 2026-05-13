export default function WaveDivider({
  topColor = "#FCF5EE",
  bottomColor = "white",
  flip = false,
}) {
  return (
    <div
      style={{ backgroundColor: bottomColor, lineHeight: 0 }}
      className={flip ? "rotate-180" : ""}
    >
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full"
        style={{ display: "block" }}
      >
        <path
          d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,20 1440,40 L1440,80 L0,80 Z"
          fill={topColor}
        />
      </svg>
    </div>
  );
}
