const nodes = [
  { left: "50%", top: "14%" },
  { left: "30%", top: "30%" },
  { left: "70%", top: "30%" },
  { left: "20%", top: "54%" },
  { left: "50%", top: "50%" },
  { left: "80%", top: "54%" },
  { left: "30%", top: "78%" },
  { left: "70%", top: "78%" }
];

const links = [
  [0, 1],
  [0, 2],
  [1, 4],
  [2, 4],
  [1, 3],
  [2, 5],
  [3, 6],
  [5, 7],
  [4, 6],
  [4, 7]
];

export function MoleculeOrb() {
  return (
    <div className="relative mx-auto h-[290px] w-[290px] animate-fade-in-up rounded-full border border-violet-300/35 bg-slate-950/50 shadow-[0_0_120px_rgba(139,92,246,0.35)]">
      <svg className="absolute inset-0 h-full w-full">
        {links.map((link, index) => {
          const a = nodes[link[0]];
          const b = nodes[link[1]];
          return (
            <line
              key={`${link[0]}-${link[1]}-${index}`}
              x1={a.left}
              y1={a.top}
              x2={b.left}
              y2={b.top}
              stroke="rgba(125,211,252,0.35)"
              strokeWidth="1.2"
            />
          );
        })}
      </svg>

      {nodes.map((node, index) => (
        <span
          key={`${node.left}-${node.top}-${index}`}
          className="absolute h-3 w-3 animate-pulseSoft rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.9)]"
          style={{
            left: node.left,
            top: node.top,
            transform: "translate(-50%, -50%)",
            animationDelay: `${index * 0.15}s`
          }}
        />
      ))}

      <div className="absolute inset-6 animate-spin-slow rounded-full border border-cyan-300/35" />
      <div className="absolute inset-10 animate-spin-slow-reverse rounded-full border border-violet-300/25" />
    </div>
  );
}