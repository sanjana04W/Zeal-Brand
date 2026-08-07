import { NextRequest, NextResponse } from "next/server";
import { orderFileStore } from "@/lib/orderFileStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/orders — returns all orders
export async function GET() {
  try {
    const orders = orderFileStore.getAll();
    const pendingCount = orderFileStore.getPendingCount();
    const totalRevenue = orderFileStore.getTotalRevenue();
    return NextResponse.json({ orders, pendingCount, totalRevenue });
  } catch (err) {
    console.error("/api/orders GET error:", err);
    return NextResponse.json({ error: "Failed to read orders." }, { status: 500 });
  }
}

// POST /api/orders — creates a new order from checkout
export async function POST(req: NextRequest) {
  try {
    const order = await req.json();
    if (!order.orderId || !order.items || !Array.isArray(order.items)) {
      return NextResponse.json({ error: "Invalid order data: orderId and items are required." }, { status: 400 });
    }
    const saved = orderFileStore.add(order);
    console.log(`[API] Order saved: ${saved.orderId} for ${saved.userEmail}`);
    return NextResponse.json({ success: true, order: saved }, { status: 201 });
  } catch (err) {
    console.error("/api/orders POST error:", err);
    return NextResponse.json(
      { error: "Failed to save order to database. Please try again." },
      { status: 500 }
    );
  }
}

// PATCH /api/orders — update status of an order
export async function PATCH(req: NextRequest) {
  try {
    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: "orderId and status required." }, { status: 400 });
    }
    const updated = orderFileStore.updateStatus(orderId, status);
    if (!updated) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/orders PATCH error:", err);
    return NextResponse.json({ error: "Failed to update order." }, { status: 500 });
  }
}
