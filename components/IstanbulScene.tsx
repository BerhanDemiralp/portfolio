import { useId } from "react";

export default function IstanbulScene() {
  const id = useId().replace(/:/g, "");
  return <div id="robot-home" className="istanbul" data-robot-stop="city" aria-hidden="true">
    <svg viewBox="0 0 560 320" fill="none" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}sky`} x2="0" y2="320" gradientUnits="userSpaceOnUse"><stop stopColor="#263e43"/><stop offset=".68" stopColor="#829588"/><stop offset="1" stopColor="#c3bda0"/></linearGradient>
        <linearGradient id={`${id}sea`} x1="0" y1="210" x2="0" y2="320" gradientUnits="userSpaceOnUse"><stop stopColor="#627f7b"/><stop offset="1" stopColor="#263f43"/></linearGradient>
        <radialGradient id={`${id}glow`}><stop stopColor="#f4dcac" stopOpacity=".4"/><stop offset="1" stopColor="#f4dcac" stopOpacity="0"/></radialGradient>
      </defs>
      <path fill={`url(#${id}sky)`} d="M0 0h560v320H0z"/>
      <circle cx="407" cy="91" r="105" fill={`url(#${id}glow)`}/><circle cx="407" cy="91" r="30" fill="#ecdbb8"/>
      <path d="M0 179Q75 149 135 177T285 164T420 170T560 151V235H0Z" fill="#657e77"/>
      <g stroke="#c6cec0" strokeWidth="1.2" opacity=".6">
        <path d="M298 172V126m196 46v-60M298 135Q390 205 494 121M274 177h268"/>
        <path d="M315 147v30m20-18v18m20-11v11m20-7v7m20-8v8m20-14v14m20-23v23m20-35v35m20-49v49"/>
      </g>
      <path d="M0 214v-20h24v-9h19v13h22v-22h22v19h31v-10h23v11h30v-15h20v25h25v-8h32v14h49v-13h23v10h30v-16h16v18h39v-12h25v10h54v-16h22v12h24v-9h18v18h35v-17h21v26Z" fill="#345456"/>
      <g fill="#28464b">
        <path d="M81 198V121h31v77ZM76 124l20-40 21 40ZM94 84v-9h4v9ZM78 134h37v5H78Z"/>
        <path d="M161 207v-38h88v38Zm11-38a33 33 0 0 1 66 0ZM202 136v-10h3v10Zm-49 71V144h5v63Zm-3-63 5-17 5 17Zm103 63V144h5v63Zm-3-63 5-17 5 17Z"/>
      </g>
      <g fill="#c9c9a6" opacity=".7"><rect x="90" y="143" width="4" height="9" rx="2"/><rect x="101" y="143" width="4" height="9" rx="2"/><path d="M187 185h4v11h-4zm15 0h4v11h-4zm15 0h4v11h-4z"/></g>
      <path fill={`url(#${id}sea)`} d="M0 214h560v106H0z"/>
      <g stroke="#c5ccb6" strokeLinecap="round" opacity=".25"><path d="M365 230h82m-66 9h50m-78 12h92m-66 13h43m-82 14h117M35 245h98m-69 20h77m-106 28h68m100-61h75m-62 23h44m229-10h39m-59 49h56"/></g>
      <g transform="translate(290 251)"><path d="M0 0h48l-7 9H8Z" fill="#223d41"/><path d="M10-10h27V0H10Z" fill="#c8ceba"/><path d="M15-15h17v5H15Zm7-8h2v8h-2Z" fill="#304d50"/><path d="M13-7h6m3 0h6m3 0h3" stroke="#426164" strokeWidth="3"/></g>
      <g stroke="#344e51" strokeWidth="1.5" strokeLinecap="round"><path d="M286 76q5-5 10 0 5-5 10 0m-49 22q4-4 8 0 4-4 8 0"/></g>
    </svg>
    <div className="city-label"><span>ISTANBUL</span><span>41.0082° N · 28.9784° E</span></div>
  </div>;
}
