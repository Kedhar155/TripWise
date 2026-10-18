"use client";

import { useId } from "react";

/** Template artwork, with unique SVG reference IDs for safe reuse. */
export function BackgroundArt() {
  const id = useId();
  return <div className="retro-art" aria-hidden="true">
  <svg className="art compass" viewBox="-76 -76 152 152" aria-hidden="true">
    <defs>
      <g id={`${id}-cp`}><path d="M0-58L7-7L0 0Z" fill="#A4622B" fillOpacity=".3"/><path d="M0-58L-7-7L0 0Z"/></g>
      <path id={`${id}-ic`} d="M0-40L4-4L0 0L-4-4Z"/>
    </defs>
    <g fill="none" stroke="#A4622B" strokeOpacity=".4" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <circle r="72" strokeDasharray="2 5"/><circle r="60"/><circle r="54" strokeDasharray="1 5.9"/><circle r="40"/>
      <use href={`#${id}-ic`} transform="rotate(45)"/><use href={`#${id}-ic`} transform="rotate(135)"/><use href={`#${id}-ic`} transform="rotate(225)"/><use href={`#${id}-ic`} transform="rotate(315)"/>
      <use href={`#${id}-cp`}/><use href={`#${id}-cp`} transform="rotate(90)"/><use href={`#${id}-cp`} transform="rotate(180)"/><use href={`#${id}-cp`} transform="rotate(270)"/>
      <circle r="3.5" fill="#F6EAD0"/><circle r="1.4" fill="#A4622B" stroke="none"/>
      <g stroke="none" fill="#A4622B" fillOpacity=".6" fontFamily="Georgia,serif" textAnchor="middle">
        <text y="-64" fontSize="10">N</text><text y="72" fontSize="9">S</text>
        <text x="66" y="3" fontSize="9">E</text><text x="-66" y="3" fontSize="9">W</text>
      </g>
    </g>
  </svg>


  <svg className="art globe" viewBox="-64 -42 128 84" aria-hidden="true">
    <g fill="none" stroke="#1B3A5C" strokeOpacity=".28" strokeWidth="1.2">
      <circle r="38"/>
      <path className="meridian m1" d="M0-38A38 38 0 0 1 0 38" vectorEffect="non-scaling-stroke"/>
      <path className="meridian m2" d="M0-38A38 38 0 0 1 0 38" vectorEffect="non-scaling-stroke"/>
      <path className="meridian m3" d="M0-38A38 38 0 0 1 0 38" vectorEffect="non-scaling-stroke"/>
      <path d="M-38 0H38M-35 -15H35M-35 15H35"/>
    </g>
    <ellipse rx="60" ry="17" transform="rotate(-20)" fill="none" stroke="#E8702A" strokeOpacity=".55" strokeWidth="1.4" strokeDasharray="4 4"/>
  </svg>


  <div className="art route" aria-hidden="true">
    <svg viewBox="0 100 300 60" preserveAspectRatio="none"><path d="M0 150Q120 70 300 150" fill="none" stroke="#2A9D8F" strokeOpacity=".55" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke"/></svg>
    <svg className="plane" viewBox="0 0 14 14"><path d="M13 3L1 5.5L5.5 8L3 12Z" fill="none" stroke="#2A9D8F" strokeOpacity=".7" strokeWidth="1" strokeLinejoin="round"/></svg>
  </div>


  <i className="dia" style={{ left: "43%", top: "12%" }}></i>
  <i className="dia" style={{ left: "60%", top: "8%" }}></i>
  <i className="dia" style={{ left: "37%", top: "30%" }}></i>
  <i className="dia" style={{ left: "7%", top: "46%" }}></i>


  <svg className="art stamp" viewBox="-32 -32 64 64" aria-hidden="true">
    <g transform="rotate(-12)" fill="none" stroke="#C4472B" strokeOpacity=".5" strokeWidth="1.4" strokeLinejoin="round">
      <circle r="28"/><circle r="23" strokeDasharray="2 3"/>
      <path d="M0-9L2.6-2.8L9-2.8L4 1.4L5.8 8L0 4.2L-5.8 8L-4 1.4L-9-2.8L-2.6-2.8Z"/><path d="M-17 11H17"/>
      <text y="-13" textAnchor="middle" fontSize="5.5" fontFamily="monospace" fill="#C4472B" fillOpacity=".55" stroke="none">TRIPWISE</text>
      <text y="18" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#C4472B" fillOpacity=".55" stroke="none">VISITED</text>
    </g>
  </svg>

  <div className="coords" aria-hidden="true">LAT 35.01 N · LON 135.76 E</div>


  </div>;
}
