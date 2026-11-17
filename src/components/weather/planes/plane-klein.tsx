"use client";

import { useId } from "react";

export const PLANE_KLEIN_SOURCE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" aria-hidden="true">
<!-- Dashboard weertegel: vliegtuig-silhouet "klein" (eigen ontwerp, Voorstel). Kleuren via CSS-variabelen. Lichtposities (viewBox): beacon:[52,12],tail:[5,4.6],near:[42,12.2],far:[66,12.2] -->
<defs><linearGradient id="plane-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--plane-top)"/><stop offset="1" stop-color="var(--plane-under)"/></linearGradient></defs>
<path d="M8 12 L4 4 L11 4 L20 12 Z" fill="var(--plane-body)"/><path d="M6 15 C6 13 10 12 16 12 L82 12 C90 12 95 13.8 97 15.5 C95 17.2 90 18.5 82 18.5 L16 18.5 C10 18.5 6 17.2 6 15 Z" fill="url(#plane-g)"/><path d="M40 11 L68 11 L68 13 L40 13 Z" fill="var(--plane-under)"/><path d="M10 15.5 L4 18.5 L9 18.5 L18 16.6 Z" fill="var(--plane-under)"/><rect x="96" y="10" width="1.6" height="11" rx=".8" fill="var(--plane-under)" opacity=".6"/>
</svg>
`;

export function PlaneKlein() {
  const id = "plane-" + useId().replace(/:/g, "");
  return <span className="weather-plane-art" dangerouslySetInnerHTML={{ __html: PLANE_KLEIN_SOURCE.replaceAll("plane-g", id) }} />;
}
