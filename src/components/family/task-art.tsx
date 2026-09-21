import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ArtProps = { className?: string };

function Frame({ className, children }: ArtProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 200 140" className={cn("h-full w-full", className)} aria-hidden>
      {children}
    </svg>
  );
}

function ArtClean(props: ArtProps) {
  return (
    <Frame {...props}>
      <circle cx="158" cy="28" r="14" fill="#FFE08A" />
      <path d="M28 112h92" stroke="#E5E7EB" strokeWidth="10" strokeLinecap="round" />
      <path d="M78 104c8-28 18-52 40-72" stroke="#111827" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="122" cy="28" r="13" fill="#C4B5FD" stroke="#111827" strokeWidth="4" />
      <path d="M46 108c16 12 52 14 78 2" stroke="#A78BFA" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M46 108c16 12 52 14 78 2" stroke="#111827" strokeWidth="4" strokeLinecap="round" fill="none" />
    </Frame>
  );
}

function ArtPlant(props: ArtProps) {
  return (
    <Frame {...props}>
      <ellipse cx="100" cy="118" rx="36" ry="6" fill="#E5E7EB" />
      <path d="M70 92h60l-8 26H78z" fill="#FDE68A" stroke="#111827" strokeWidth="4" strokeLinejoin="round" />
      <path d="M100 92V48" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="72" cy="62" rx="24" ry="16" fill="#86EFAC" stroke="#111827" strokeWidth="4" />
      <ellipse cx="128" cy="54" rx="22" ry="15" fill="#4ADE80" stroke="#111827" strokeWidth="4" />
      <ellipse cx="100" cy="40" rx="16" ry="12" fill="#BBF7D0" stroke="#111827" strokeWidth="4" />
    </Frame>
  );
}

function ArtBook(props: ArtProps) {
  return (
    <Frame {...props}>
      <rect x="38" y="36" width="124" height="78" rx="12" fill="#93C5FD" stroke="#111827" strokeWidth="4" />
      <path d="M100 36v78" stroke="#111827" strokeWidth="4" />
      <rect x="50" y="52" width="36" height="8" rx="4" fill="#DBEAFE" />
      <rect x="50" y="70" width="28" height="8" rx="4" fill="#DBEAFE" />
      <rect x="114" y="52" width="36" height="8" rx="4" fill="#DBEAFE" />
      <rect x="114" y="70" width="28" height="8" rx="4" fill="#DBEAFE" />
    </Frame>
  );
}

function ArtDog(props: ArtProps) {
  return (
    <Frame {...props}>
      <ellipse cx="118" cy="96" rx="44" ry="22" fill="#FDBA74" stroke="#111827" strokeWidth="4" />
      <circle cx="72" cy="62" r="24" fill="#FED7AA" stroke="#111827" strokeWidth="4" />
      <ellipse cx="54" cy="42" rx="9" ry="13" fill="#FDBA74" stroke="#111827" strokeWidth="4" />
      <ellipse cx="90" cy="42" rx="9" ry="13" fill="#FDBA74" stroke="#111827" strokeWidth="4" />
      <circle cx="64" cy="58" r="3.5" fill="#111827" />
      <circle cx="80" cy="58" r="3.5" fill="#111827" />
      <circle cx="72" cy="70" r="4" fill="#111827" />
      <path d="M156 92c12-4 18 8 12 16" stroke="#111827" strokeWidth="4" strokeLinecap="round" fill="none" />
    </Frame>
  );
}

function ArtBed(props: ArtProps) {
  return (
    <Frame {...props}>
      <rect x="30" y="68" width="140" height="36" rx="14" fill="#C4B5FD" stroke="#111827" strokeWidth="4" />
      <rect x="42" y="46" width="54" height="28" rx="12" fill="#FDE68A" stroke="#111827" strokeWidth="4" />
      <path d="M30 104v14M170 104v14" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
    </Frame>
  );
}

