const particles = [
  { x: "8%", y: "14%", delay: "0.2s", duration: "7.5s" },
  { x: "17%", y: "68%", delay: "1.1s", duration: "8.4s" },
  { x: "28%", y: "32%", delay: "2.2s", duration: "7.1s" },
  { x: "41%", y: "80%", delay: "0.8s", duration: "9.2s" },
  { x: "56%", y: "22%", delay: "1.8s", duration: "8.7s" },
  { x: "68%", y: "56%", delay: "2.6s", duration: "7.3s" },
  { x: "81%", y: "18%", delay: "0.4s", duration: "8.1s" },
  { x: "88%", y: "70%", delay: "1.5s", duration: "9.3s" }
];

export function FuturisticBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-accent-sweep" />
      <div className="absolute inset-0 bg-hero-grid bg-[size:72px_72px] opacity-[0.2]" />
      <div className="absolute inset-0 aurora-overlay opacity-70" />

      <div
        className="absolute -left-24 top-[10%] h-64 w-64 animate-drift rounded-full bg-cyan-400/20 blur-3xl"
        style={{ animationDuration: "14s" }}
      />
      <div
        className="absolute right-[-5%] top-[22%] h-72 w-72 animate-drift rounded-full bg-violet-500/20 blur-3xl"
        style={{ animationDuration: "18s", animationDirection: "reverse" }}
      />

      {particles.map((particle) => (
        <span
          key={`${particle.x}-${particle.y}`}
          className="absolute h-1.5 w-1.5 animate-pulseSoft rounded-full bg-sky-200/85 shadow-[0_0_18px_rgba(147,197,253,0.95)]"
          style={{
            left: particle.x,
            top: particle.y,
            animationDelay: particle.delay,
            animationDuration: particle.duration
          }}
        />
      ))}
    </div>
  );
}