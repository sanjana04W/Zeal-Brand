import { NextRequest, NextResponse } from "next/server";

export interface Promotion {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  type: "Percentage" | "Fixed Amount" | "Shipping";
  category: string;
  status: "ACTIVE" | "SCHEDULED" | "PAUSED" | "EXPIRED";
  uses: number;
  expiry: string;
}

declare global {
  var __promotionsCache: Promotion[] | undefined;
}

const DEFAULT_PROMOTIONS: Promotion[] = [
  {
    id: "p-1",
    title: "Mega Zeal Price Drop",
    description: "25% Off Storewide Collection",
    code: "MEGA25",
    discount: "25% OFF",
    type: "Percentage",
    category: "ALL PRODUCTS",
    status: "ACTIVE",
    uses: 142,
    expiry: "2026-08-31",
  },
  {
    id: "p-2",
    title: "Premium Oversized Tee Sale",
    description: "35% Off Selected Drop Shoulder Tees",
    code: "OVERSIZED35",
    discount: "35% OFF",
    type: "Percentage",
    category: "OVERSIZED",
    status: "ACTIVE",
    uses: 89,
    expiry: "2026-08-31",
  },
  {
    id: "p-3",
    title: "Free Islandwide Shipping",
    description: "Free Courier Delivery on Orders Over LKR 8,000",
    code: "FREESHIP",
    discount: "FREE SHIP",
    type: "Shipping",
    category: "ALL PRODUCTS",
    status: "ACTIVE",
    uses: 310,
    expiry: "2026-12-31",
  },
];

function getPromotions(): Promotion[] {
  if (!globalThis.__promotionsCache) {
    globalThis.__promotionsCache = [...DEFAULT_PROMOTIONS];
  }
  return globalThis.__promotionsCache;
}

function setPromotions(promos: Promotion[]): void {
  globalThis.__promotionsCache = promos;
}

// GET /api/promotions — List all promotions or search by code (?code=MEGA25)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const promos = getPromotions();

  if (code) {
    const found = promos.find(
      (p) => p.code.toUpperCase() === code.trim().toUpperCase() && p.status === "ACTIVE"
    );
    if (!found) {
      return NextResponse.json({ error: "Invalid or expired promo code" }, { status: 404 });
    }
    return NextResponse.json({ success: true, promotion: found });
  }

  return NextResponse.json({ promotions: promos });
}

// POST /api/promotions — Add or update promotion
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, description, code, discount, type, category, status, expiry } = body;

    if (!title || !code) {
      return NextResponse.json({ error: "Title and Code are required" }, { status: 400 });
    }

    const promos = [...getPromotions()];

    if (id) {
      const idx = promos.findIndex((p) => p.id === id);
      if (idx !== -1) {
        promos[idx] = {
          ...promos[idx],
          title,
          description,
          code: code.toUpperCase(),
          discount: discount || "10% OFF",
          type: type || "Percentage",
          category: category || "ALL PRODUCTS",
          status: status || "ACTIVE",
          expiry: expiry || "2026-12-31",
        };
        setPromotions(promos);
        return NextResponse.json({ success: true, promotion: promos[idx] });
      }
    }

    const newPromo: Promotion = {
      id: `p-${Date.now()}`,
      title,
      description: description || "",
      code: code.toUpperCase(),
      discount: discount || "10% OFF",
      type: type || "Percentage",
      category: category || "ALL PRODUCTS",
      status: status || "ACTIVE",
      uses: 0,
      expiry: expiry || "2026-12-31",
    };

    promos.unshift(newPromo);
    setPromotions(promos);

    return NextResponse.json({ success: true, promotion: newPromo }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE /api/promotions?id=XYZ
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  let promos = getPromotions();
  promos = promos.filter((p) => p.id !== id);
  setPromotions(promos);

  return NextResponse.json({ success: true });
}
