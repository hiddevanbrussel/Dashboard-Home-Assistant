import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ArtProps = { className?: string };

function Frame({ className, children }: ArtProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 160 120" className={cn("h-full w-full", className)} aria-hidden>
      {children}
    </svg>
  );
}

function ArtClean(props: ArtProps) {
  return (
    <Frame {...props}>
      <circle cx="118" cy="28" r="10" fill="#FFE08A" />
      <rect x="28" y="78" width="72" height="8" rx="4" fill="#E8E4F5" />
      <path d="M54 78c4-18 10-34 22-46" stroke="#2B2B2B" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="76" cy="28" r="10" fill="#C4B5FD" stroke="#2B2B2B" strokeWidth="3" />
      <path d="M42 86c8 6 28 8 44 2" stroke="#A78BFA" strokeWidth="6" strokeLinecap="round" fill="none" />
    </Frame>
  );
}

function ArtPlant(props: ArtProps) {
  return (
    <Frame {...props}>
      <rect x="62" y="78" width="36" height="22" rx="6" fill="#FDE68A" stroke="#2B2B2B" strokeWidth="3" />
      <path d="M80 78V42" stroke="#2B2B2B" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="62" cy="50" rx="18" ry="12" fill="#86EFAC" stroke="#2B2B2B" strokeWidth="3" />
      <ellipse cx="98" cy="44" rx="16" ry="11" fill="#4ADE80" stroke="#2B2B2B" strokeWidth="3" />
      <ellipse cx="80" cy="34" rx="12" ry="9" fill="#BBF7D0" stroke="#2B2B2B" strokeWidth="3" />
    </Frame>
  );
}

function ArtBook(props: ArtProps) {
  return (
    <Frame {...props}>
      <rect x="36" y="38" width="88" height="56" rx="8" fill="#93C5FD" stroke="#2B2B2B" strokeWidth="3" />
      <path d="M80 38v56" stroke="#2B2B2B" strokeWidth="3" />
      <rect x="44" y="50" width="26" height="6" rx="3" fill="#DBEAFE" />
      <rect x="44" y="64" width="20" height="6" rx="3" fill="#DBEAFE" />
      <rect x="90" y="50" width="26" height="6" rx="3" fill="#DBEAFE" />
    </Frame>
  );
}

function ArtDog(props: ArtProps) {
  return (
    <Frame {...props}>
      <ellipse cx="86" cy="78" rx="34" ry="18" fill="#FDBA74" stroke="#2B2B2B" strokeWidth="3" />
      <circle cx="58" cy="52" r="18" fill="#FED7AA" stroke="#2B2B2B" strokeWidth="3" />
      <ellipse cx="44" cy="38" rx="7" ry="10" fill="#FDBA74" stroke="#2B2B2B" strokeWidth="3" />
      <ellipse cx="70" cy="38" rx="7" ry="10" fill="#FDBA74" stroke="#2B2B2B" strokeWidth="3" />
      <circle cx="52" cy="50" r="2.5" fill="#2B2B2B" />
      <circle cx="64" cy="50" r="2.5" fill="#2B2B2B" />
      <circle cx="58" cy="58" r="3" fill="#2B2B2B" />
      <path d="M116 78c8-2 14 6 10 12" stroke="#2B2B2B" strokeWidth="3" strokeLinecap="round" fill="none" />
    </Frame>
  );
}

function ArtBed(props: ArtProps) {
  return (
    <Frame {...props}>
      <rect x="28" y="58" width="104" height="28" rx="10" fill="#C4B5FD" stroke="#2B2B2B" strokeWidth="3" />
      <rect x="36" y="42" width="40" height="20" rx="8" fill="#FDE68A" stroke="#2B2B2B" strokeWidth="3" />
      <path d="M28 86v10M132 86v10" stroke="#2B2B2B" strokeWidth="3" strokeLinecap="round" />
    </Frame>
  );
}

