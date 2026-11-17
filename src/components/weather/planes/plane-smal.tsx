"use client";

import { useId } from "react";

export const PLANE_SMAL_SOURCE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" aria-hidden="true">
<!-- Dashboard weertegel: vliegtuig-silhouet "smal" (eigen ontwerp, Voorstel). Kleuren via CSS-variabelen. Lichtposities (viewBox): beacon:[52,11.4],tail:[3,3],near:[36,26.6],far:[45.5,6.8] -->
<defs><linearGradient id="plane-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--plane-top)"/><stop offset="1" stop-color="var(--plane-under)"/></linearGradient></defs>
<path d="M52 12 L44 6.5 L48 6.5 L61 11.6 Z" fill="var(--plane-far)"/><path d="M6 12 L2 2.5 L9 2.5 L20 11.6 Z" fill="var(--plane-body)"/><path d="M4 15 C4 12.6 8 11.6 14 11.6 L84 11.6 C92 11.6 97 13.4 99 15 C97 16.6 92 18 84 18 L14 18 C8 18 4 17 4 15 Z" fill="url(#plane-g)"/><path d="M8 15.5 L2 19.5 L7 19.5 L17 16.5 Z" fill="var(--plane-under)"/><path d="M50 16.5 L34 27 L40 27 L63 17.2 Z" fill="var(--plane-under)"/><ellipse cx="49" cy="20.6" rx="5.5" ry="2" fill="var(--plane-under)"/>
</svg>
`;

export function PlaneSmal() {
  const id = "plane-" + useId().replace(/:/g, "");
  return <span className="weather-plane-art" dangerouslySetInnerHTML={{ __html: PLANE_SMAL_SOURCE.replaceAll("plane-g", id) }} />;
}
