import type { Art } from "@/lib/catalog";

function shade(hex: string, amount: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((n >> 16) & 255) * (1 + amount));
  const g = clamp(((n >> 8) & 255) * (1 + amount));
  const b = clamp((n & 255) * (1 + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const INK = "#2B2F34";
const METAL = "#A9AFB5";
const BLUE = "#1A56A8";

function Label({ x, y, w, h, text, fill = BLUE, color = "#fff", size = 13 }: { x: number; y: number; w: number; h: number; text?: string; fill?: string; color?: string; size?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={3} fill={fill} />
      {text ? (
        <text x={x + w / 2} y={y + h / 2 + size * 0.36} textAnchor="middle" fontSize={size} fontWeight={700} fill={color} letterSpacing="0.06em" direction="ltr" fontFamily="system-ui, Arial, sans-serif">
          {text}
        </text>
      ) : null}
    </g>
  );
}

function Shape({ kind, c, label }: { kind: Art["kind"]; c: string; label?: string }) {
  const d = shade(c, -0.14);
  const dd = shade(c, -0.28);
  const l = shade(c, 0.12);
  switch (kind) {
    case "bucket":
      return (
        <g>
          <path d="M60 58 Q100 30 140 58" fill="none" stroke={METAL} strokeWidth="4" />
          <path d="M52 62 L148 62 L141 160 Q100 170 59 160 Z" fill={c} stroke={dd} strokeWidth="1.5" />
          <ellipse cx="100" cy="62" rx="48" ry="9" fill={l} stroke={dd} strokeWidth="1.5" />
          <path d="M54 76 L146 76" stroke={d} strokeWidth="2" />
          <Label x={62} y={98} w={76} h={36} text={label} fill={c === "#FFFFFF" || c === "#F4F1EA" || c === "#EDEBE6" ? BLUE : INK} />
          <path d="M60 150 Q100 158 140 150" stroke={d} strokeWidth="2" fill="none" />
        </g>
      );
    case "tube":
      return (
        <g>
          <path d="M92 28 L108 28 L104 58 L96 58 Z" fill={INK} />
          <rect x="70" y="56" width="60" height="12" rx="3" fill={d} />
          <rect x="72" y="66" width="56" height="104" rx="6" fill={c} stroke={dd} strokeWidth="1.5" />
          <Label x={78} y={96} w={44} h={44} text={label} fill={c === "#FFFFFF" || c === "#EDEBE6" ? BLUE : INK} size={11} />
          <rect x="70" y="164" width="60" height="8" rx="2" fill={d} />
        </g>
      );
    case "bag":
      return (
        <g>
          <path d="M50 52 Q55 44 62 50 Q70 42 78 50 Q86 42 94 50 Q102 42 110 50 Q118 42 126 50 Q134 42 142 50 Q148 46 150 52 L156 160 Q100 172 44 160 Z" fill={c} stroke={dd} strokeWidth="1.5" />
          <path d="M52 64 L148 64" stroke={d} strokeWidth="2" strokeDasharray="4 4" />
          <Label x={64} y={92} w={72} h={40} text={label} fill={c === "#EDEBE6" ? BLUE : "#fff"} color={c === "#EDEBE6" ? "#fff" : INK} />
          <path d="M60 150 Q100 158 140 150" stroke={d} strokeWidth="2" fill="none" />
        </g>
      );
    case "drill":
      return (
        <g>
          <rect x="30" y="66" width="26" height="22" rx="4" fill={METAL} />
          <rect x="20" y="72" width="14" height="10" rx="2" fill={INK} />
          <path d="M54 56 L138 56 Q150 56 150 70 L150 88 Q150 98 138 98 L54 98 Z" fill={c} stroke={dd} strokeWidth="1.5" />
          <path d="M98 98 L126 98 L118 146 L92 146 Z" fill={INK} />
          <rect x="80" y="144" width="62" height="26" rx="6" fill={INK} />
          <rect x="86" y="150" width="22" height="6" rx="2" fill={c} />
          <circle cx="132" cy="77" r="8" fill={d} />
        </g>
      );
    case "board":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(0 ${i * -16})`}>
              <path d="M40 140 L130 120 L170 138 L80 160 Z" fill={i === 2 ? c : d} stroke={dd} strokeWidth="1.2" />
              <path d="M40 140 L80 160 L80 168 L40 148 Z" fill={dd} />
              <path d="M80 160 L170 138 L170 146 L80 168 Z" fill={shade(c, -0.2)} />
            </g>
          ))}
        </g>
      );
    case "faucet":
      return (
        <g>
          <rect x="70" y="160" width="60" height="10" rx="4" fill={dd} />
          <rect x="88" y="90" width="24" height="72" rx="8" fill={c} stroke={dd} strokeWidth="1.5" />
          <path d="M100 96 Q100 44 146 50 L150 66 Q116 62 112 96 Z" fill={c} stroke={dd} strokeWidth="1.5" />
          <rect x="144" y="62" width="12" height="10" rx="2" fill={dd} />
          <path d="M88 108 L58 96" stroke={dd} strokeWidth="8" strokeLinecap="round" />
        </g>
      );
    case "pipe":
      return (
        <g fill="none" strokeLinecap="round">
          <path d="M40 150 L110 150 Q140 150 140 120 L140 44" stroke={c} strokeWidth="26" />
          <path d="M40 150 L110 150 Q140 150 140 120 L140 44" stroke={dd} strokeWidth="26" strokeOpacity="0.12" />
          <path d="M40 142 L110 142" stroke={l} strokeWidth="4" />
          <rect x="124" y="84" width="32" height="18" rx="4" fill={dd} />
          <rect x="70" y="134" width="18" height="32" rx="4" fill={dd} />
        </g>
      );
    case "socket":
      return (
        <g>
          <rect x="44" y="44" width="112" height="112" rx="16" fill={c} stroke="#CFCCC5" strokeWidth="2" />
          <rect x="58" y="58" width="84" height="84" rx="12" fill={shade(c, -0.05)} stroke="#CFCCC5" />
          <circle cx="100" cy="100" r="28" fill={shade(c, -0.08)} stroke="#CFCCC5" />
          <circle cx="88" cy="94" r="4" fill={INK} />
          <circle cx="112" cy="94" r="4" fill={INK} />
          <rect x="97" y="106" width="6" height="12" rx="2" fill={INK} />
        </g>
      );
    case "screws":
      return (
        <g>
          {[
            [60, 50, -20],
            [100, 44, 0],
            [140, 54, 18],
          ].map(([x, y, r], i) => (
            <g key={i} transform={`rotate(${r} ${x} ${y + 55})`}>
              <ellipse cx={x} cy={y} rx="16" ry="6" fill={l} stroke={dd} />
              <path d={`M${x - 16} ${y} L${x - 16} ${y + 6} Q${x} ${y + 12} ${x + 16} ${y + 6} L${x + 16} ${y} `} fill={c} />
              <path d={`M${x - 5} ${y + 8} L${x + 5} ${y + 8} L${x + 4} ${y + 96} L${x} ${y + 110} L${x - 4} ${y + 96} Z`} fill={c} stroke={dd} />
              {Array.from({ length: 9 }).map((_, k) => (
                <path key={k} d={`M${x - 6} ${y + 18 + k * 9} L${x + 6} ${y + 22 + k * 9}`} stroke={dd} strokeWidth="1.5" />
              ))}
              <path d={`M${x - 6} ${y - 1} L${x + 6} ${y + 1}`} stroke={dd} strokeWidth="2" />
            </g>
          ))}
        </g>
      );
    case "roller":
      return (
        <g>
          <rect x="48" y="44" width="104" height="40" rx="18" fill={c} stroke={dd} strokeWidth="1.5" />
          <rect x="48" y="44" width="104" height="12" rx="6" fill={l} opacity="0.5" />
          <path d="M152 64 L166 64 L166 104 L104 104 L104 124" fill="none" stroke={METAL} strokeWidth="6" strokeLinejoin="round" />
          <rect x="94" y="120" width="20" height="54" rx="8" fill={INK} />
        </g>
      );
    case "brush":
      return (
        <g>
          <rect x="88" y="30" width="24" height="70" rx="10" fill={c} stroke={dd} strokeWidth="1.5" />
          <circle cx="100" cy="42" r="4" fill={dd} />
          <rect x="76" y="98" width="48" height="24" rx="3" fill={METAL} />
          <path d="M76 122 L124 122 L128 170 L72 170 Z" fill="#3A3F45" />
          <path d="M84 126 L82 168 M94 126 L94 168 M106 126 L106 168 M116 126 L118 168" stroke="#555B62" strokeWidth="2" />
        </g>
      );
    case "tile":
      return (
        <g>
          {[
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1],
          ].map(([i, j]) => (
            <path
              key={`${i}${j}`}
              d={`M${100 + (i - j) * 44} ${70 + (i + j) * 24} l44 24 l-44 24 l-44 -24 Z`}
              fill={(i + j) % 2 ? c : l}
              stroke="#fff"
              strokeWidth="4"
            />
          ))}
          <path d="M12 118 L100 166 L188 118 L188 126 L100 174 L12 126 Z" fill={d} />
        </g>
      );
    case "plank":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(0 ${i * -22})`}>
              <path d="M30 150 L150 112 L172 122 L52 160 Z" fill={i === 2 ? c : d} stroke={dd} />
              <path d="M30 150 L52 160 L52 170 L30 160 Z" fill={dd} />
              <path d="M52 160 L172 122 L172 132 L52 170 Z" fill={shade(c, -0.22)} />
              <path d="M60 148 Q100 134 140 124" stroke={dd} strokeOpacity="0.4" fill="none" />
            </g>
          ))}
        </g>
      );
    case "hose":
      return (
        <g fill="none">
          {[54, 42, 30].map((r, i) => (
            <circle key={r} cx="100" cy="104" r={r} stroke={i === 0 ? c : d} strokeWidth="12" />
          ))}
          <path d="M154 104 Q170 104 170 130 L170 160" stroke={c} strokeWidth="12" strokeLinecap="round" />
          <rect x="160" y="156" width="20" height="18" rx="4" fill="#E4B343" />
        </g>
      );
    case "gloves":
      return (
        <g>
          <path d="M66 172 L66 120 Q52 104 54 84 Q56 74 64 80 L74 100 L72 46 Q72 36 81 36 Q90 36 90 46 L92 88 L94 34 Q94 24 103 24 Q112 24 112 34 L112 88 L116 42 Q117 32 126 33 Q134 34 134 44 L132 96 L140 60 Q142 52 150 54 Q157 57 155 66 L144 124 L140 172 Z" fill={c} stroke={dd} strokeWidth="1.5" />
          <path d="M66 150 L140 150 L140 172 L66 172 Z" fill={dd} />
        </g>
      );
    case "helmet":
      return (
        <g>
          <path d="M44 132 Q44 60 100 56 Q156 60 156 132 Z" fill={c} stroke={dd} strokeWidth="1.5" />
          <path d="M92 56 L92 132 M108 56 L108 132" stroke={d} strokeWidth="6" />
          <path d="M26 132 L174 132 Q176 146 160 146 L40 146 Q24 146 26 132 Z" fill={d} stroke={dd} />
        </g>
      );
    case "spray":
      return (
        <g>
          <rect x="84" y="28" width="32" height="20" rx="4" fill={INK} />
          <rect x="112" y="34" width="10" height="6" fill={INK} />
          <path d="M72 58 Q72 46 100 46 Q128 46 128 58 Z" fill={METAL} />
          <rect x="72" y="58" width="56" height="112" rx="6" fill={c} stroke={dd} strokeWidth="1.5" />
          <rect x="72" y="92" width="56" height="40" fill={shade(c, 0.18)} opacity="0.35" />
          <rect x="70" y="164" width="60" height="8" rx="2" fill={METAL} />
        </g>
      );
    case "cable":
      return (
        <g>
          <ellipse cx="100" cy="100" rx="66" ry="66" fill={shade(c === "#1C1F23" ? "#5B6168" : c, -0.1)} />
          {[56, 48, 40, 32].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} fill="none" stroke={c} strokeWidth="7" />
          ))}
          <circle cx="100" cy="100" r="18" fill="#F1EFEA" stroke={dd} />
          <path d="M156 110 Q176 130 162 170" fill="none" stroke={c} strokeWidth="7" strokeLinecap="round" />
        </g>
      );
    case "trowel":
      return (
        <g>
          <path d="M40 150 L140 150 L164 120 L64 120 Z" fill={METAL} stroke="#7E858C" />
          <path d="M40 150 L140 150 L140 156 L40 156 Z" fill="#7E858C" />
          <path d="M104 120 L104 96 L126 80" fill="none" stroke="#7E858C" strokeWidth="6" strokeLinejoin="round" />
          <rect x="118" y="56" width="22" height="40" rx="8" transform="rotate(50 129 76)" fill={c} />
        </g>
      );
    case "level":
      return (
        <g>
          <rect x="16" y="84" width="168" height="36" rx="5" fill={c} stroke={dd} strokeWidth="1.5" />
          <rect x="16" y="84" width="168" height="8" rx="4" fill={l} opacity="0.6" />
          <rect x="84" y="92" width="32" height="20" rx="6" fill="#DDEFD9" stroke={dd} />
          <circle cx="100" cy="102" r="5" fill="#9CCB8F" />
          <rect x="32" y="94" width="14" height="16" rx="4" fill="#DDEFD9" stroke={dd} />
          <rect x="154" y="94" width="14" height="16" rx="4" fill="#DDEFD9" stroke={dd} />
        </g>
      );
    case "hammer":
      return (
        <g>
          <rect x="92" y="60" width="18" height="114" rx="7" fill={c} stroke={dd} strokeWidth="1.5" transform="rotate(-12 100 120)" />
          <path d="M52 44 L136 36 Q150 36 152 48 L152 62 L60 70 Q48 70 48 58 Z" fill={INK} />
          <path d="M152 48 Q168 40 172 26" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        </g>
      );
    case "foam":
      return (
        <g>
          <path d="M106 30 L150 30" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <rect x="92" y="28" width="16" height="20" rx="3" fill={INK} />
          <path d="M70 60 Q70 46 100 46 Q130 46 130 60 Z" fill={METAL} />
          <rect x="70" y="60" width="60" height="112" rx="8" fill={c} stroke={dd} strokeWidth="1.5" />
          <Label x={78} y={94} w={44} h={30} text="PU" fill={INK} />
        </g>
      );
    case "tape":
      return (
        <g>
          <ellipse cx="100" cy="110" rx="62" ry="62" fill={c} stroke={dd} strokeWidth="1.5" />
          <ellipse cx="100" cy="110" rx="34" ry="34" fill="#F1EFEA" stroke={dd} />
          <ellipse cx="100" cy="110" rx="28" ry="28" fill="none" stroke="#CFCCC5" strokeWidth="4" />
          <path d="M154 140 L180 164 L168 176 L146 150 Z" fill={c} stroke={dd} />
        </g>
      );
    case "shower":
      return (
        <g>
          <path d="M60 176 L60 60 Q60 40 84 40 L130 40" fill="none" stroke={c} strokeWidth="10" strokeLinecap="round" />
          <path d="M60 176 L60 60 Q60 40 84 40 L130 40" fill="none" stroke={dd} strokeWidth="10" strokeOpacity="0.15" strokeLinecap="round" />
          <ellipse cx="136" cy="54" rx="30" ry="10" fill={c} stroke={dd} strokeWidth="1.5" />
          {[-16, -6, 4, 14].map((dx) => (
            <path key={dx} d={`M${136 + dx} 70 L${134 + dx * 1.3} 110`} stroke="#8FB3DA" strokeWidth="3" strokeLinecap="round" />
          ))}
          <rect x="50" y="124" width="20" height="26" rx="5" fill={dd} />
        </g>
      );
    case "bottle":
      return (
        <g>
          <rect x="88" y="30" width="24" height="18" rx="3" fill={INK} />
          <path d="M72 64 Q72 48 92 48 L108 48 Q128 48 128 64 L128 164 Q128 172 120 172 L80 172 Q72 172 72 164 Z" fill={c} stroke={dd} strokeWidth="1.5" />
          <path d="M128 70 Q148 72 148 92 Q148 112 128 112" fill="none" stroke={c} strokeWidth="10" />
          <Label x={78} y={104} w={44} h={40} text={label} fill={c === "#FFFFFF" || c === "#EDEBE6" ? BLUE : "#fff"} color={c === "#FFFFFF" || c === "#EDEBE6" ? "#fff" : INK} size={11} />
        </g>
      );
    case "grinder":
      return (
        <g>
          <circle cx="54" cy="116" r="34" fill={METAL} stroke="#7E858C" strokeWidth="2" />
          <circle cx="54" cy="116" r="8" fill={INK} />
          <rect x="52" y="86" width="30" height="30" rx="6" fill={INK} />
          <path d="M78 84 L158 84 Q172 84 172 100 Q172 116 158 116 L78 116 Z" fill={c} stroke={dd} strokeWidth="1.5" />
          <rect x="100" y="90" width="40" height="8" rx="3" fill={d} />
          <path d="M70 84 L60 50" stroke={INK} strokeWidth="10" strokeLinecap="round" />
        </g>
      );
    case "bulb":
      return (
        <g>
          <path d="M100 32 Q146 32 146 80 Q146 104 124 124 L124 138 L76 138 L76 124 Q54 104 54 80 Q54 32 100 32 Z" fill={c} stroke={dd} strokeWidth="1.5" />
          <path d="M80 60 Q86 46 100 44" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7" />
          <rect x="76" y="138" width="48" height="30" rx="4" fill={METAL} />
          <path d="M76 146 L124 146 M76 156 L124 156" stroke="#7E858C" strokeWidth="3" />
          <path d="M90 168 L110 168 L104 176 L96 176 Z" fill={INK} />
        </g>
      );
    case "profile":
      return (
        <g>
          {[0, 1].map((i) => (
            <g key={i} transform={`translate(${i * 18} ${i * -18})`}>
              <path d="M26 150 L150 60 L164 66 L40 156 Z" fill={i ? c : d} stroke={dd} />
              <path d="M40 156 L164 66 L164 78 L40 168 Z" fill={shade(c, -0.18)} />
              <path d="M26 150 L40 156 L40 168 L26 162 Z" fill={dd} />
            </g>
          ))}
        </g>
      );
    case "block":
      return (
        <g>
          <path d="M40 80 L100 56 L160 80 L100 104 Z" fill={l} stroke={dd} strokeWidth="1.2" />
          <path d="M40 80 L100 104 L100 164 L40 140 Z" fill={c} stroke={dd} strokeWidth="1.2" />
          <path d="M100 104 L160 80 L160 140 L100 164 Z" fill={d} stroke={dd} strokeWidth="1.2" />
        </g>
      );
    case "lock":
      return (
        <g>
          <path d="M70 96 L70 70 Q70 40 100 40 Q130 40 130 70 L130 96" fill="none" stroke={METAL} strokeWidth="12" />
          <rect x="56" y="92" width="88" height="78" rx="10" fill={c} stroke={dd} strokeWidth="1.5" />
          <circle cx="100" cy="124" r="9" fill={INK} />
          <rect x="96" y="128" width="8" height="20" rx="3" fill={INK} />
        </g>
      );
  }
}

export function ProductArt({ art, className, title }: { art: Art; className?: string; title?: string }) {
  const c = art.color ?? "#9CA3AA";
  return (
    <svg viewBox="0 0 200 200" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <ellipse cx="100" cy="182" rx="72" ry="8" fill="#1C1F23" opacity="0.07" />
      <Shape kind={art.kind} c={c} label={art.label} />
    </svg>
  );
}
