import { NextRequest, NextResponse } from "next/server";
import { orderFileStore } from "@/lib/orderFileStore";
import { notificationFileStore } from "@/lib/notificationFileStore";

// GET /api/orders — returns all orders + pending count + revenue
export async function GET() {
  const orders = orderFileStore.getAll();
  const pendingCount = orderFileStore.getPendingCount();
  const totalRevenue = orderFileStore.getTotalRevenue();
  return NextResponse.json({ orders, pendingCount, totalRevenue });
}

// POST /api/orders — creates a new order from checkout
export async function POST(req: NextRequest) {
  try {
    const order = await req.json();
    if (!order.orderId || !order.items) {
      return NextResponse.json({ error: "Invalid order data." }, { status: 400 });
    }
    const saved = orderFileStore.add(order);

    // Create persistent notification for Admin Panel
    try {
      notificationFileStore.add({
        type: "ORDER",
        title: "New Order Placed",
        subtitle: saved.orderId,
        detail: `${saved.fullName || "Customer"} placed an order for Rs. ${(saved.total || 0).toLocaleString()}`,
        link: "/admin/orders",
      });
    } catch {}

    return NextResponse.json({ success: true, order: saved }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
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

    try {
      notificationFileStore.add({
        type: "ORDER",
        title: "Order Status Updated",
        subtitle: orderId,
        detail: `Order ${orderId} status changed to ${status}`,
        link: "/admin/orders",
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
