import { NextRequest, NextResponse } from "next/server";
import { orderFileStore, OrderRecord } from "@/lib/orderFileStore";
import { notificationFileStore } from "@/lib/notificationFileStore";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, query, where, getDoc, setDoc } from "firebase/firestore";

// GET /api/orders — returns all orders + pending count + revenue
export async function GET() {
  if (db) {
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const orders = snapshot.docs.map((d) => d.data() as OrderRecord);
      orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      const pendingCount = orders.filter((o) => o.status === "PENDING").length;
      const totalRevenue = orders
        .filter((o) => o.status !== "CANCELLED")
        .reduce((sum, o) => sum + (o.total || 0), 0);
      return NextResponse.json({ orders, pendingCount, totalRevenue });
    } catch (e) {
      console.error("Firestore GET orders error, fallback to local store:", e);
    }
  }

  const orders = orderFileStore.getAll();
  const pendingCount = orderFileStore.getPendingCount();
  const totalRevenue = orderFileStore.getTotalRevenue();
  return NextResponse.json({ orders, pendingCount, totalRevenue });
}

// POST /api/orders — creates a new order from checkout
export async function POST(req: NextRequest) {
  try {
    const order: OrderRecord = await req.json();
    if (!order.orderId || !order.items) {
      return NextResponse.json({ error: "Invalid order data." }, { status: 400 });
    }

    let saved = order;
    if (db) {
      try {
        await setDoc(doc(db, "orders", order.orderId), order);
      } catch (e) {
        console.error("Firestore POST order error, fallback to local store:", e);
        saved = orderFileStore.add(order);
      }
    } else {
      saved = orderFileStore.add(order);
    }

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

    if (db) {
      try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status });
      } catch (e) {
        console.error("Firestore PATCH order error, fallback to local store:", e);
        orderFileStore.updateStatus(orderId, status);
      }
    } else {
      orderFileStore.updateStatus(orderId, status);
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