function ArtShirt(props: ArtProps) {
  return (
    <Frame {...props}>
      <path
        d="M52 36l28 10 28-10 14 16-16 8v36H54V60L38 52z"
        fill="#7DD3FC"
        stroke="#2B2B2B"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

function ArtUtensils(props: ArtProps) {
  return (
    <Frame {...props}>
      <circle cx="80" cy="64" r="32" fill="#FEF3C7" stroke="#2B2B2B" strokeWidth="3" />
      <circle cx="80" cy="64" r="16" fill="#FDE68A" stroke="#2B2B2B" strokeWidth="3" />
      <path d="M48 36c8 8 10 20 6 28" stroke="#2B2B2B" strokeWidth="3" strokeLinecap="round" fill="none" />
    </Frame>
  );
}

function ArtCart(props: ArtProps) {
  return (
    <Frame {...props}>
      <path d="M36 40h18l14 40h48l12-28H62" stroke="#2B2B2B" strokeWidth="3" strokeLinejoin="round" fill="#BFDBFE" />
      <circle cx="72" cy="92" r="7" fill="#F9A8D4" stroke="#2B2B2B" strokeWidth="3" />
      <circle cx="108" cy="92" r="7" fill="#F9A8D4" stroke="#2B2B2B" strokeWidth="3" />
    </Frame>
  );
}

function ArtSmile(props: ArtProps) {
  return (
    <Frame {...props}>
      <circle cx="80" cy="44" r="16" fill="#F8C8B0" stroke="#2B2B2B" strokeWidth="3" />
      <path d="M56 64c0 22 48 22 48 0" fill="#A78BFA" stroke="#2B2B2B" strokeWidth="3" />
      <rect x="62" y="88" width="12" height="16" rx="4" fill="#3B82F6" stroke="#2B2B2B" strokeWidth="3" />
      <rect x="86" y="88" width="12" height="16" rx="4" fill="#3B82F6" stroke="#2B2B2B" strokeWidth="3" />
    </Frame>
  );
}

function ArtBike(props: ArtProps) {
  return (
    <Frame {...props}>
      <circle cx="50" cy="78" r="16" fill="#BFDBFE" stroke="#2B2B2B" strokeWidth="3" />
      <circle cx="112" cy="78" r="16" fill="#BBF7D0" stroke="#2B2B2B" strokeWidth="3" />
      <path d="M50 78l28-28h24l10 28M78 50l-12 28h28" stroke="#2B2B2B" strokeWidth="3" strokeLinejoin="round" fill="none" />
    </Frame>
  );
}

function ArtTrash(props: ArtProps) {
  return (
    <Frame {...props}>
      <rect x="52" y="42" width="56" height="52" rx="8" fill="#CBD5F5" stroke="#2B2B2B" strokeWidth="3" />
      <path d="M46 42h68M70 42V32h20v10" stroke="#2B2B2B" strokeWidth="3" strokeLinecap="round" />
      <path d="M70 56v24M80 56v24M90 56v24" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
    </Frame>
  );
}

function ArtBackpack(props: ArtProps) {
  return (
    <Frame {...props}>
      <rect x="50" y="40" width="60" height="56" rx="14" fill="#F9A8D4" stroke="#2B2B2B" strokeWidth="3" />
      <path d="M62 40c0-10 36-10 36 0" stroke="#2B2B2B" strokeWidth="3" fill="none" />
      <rect x="68" y="62" width="24" height="14" rx="5" fill="#FDE68A" stroke="#2B2B2B" strokeWidth="3" />
    </Frame>
  );
}

function ArtStar(props: ArtProps) {
  return (
    <Frame {...props}>
      <path
        d="M80 24l12 24 26 4-19 18 5 26-24-13-24 13 5-26-19-18 26-4z"
        fill="#FDE68A"
        stroke="#2B2B2B"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

function ArtWrench(props: ArtProps) {
  return (
    <Frame {...props}>
      <path
        d="M108 34a16 16 0 0 0-18 18L54 88a10 10 0 1 0 18 18l36-36a16 16 0 0 0 18-18l-14 6-10-10z"
        fill="#FDBA74"
        stroke="#2B2B2B"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

function ArtDefault(props: ArtProps) {
  return (
    <Frame {...props}>
      <circle cx="80" cy="62" r="28" fill="#E9D5FF" stroke="#2B2B2B" strokeWidth="3" />
      <path d="M68 62l8 8 16-16" stroke="#2B2B2B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Frame>
  );
}

const ART_BY_ICON: Record<string, (props: ArtProps) => ReactElement> = {
  Brush: ArtClean,
  Trash2: ArtTrash,
  Dog: ArtDog,
  Book: ArtBook,
  Shirt: ArtShirt,
  BedDouble: ArtBed,
  Utensils: ArtUtensils,
  ShoppingCart: ArtCart,
  Smile: ArtSmile,
  Bike: ArtBike,
  Backpack: ArtBackpack,
  Star: ArtStar,
  Wrench: ArtWrench,
};

export function TaskArt({ icon, className }: { icon: string | null; className?: string }) {
  const Art = (icon && ART_BY_ICON[icon]) || ArtDefault;
  return <Art className={className} />;
}

export function CelebrationArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 220 160" className={cn("h-full w-full", className)} aria-hidden>
      <circle cx="28" cy="36" r="4" fill="#F9A8D4" />
      <circle cx="196" cy="44" r="5" fill="#FDE68A" />
      <circle cx="188" cy="112" r="3" fill="#A78BFA" />
      <path d="M18 88l10-4M202 72l8 6M40 24l6-8" stroke="#C4B5FD" strokeWidth="3" strokeLinecap="round" />
      <circle cx="78" cy="48" r="16" fill="#F8C8B0" stroke="#2B2B2B" strokeWidth="3" />
      <path d="M54 70c4 28 44 28 48 0" fill="#A78BFA" stroke="#2B2B2B" strokeWidth="3" />
      <rect x="62" y="112" width="14" height="22" rx="5" fill="#3B82F6" stroke="#2B2B2B" strokeWidth="3" />
      <rect x="82" y="112" width="14" height="22" rx="5" fill="#3B82F6" stroke="#2B2B2B" strokeWidth="3" />
      <circle cx="142" cy="46" r="16" fill="#F8C8B0" stroke="#2B2B2B" strokeWidth="3" />
      <path d="M118 68c4 28 44 28 48 0" fill="#4ADE80" stroke="#2B2B2B" strokeWidth="3" />
      <rect x="126" y="110" width="14" height="22" rx="5" fill="#F59E0B" stroke="#2B2B2B" strokeWidth="3" />
      <rect x="146" y="110" width="14" height="22" rx="5" fill="#F59E0B" stroke="#2B2B2B" strokeWidth="3" />
      <path d="M102 58c8-10 18-10 26 0" stroke="#2B2B2B" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
