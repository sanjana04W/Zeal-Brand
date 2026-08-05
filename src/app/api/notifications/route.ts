import { NextRequest, NextResponse } from "next/server";
import { notificationFileStore } from "@/lib/notificationFileStore";

// GET /api/notifications — returns all notifications + unread count
export async function GET() {
  const notifications = notificationFileStore.getAll();
  const unreadCount = notificationFileStore.getUnreadCount();
  return NextResponse.json({ notifications, unreadCount });
}

// POST /api/notifications — create a notification manually
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, title, subtitle, detail, link } = body;
    if (!title || !detail) {
      return NextResponse.json({ error: "Title and detail required." }, { status: 400 });
    }
    const created = notificationFileStore.add({
      type: type || "ORDER",
      title,
      subtitle: subtitle || "",
      detail,
      link: link || "/admin/orders",
    });
    return NextResponse.json({ success: true, notification: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

// PATCH /api/notifications — mark read or dismiss
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;
    if (action === "dismissAll") {
      notificationFileStore.dismissAll();
      return NextResponse.json({ success: true });
    }
    if (!id) {
      return NextResponse.json({ error: "ID required." }, { status: 400 });
    }
    if (action === "read") {
      notificationFileStore.markAsRead(id);
    } else {
      notificationFileStore.dismiss(id);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

// DELETE /api/notifications — clear all
export async function DELETE() {
  notificationFileStore.dismissAll();
  return NextResponse.json({ success: true });
}