function ArtShirt(props: ArtProps) {
  return (
    <Frame {...props}>
      <path
        d="M62 32l38 14 38-14 18 20-20 10v48H64V62L44 52z"
        fill="#7DD3FC"
        stroke="#111827"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

function ArtUtensils(props: ArtProps) {
  return (
    <Frame {...props}>
      <circle cx="100" cy="74" r="40" fill="#FEF3C7" stroke="#111827" strokeWidth="4" />
      <circle cx="100" cy="74" r="20" fill="#FDE68A" stroke="#111827" strokeWidth="4" />
    </Frame>
  );
}

function ArtCart(props: ArtProps) {
  return (
    <Frame {...props}>
      <path d="M40 40h24l18 50h62l16-34H78" fill="#BFDBFE" stroke="#111827" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="92" cy="108" r="9" fill="#F9A8D4" stroke="#111827" strokeWidth="4" />
      <circle cx="138" cy="108" r="9" fill="#F9A8D4" stroke="#111827" strokeWidth="4" />
    </Frame>
  );
}

function ArtSmile(props: ArtProps) {
  return (
    <Frame {...props}>
      <circle cx="100" cy="40" r="18" fill="#F8C8B0" stroke="#111827" strokeWidth="4" />
      <path d="M72 64c2 30 54 30 56 0" fill="#A78BFA" stroke="#111827" strokeWidth="4" />
      <rect x="80" y="104" width="14" height="20" rx="6" fill="#3B82F6" stroke="#111827" strokeWidth="4" />
      <rect x="106" y="104" width="14" height="20" rx="6" fill="#3B82F6" stroke="#111827" strokeWidth="4" />
    </Frame>
  );
}

function ArtBike(props: ArtProps) {
  return (
    <Frame {...props}>
      <circle cx="62" cy="92" r="20" fill="#BFDBFE" stroke="#111827" strokeWidth="4" />
      <circle cx="142" cy="92" r="20" fill="#BBF7D0" stroke="#111827" strokeWidth="4" />
      <path d="M62 92l36-36h28l14 36M98 56l-16 36h36" stroke="#111827" strokeWidth="4" strokeLinejoin="round" fill="none" />
    </Frame>
  );
}

function ArtTrash(props: ArtProps) {
  return (
    <Frame {...props}>
      <rect x="64" y="46" width="72" height="64" rx="10" fill="#C7D2FE" stroke="#111827" strokeWidth="4" />
      <path d="M56 46h88M86 46V34h28v12" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
      <path d="M86 64v28M100 64v28M114 64v28" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
    </Frame>
  );
}

function ArtBackpack(props: ArtProps) {
  return (
    <Frame {...props}>
      <rect x="62" y="42" width="76" height="70" rx="18" fill="#F9A8D4" stroke="#111827" strokeWidth="4" />
      <path d="M78 42c0-14 44-14 44 0" stroke="#111827" strokeWidth="4" fill="none" />
      <rect x="84" y="70" width="32" height="18" rx="6" fill="#FDE68A" stroke="#111827" strokeWidth="4" />
    </Frame>
  );
}

function ArtStar(props: ArtProps) {
  return (
    <Frame {...props}>
      <path
        d="M100 24l16 32 36 5-26 24 6 34-32-18-32 18 6-34-26-24 36-5z"
        fill="#FDE68A"
        stroke="#111827"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

function ArtWrench(props: ArtProps) {
  return (
    <Frame {...props}>
      <path
        d="M138 34a20 20 0 0 0-22 22L70 102a12 12 0 1 0 22 22l46-46a20 20 0 0 0 22-22l-18 8-12-12z"
        fill="#FDBA74"
        stroke="#111827"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

function ArtDefault(props: ArtProps) {
  return (
    <Frame {...props}>
      <circle cx="100" cy="70" r="34" fill="#E9D5FF" stroke="#111827" strokeWidth="4" />
      <path d="M84 70l10 10 22-22" stroke="#111827" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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
  Sprout: ArtPlant,
};

export function TaskArt({ icon, className }: { icon: string | null; className?: string }) {
  const Art = (icon && ART_BY_ICON[icon]) || ArtDefault;
  return <Art className={className} />;
}

export function CelebrationArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 260 180" className={cn("h-full w-full", className)} aria-hidden>
      <circle cx="28" cy="40" r="5" fill="#F9A8D4" />
      <circle cx="232" cy="48" r="6" fill="#FDE68A" />
      <circle cx="220" cy="128" r="4" fill="#A78BFA" />
      <path d="M20 96l14-6M236 80l12 8M44 26l8-10" stroke="#C4B5FD" strokeWidth="4" strokeLinecap="round" />
      <circle cx="88" cy="52" r="20" fill="#F8C8B0" stroke="#111827" strokeWidth="4" />
      <path d="M58 78c4 36 56 36 60 0" fill="#A78BFA" stroke="#111827" strokeWidth="4" />
      <rect x="70" y="128" width="16" height="26" rx="7" fill="#3B82F6" stroke="#111827" strokeWidth="4" />
      <rect x="94" y="128" width="16" height="26" rx="7" fill="#3B82F6" stroke="#111827" strokeWidth="4" />
      <circle cx="172" cy="50" r="20" fill="#F8C8B0" stroke="#111827" strokeWidth="4" />
      <path d="M142 76c4 36 56 36 60 0" fill="#4ADE80" stroke="#111827" strokeWidth="4" />
      <rect x="154" y="126" width="16" height="26" rx="7" fill="#F59E0B" stroke="#111827" strokeWidth="4" />
      <rect x="178" y="126" width="16" height="26" rx="7" fill="#F59E0B" stroke="#111827" strokeWidth="4" />
      <path d="M118 62c10-14 24-14 36 0" stroke="#111827" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}
