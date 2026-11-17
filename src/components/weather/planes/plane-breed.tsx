"use client";

import { useId } from "react";

export const PLANE_BREED_SOURCE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" aria-hidden="true">
<!-- Dashboard weertegel: vliegtuig-silhouet "breed" (eigen ontwerp, Voorstel). Kleuren via CSS-variabelen. Lichtposities (viewBox): beacon:[50,10.4],tail:[2.5,1.6],near:[30,29],far:[42.5,5.4] -->
<defs><linearGradient id="plane-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--plane-top)"/><stop offset="1" stop-color="var(--plane-under)"/></linearGradient></defs>
<path d="M50 11 L41 5 L45.5 5 L60 10.6 Z" fill="var(--plane-far)"/><path d="M6 11 L1.5 1 L9.5 1 L22 10.6 Z" fill="var(--plane-body)"/><path d="M3 15 C3 11.8 8 10.6 15 10.6 L82 10.6 C91 10.6 97 12.8 99.5 15 C97 17.4 91 19.4 82 19.4 L15 19.4 C8 19.4 3 18.2 3 15 Z" fill="url(#plane-g)"/><path d="M8 16 L1.5 21 L7 21 L18 17.2 Z" fill="var(--plane-under)"/><path d="M48 18 L28 29.5 L35 29.5 L62 18.8 Z" fill="var(--plane-under)"/><ellipse cx="46" cy="22.6" rx="5.6" ry="2.1" fill="var(--plane-under)"/><ellipse cx="37" cy="26.2" rx="4.6" ry="1.8" fill="var(--plane-under)"/>
</svg>
`;

export function PlaneBreed() {
  const id = "plane-" + useId().replace(/:/g, "");
  return <span className="weather-plane-art" dangerouslySetInnerHTML={{ __html: PLANE_BREED_SOURCE.replaceAll("plane-g", id) }} />;
}
