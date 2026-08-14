/*
  Canonical product catalog + pricing. The BACKEND is the source of truth:
  order amounts are always recomputed here from the selected card, never
  trusted from the client. Keep this in sync with frontend/src/lib/catalog.ts
  (display only). All prices are in paise (1 rupee = 100 paise).
*/

export type CardTypeKey = "classic" | "business" | "custom";

// Payments are manual: the buyer pays this UPI ID directly and uploads a
// screenshot as proof, which we cross-verify before confirming the order.
export const UPI_ID = "aaryansaiyed5@okaxis";

export const CATALOG = {
  cards: {
    classic: { name: "Classic Card", pricePaise: 39900 },
    business: { name: "Business Card", pricePaise: 49900 },
    custom: { name: "Fully Custom Card", pricePaise: 69900 },
  } as Record<string, { name: string; pricePaise: number }>,
};

export type OrderItem = {
  cardType: string;
  printName?: string;
  printDesignation?: string;
  companyLogoData?: string; // business tier: uploaded company logo (data URL)
  customNotes?: string; // custom tier: brief for our design team
  qty: number;
};

export function priceItemPaise(item: OrderItem): number {
  const card = CATALOG.cards[item.cardType];
  if (!card) throw new Error(`Unknown card type: ${item.cardType}`);
  const qty = Math.max(1, Math.min(50, Math.floor(item.qty || 1)));
  return card.pricePaise * qty;
}

export function priceCartPaise(items: OrderItem[]): number {
  return items.reduce((sum, it) => sum + priceItemPaise(it), 0);
}
