/*
  Product catalog for display and live price preview.
  The backend recomputes the authoritative price on checkout, so this is only
  used for the UI. Keep prices in sync with backend/src/lib/catalog.ts.
  All prices are in paise (1 rupee = 100 paise).
*/

export type CardTypeKey = "classic" | "business" | "custom";
export type CardVariant = "standard" | "premium" | "black";

// Payments are manual: the buyer pays this UPI ID directly and uploads a
// screenshot as proof, which we cross-verify before confirming the order.
export const UPI_ID = "aaryansaiyed5@okaxis";

export type Card = {
  key: CardTypeKey;
  name: string;
  pricePaise: number;
  variant: CardVariant;
  tagline: string;
  features: string[];
};

export const CARDS: Card[] = [
  {
    key: "classic",
    name: "Classic Card",
    pricePaise: 39900,
    variant: "standard",
    tagline: "Our signature deep navy card with the TapAway logo on both sides.",
    features: [
      "NFC enabled",
      "Deep navy blue colourway",
      "TapAway logo on both sides",
      "Digital profile & unlimited updates",
      "QR code backup",
    ],
  },
  {
    key: "business",
    name: "Business Card",
    pricePaise: 49900,
    variant: "premium",
    tagline: "Everything in Classic, personalised with your name, designation and company logo.",
    features: [
      "Everything in Classic",
      "Your name printed",
      "Your designation printed",
      "Your company logo printed",
    ],
  },
  {
    key: "custom",
    name: "Fully Custom Card",
    pricePaise: 69900,
    variant: "black",
    tagline: "A one-of-one card, designed with you by our team.",
    features: [
      "Everything in Business",
      "Fully custom design",
      "1:1 design consultation",
      "Our team reaches out to you after checkout",
    ],
  },
];

export type CardConfig = {
  cardType: CardTypeKey;
  printName?: string;
  printDesignation?: string;
  companyLogoData?: string; // business tier: uploaded company logo (data URL)
  customNotes?: string; // custom tier: brief for our design team
  qty: number;
};

export function priceItemPaise(cfg: CardConfig): number {
  const card = CARDS.find((c) => c.key === cfg.cardType);
  if (!card) return 0;
  const qty = Math.max(1, Math.min(50, Math.floor(cfg.qty || 1)));
  return card.pricePaise * qty;
}

export function priceCartPaise(items: CardConfig[]): number {
  return items.reduce((s, i) => s + priceItemPaise(i), 0);
}

export const rupees = (paise: number) =>
  `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export function variantForConfig(cfg: { cardType: string }): CardVariant {
  return CARDS.find((c) => c.key === cfg.cardType)?.variant ?? "standard";
}

export function summarize(cfg: CardConfig): string {
  const parts = [
    cfg.printName ? `Name: ${cfg.printName}` : null,
    cfg.printDesignation ? `Designation: ${cfg.printDesignation}` : null,
    cfg.companyLogoData ? "Company logo" : null,
    cfg.customNotes ? "Design brief added" : null,
  ].filter(Boolean);
  return parts.join(" · ");
}
