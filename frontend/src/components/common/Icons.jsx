/**
 * Central SVG Icon Library for Jay Kuldevi
 * Replaces all emojis with clean, consistent SVG icons.
 * Each icon accepts optional size, color, and style props.
 */

const d = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

const I = (paths, defaults = {}) => {
  const Icon = ({ size, color, style, className, ...rest }) => (
    <svg {...d} width={size || defaults.size || 20} height={size || defaults.size || 20} stroke={color || defaults.color || 'currentColor'} fill={defaults.fill || 'none'} style={style} className={className} {...rest}>
      {paths}
    </svg>
  );
  Icon.displayName = defaults.name || 'Icon';
  return Icon;
};

// ── GENERAL ──
export const IconStar = I(<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#FFD600" stroke="none" /></>, { name: 'Star', fill: 'currentColor' });
export const IconStarOutline = I(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />, { name: 'StarOutline' });
export const IconSparkles = I(
  <>
    <g transform="scale(1.2) translate(-2, -2)">
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" fill="#7C3AED" stroke="none" />
      <path d="M5 3v4" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 17v4" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 5h4" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 19h4" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
    </g>
  </>,
  { name: 'Sparkles' }
);
export const IconHeart = I(<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#EF4444" stroke="none" />, { name: 'Heart' });
export const IconHeartFilled = I(<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" stroke="none" />, { name: 'HeartFilled', fill: 'currentColor' });
export const IconGift = I(<><polyline points="20 12 20 22 4 22 4 12" fill="#EC4899" stroke="#EC4899" strokeWidth="1.5" strokeLinejoin="round" /><rect x="2" y="7" width="20" height="5" fill="#F9A8D4" stroke="#EC4899" strokeWidth="1.5" strokeLinejoin="round" /><line x1="12" y1="22" x2="12" y2="7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" fill="#F9A8D4" stroke="#EC4899" strokeWidth="1" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" fill="#F9A8D4" stroke="#EC4899" strokeWidth="1" /></>, { name: 'Gift' });
export const IconTruck = I(<><rect x="1" y="3" width="15" height="13" fill="#BAE6FD" stroke="#0EA5E9" strokeWidth="1.5" strokeLinejoin="round" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" fill="#0EA5E9" stroke="#0EA5E9" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="5.5" cy="18.5" r="2.5" fill="#0369A1" stroke="#0369A1" /><circle cx="18.5" cy="18.5" r="2.5" fill="#0369A1" stroke="#0369A1" /></>, { name: 'Truck' });
export const IconShoppingBag = I(<><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" fill="#F97316" stroke="#F97316" strokeWidth="1.5" strokeLinejoin="round" /><line x1="3" y1="6" x2="21" y2="6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /><path d="M16 10a4 4 0 0 1-8 0" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></>, { name: 'ShoppingBag' });
export const IconCreditCard = I(<><rect x="1" y="4" width="22" height="16" rx="2" ry="2" fill="#1E293B" stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" /><line x1="1" y1="10" x2="23" y2="10" stroke="#F59E0B" strokeWidth="3.5" /></>, { name: 'CreditCard' });
export const IconZap = I(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#3B82F6" stroke="none" />, { name: 'Zap' });
export const IconTag = I(<><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" fill="#F97316" stroke="#F97316" strokeWidth="1.5" strokeLinejoin="round" /><line x1="7" y1="7" x2="7.01" y2="7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /></>, { name: 'Tag' });
export const IconShield = I(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" strokeLinejoin="round" />, { name: 'Shield' });
export const IconLock = I(<><rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" strokeLinejoin="round" /><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" /></>, { name: 'Lock' });
export const IconRefresh = I(<><polyline points="23 4 23 10 17 10" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><polyline points="1 20 1 14 7 14" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" /></>, { name: 'Refresh' });
export const IconCheck = I(<polyline points="20 6 9 17 4 12" fill="none" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />, { name: 'Check' });
export const IconX = I(<><line x1="18" y1="6" x2="6" y2="18" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" /><line x1="6" y1="6" x2="18" y2="18" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" /></>, { name: 'X' });
export const IconSearch = I(<><circle cx="11" cy="11" r="8" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="1.5" /><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" /></>, { name: 'Search' });
export const IconMenu2 = I(<><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></>, { name: 'Menu2' });
export const IconCamera = I(<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="#F43F5E" stroke="#F43F5E" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="12" cy="13" r="4" fill="none" stroke="#fff" strokeWidth="2" /></>, { name: 'Camera' });
export const IconFile = I(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" strokeLinejoin="round" /><polyline points="14 2 14 8 20 8" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinejoin="round" /><line x1="16" y1="13" x2="8" y2="13" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" /><line x1="16" y1="17" x2="8" y2="17" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" /><polyline points="10 9 9 9 8 9" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" /></>, { name: 'File' });
export const IconWarning = I(<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round" /><line x1="12" y1="9" x2="12" y2="13" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" /><line x1="12" y1="17" x2="12.01" y2="17" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" /></>, { name: 'Warning' });
export const IconParty = I(<><path d="M5.8 11.3L2 22l10.7-3.8" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 3h.01" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" /><path d="M22 8h.01" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" /><path d="M15 2h.01" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" /><path d="M22 20h.01" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" /><path d="M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" /><path d="M22 13l-4.16-1.39a1.1 1.1 0 0 0-1.4.74v0a1.1 1.1 0 0 1-.9.8l-4.74.59" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" /><path d="M7.5 7.17l2.22 1.48a1.65 1.65 0 0 0 2.23-.42v0a1.65 1.65 0 0 1 2.12-.55L18 11" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" /></>, { name: 'Party' });
// ── PEOPLE ──
export const IconBoy = I(<><circle cx="12" cy="5.5" r="3.5" fill="#FECACA" stroke="#F87171" strokeWidth="1.2" /><circle cx="10.8" cy="5" r="0.5" fill="#7F1D1D" /><circle cx="13.2" cy="5" r="0.5" fill="#7F1D1D" /><path d="M10.5 7q1.5 1 3 0" fill="none" stroke="#EF4444" strokeWidth="1" strokeLinecap="round" /><path d="M9 9h6l1 4H8z" fill="#3B82F6" stroke="#2563EB" strokeWidth="1" strokeLinejoin="round" /><path d="M8 9 C8 8 9.5 7.5 12 7.5 C14.5 7.5 16 8 16 9" fill="#3B82F6" stroke="#2563EB" strokeWidth="1" /><rect x="9" y="13" width="2.5" height="4" rx="0.5" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="1" /><rect x="12.5" y="13" width="2.5" height="4" rx="0.5" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="1" /><rect x="8.5" y="17" width="3" height="1.5" rx="0.5" fill="#1E293B" /><rect x="12.5" y="17" width="3" height="1.5" rx="0.5" fill="#1E293B" /></>, { name: 'Boy' });
export const IconGirl = I(<>
  {/* Hair - sides */}
  <path d="M8 6 C7 4 7 2 9 2 C9 4 9 6 9 6z" fill="#F97316" />
  <path d="M16 6 C17 4 17 2 15 2 C15 4 15 6 15 6z" fill="#F97316" />
  {/* Head */}
  <circle cx="12" cy="5.5" r="3.5" fill="#FECACA" stroke="#F9A8A8" strokeWidth="1.2" />
  {/* Eyes */}
  <circle cx="10.8" cy="5" r="0.5" fill="#7F1D1D" />
  <circle cx="13.2" cy="5" r="0.5" fill="#7F1D1D" />
  {/* Smile */}
  <path d="M10.5 7q1.5 1 3 0" fill="none" stroke="#EF4444" strokeWidth="1" strokeLinecap="round" />
  {/* Bow / Hair tie */}
  <path d="M11 3 C11 2.5 12 2.2 12 2.5 C12 2.2 13 2.5 13 3 C12.5 3.2 11.5 3.2 11 3z" fill="#FB7185" />
  {/* Body - Dress/Jacket pink */}
  <path d="M8 9 C8 8 9.5 7.5 12 7.5 C14.5 7.5 16 8 16 9" fill="#EC4899" stroke="#DB2777" strokeWidth="1" />
  <path d="M8 9 L7.5 14 H16.5 L16 9z" fill="#EC4899" stroke="#DB2777" strokeWidth="1" strokeLinejoin="round" />
  {/* Skirt flare */}
  <path d="M7.5 14 L6.5 17 H17.5 L16.5 14z" fill="#F472B6" stroke="#EC4899" strokeWidth="1" />
  {/* Arms */}
  <rect x="5.5" y="9" width="2" height="4.5" rx="1" fill="#EC4899" stroke="#DB2777" strokeWidth="1" />
  <rect x="16.5" y="9" width="2" height="4.5" rx="1" fill="#EC4899" stroke="#DB2777" strokeWidth="1" />
  {/* Legs */}
  <rect x="9" y="17" width="2.5" height="3.5" rx="0.5" fill="#DB2777" stroke="#BE185D" strokeWidth="1" />
  <rect x="12.5" y="17" width="2.5" height="3.5" rx="0.5" fill="#DB2777" stroke="#BE185D" strokeWidth="1" />
  {/* Boots - fluffy white */}
  <rect x="8.5" y="20" width="3.2" height="1.8" rx="0.9" fill="white" stroke="#F9A8D4" strokeWidth="0.8" />
  <rect x="12.3" y="20" width="3.2" height="1.8" rx="0.9" fill="white" stroke="#F9A8D4" strokeWidth="0.8" />
</>, { name: 'Girl' });
export const IconBaby = I(<><circle cx="12" cy="12" r="9" /><path d="M7 11h4a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2" /><path d="M13 11h4a1 1 0 0 1 0 2h-3a1 1 0 0 1 0-2" /><path d="M11 12h2" /><path d="M9 16c.5.3 1.2.5 3 .5s2.5-.2 3-.5" /></>, { name: 'CoolFace' }); export const IconChild = I(<><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></>, { name: 'Baby' });
export const IconUsers = I(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>, { name: 'Users' });
export const IconUser = I(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>, { name: 'User' });

// ── CLOTHING ──
export const IconShirt = I(
  <>
    {/* T-shirt body */}
    <path
      d="M9 3 
         L11 2 H13 L15 3 
         L18 5 
         C18.8 5.6 19 6.8 18.5 7.8 
         L17.5 10 
         C17.2 10.6 16.5 10.8 16 10.4 
         L15 9.5 V20 
         C15 21.1 14.1 22 13 22 
         H11 
         C9.9 22 9 21.1 9 20 
         V9.5 L8 10.4 
         C7.5 10.8 6.8 10.6 6.5 10 
         L5.5 7.8 
         C5 6.8 5.2 5.6 6 5 Z"
      fill="#FF8C42"
      stroke="#C25A1A"
      strokeWidth="1.5"
    />

    {/* Neck (round collar) */}
    <path
      d="M11 3 
         C11.5 3.8 12.5 3.8 13 3"
      stroke="#C25A1A"
      strokeWidth="1"
      fill="none"
    />

    {/* Sleeve shading */}
    <path
      d="M6.5 6.5 L8.5 7.5 L8 10 L6.5 9 Z"
      fill="#E6762F"
    />
    <path
      d="M17.5 6.5 L15.5 7.5 L16 10 L17.5 9 Z"
      fill="#E6762F"
    />

    {/* Fabric fold */}
    <path
      d="M12 6 V20"
      stroke="#C25A1A"
      strokeWidth="0.8"
      opacity="0.5"
    />
  </>,
  { name: 'Shirt' }
);
export const IconDress = I(
  <>
    {/* Top (bodice) */}
    <path
      d="M9 3 
         C10 2.5 11 2 12 2 
         C13 2 14 2.5 15 3 
         L14 6 
         C13.5 6.5 10.5 6.5 10 6 Z"
      fill="#FF6F91"
      stroke="#C94C6E"
      strokeWidth="1.2"
    />

    {/* Skirt */}
    <path
      d="M10 6 
         L8 10 
         C7 12 6 14 5 18 
         H19 
         C18 14 17 12 16 10 
         L14 6 Z"
      fill="#FF85A2"
      stroke="#C94C6E"
      strokeWidth="1.2"
    />

    {/* Waist belt */}
    <path
      d="M10 6 H14"
      stroke="#C94C6E"
      strokeWidth="1.5"
    />

    {/* Neckline */}
    <path
      d="M11 3 
         C11.5 3.5 12.5 3.5 13 3"
      stroke="#C94C6E"
      strokeWidth="1"
      fill="none"
    />

    {/* Fold lines */}
    <path
      d="M12 8 V18"
      stroke="#C94C6E"
      strokeWidth="0.8"
      opacity="0.5"
    />
    <path
      d="M9 10 L11 18"
      stroke="#C94C6E"
      strokeWidth="0.6"
      opacity="0.4"
    />
    <path
      d="M15 10 L13 18"
      stroke="#C94C6E"
      strokeWidth="0.6"
      opacity="0.4"
    />
  </>,
  { name: 'Dress' }
);
export const IconCoat = I(
  <>
    {/* Coat outer shape (long & straight) */}
    <path
      d="M9 2 
         L11 4 H13 L15 2 
         L18 4 
         C19 5 19.5 7 19 9 
         L18.5 11 
         C18.3 11.6 17.8 12 17.2 12 
         H16 V22 
         C16 23 15 24 14 24 
         H10 
         C9 24 8 23 8 22 
         V12 H6.8 
         C6.2 12 5.7 11.6 5.5 11 
         L5 9 
         C4.5 7 5 5 6 4 Z"
      fill="#2E3A59"
      stroke="#1C253A"
      strokeWidth="1.5"
    />

    {/* Sharp collar (winter coat style) */}
    <path
      d="M11 4 L12 6 L13 4"
      fill="#F1F3F9"
      stroke="#1C253A"
      strokeWidth="1"
    />

    {/* Double front panels */}
    <path
      d="M11.5 6 V24"
      stroke="#1C253A"
      strokeWidth="1"
    />
    <path
      d="M12.5 6 V24"
      stroke="#1C253A"
      strokeWidth="1"
    />

    {/* Buttons (side aligned for coat look) */}
    <circle cx="13.5" cy="10" r="0.6" fill="#F1F3F9" />
    <circle cx="13.5" cy="13" r="0.6" fill="#F1F3F9" />
    <circle cx="13.5" cy="16" r="0.6" fill="#F1F3F9" />

    {/* Pocket lines */}
    <path
      d="M9.5 14 H11"
      stroke="#1C253A"
      strokeWidth="1"
    />
    <path
      d="M13 14 H14.5"
      stroke="#1C253A"
      strokeWidth="1"
    />

    {/* Bottom open cut */}
    <path
      d="M11 18 L12 24 L13 18"
      fill="#1C253A"
      opacity="0.5"
    />
  </>,
  { name: 'Coat' }
);
export const IconEthnicWear = I(
  <>
    {/* Kurta body */}
    <path
      d="M8 3 
         L10.5 2 H13.5 L16 3 
         L18 5 
         C18.8 6 19 7.5 18.5 9 
         L18 11 
         C17.8 11.6 17.2 12 16.6 12 
         H15 V22 
         C15 23.1 14.1 24 13 24 
         H11 
         C9.9 24 9 23.1 9 22 
         V12 H7.4 
         C6.8 12 6.2 11.6 6 11 
         L5.5 9 
         C5 7.5 5.2 6 6 5 Z"
      fill="#9C27B0"
      stroke="#5E1A73"
      strokeWidth="1.5"
    />

    {/* Neck (ethnic style slit) */}
    <path
      d="M11.5 3.5 
         L12 5 
         L12.5 3.5"
      stroke="#5E1A73"
      strokeWidth="1"
      fill="none"
    />

    {/* Placket (front design) */}
    <path
      d="M12 5 V18"
      stroke="#5E1A73"
      strokeWidth="1.2"
    />

    {/* Buttons / embroidery */}
    <circle cx="12" cy="7" r="0.5" fill="#FFD54F" />
    <circle cx="12" cy="9" r="0.5" fill="#FFD54F" />
    <circle cx="12" cy="11" r="0.5" fill="#FFD54F" />

    {/* Side slits */}
    <path
      d="M9 16 V22"
      stroke="#5E1A73"
      strokeWidth="1"
    />
    <path
      d="M15 16 V22"
      stroke="#5E1A73"
      strokeWidth="1"
    />

    {/* Bottom detail */}
    <path
      d="M10 22 L12 24 L14 22"
      fill="#7B1FA2"
      opacity="0.6"
    />
  </>,
  { name: 'EthnicWear' }
);
// ── CATEGORY ICONS ──
export const IconPalette = I(<><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" fill="#7C3AED" stroke="#7C3AED" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="13.5" cy="6.5" r="0.8" fill="#fff" /><circle cx="17.5" cy="10.5" r="0.8" fill="#fff" /><circle cx="8.5" cy="7.5" r="0.8" fill="#fff" /><circle cx="6.5" cy="12" r="0.8" fill="#fff" /></>, { name: 'Palette' });
export const IconFootball = I(<><circle cx="12" cy="12" r="10" fill="#1E293B" stroke="#1E293B" strokeWidth="1.5" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" fill="#fff" stroke="#fff" strokeWidth="1" /><path d="M2 12h20" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></>, { name: 'Football' });
export const IconBackpack = I(<><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5" /></>, { name: 'Backpack' });
export const IconTie = I(<><path d="M12 22L8 14l2-4-2-6h8l-2 6 2 4z" /></>, { name: 'Tie' });
export const IconMask = I(<><path d="M2 12.5A6.5 6.5 0 0 1 8.5 6h7A6.5 6.5 0 0 1 22 12.5v0A6.5 6.5 0 0 1 15.5 19h-7A6.5 6.5 0 0 1 2 12.5v0z" /><path d="M9 12v.5" /><path d="M15 12v.5" /></>, { name: 'Mask' });
export const IconMoon = I(<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />, { name: 'Moon' });
export const IconRuler = I(<><path d="M21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z" /></>, { name: 'Ruler' });
export const IconTarget = I(<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>, { name: 'Target' });

// ── NAVIGATION / UI ──
export const IconPackage = I(<><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>, { name: 'Package' });
export const IconEdit = I(<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>, { name: 'Edit' });
export const IconSettings = I(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>, { name: 'Settings' });
export const IconLogOut = I(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>, { name: 'LogOut' });
export const IconHome = I(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>, { name: 'Home' });
export const IconBarChart = I(<><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>, { name: 'BarChart' });
export const IconDollar = I(<><circle cx="12" cy="12" r="10" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" /><line x1="9" y1="7" x2="15" y2="7" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" /><line x1="9" y1="10.5" x2="15" y2="10.5" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" /><path d="M9 10.5a3 3 0 0 0 3 0" fill="none" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" /><path d="M9 10.5l5 6" fill="none" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" /></>, { name: 'Dollar' });
export const IconTicket = I(<><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></>, { name: 'Ticket' });
export const IconTrophy = I(<><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></>, { name: 'Trophy' });
export const IconPhone = I(<><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>, { name: 'Phone' });
export const IconMapPin = I(<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>, { name: 'MapPin' });
export const IconLeaf = I(<><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></>, { name: 'Leaf' });
export const IconClock = I(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, { name: 'Clock' });
export const IconEye = I(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>, { name: 'Eye' });
export const IconEyeOff = I(<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>, { name: 'EyeOff' });
export const IconArrowLeft = I(<><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>, { name: 'ArrowLeft' });
export const IconChevronLeft = I(<polyline points="15 18 9 12 15 6" />, { name: 'ChevronLeft' });
export const IconChevronRight = I(<polyline points="9 18 15 12 9 6" />, { name: 'ChevronRight' });
export const IconMoney = I(<><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></>, { name: 'Money' });
export const IconMail = I(<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>, { name: 'Mail' });

// Social Media
export const IconFacebook = I(<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />, { name: 'Facebook' });
export const IconInstagram = I(<><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>, { name: 'Instagram' });
export const IconTwitter = I(<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />, { name: 'Twitter' });
export const IconYoutube = I(<><polygon points="5 3 19 12 5 21 5 3" /></>, { name: 'Youtube' });
