// components/Spinner.tsx

export default function Spinner({ size = 32 }: { size?: number }) {
  const lines = Array.from({ length: 8 });

  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      {lines.map((_, i) => {
        const rotation = i * 45; // 8 lines, 45deg apart
        const delay = -(1 - i / 8); // stagger the animation
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 origin-bottom rounded-full bg-[#FF5722]"
            style={{
              width: size * 0.08,
              height: size * 0.28,
              marginLeft: -(size * 0.04),
              transform: `rotate(${rotation}deg) translateY(-${size * 0.42}px)`,
              animation: "melo-spinner-fade 1s linear infinite",
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}

      <style>{`
        @keyframes melo-spinner-fade {
          0% { opacity: 1; }
          100% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}