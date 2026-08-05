import { NextRequest, NextResponse } from "next/server";
import { messageStore } from "@/lib/messageStore";
import { notificationFileStore } from "@/lib/notificationFileStore";

// GET /api/messages — returns all messages
export async function GET() {
  const messages = messageStore.getAll();
  const unreadCount = messageStore.getUnreadCount();
  return NextResponse.json({ messages, unreadCount });
}

// POST /api/messages — creates a new message from contact form
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone = "", subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const newMsg = messageStore.add({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      subject: String(subject || message).trim().slice(0, 80),
      message: String(message).trim(),
    });

    try {
      notificationFileStore.add({
        type: "MESSAGE",
        title: "New Contact Message",
        subtitle: newMsg.name,
        detail: `${newMsg.email}: "${newMsg.message.slice(0, 45)}${newMsg.message.length > 45 ? "..." : ""}"`,
        link: "/admin/messages",
      });
    } catch {}

    return NextResponse.json({ success: true, message: newMsg }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

// PATCH /api/messages — update status of a message
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id and status required." }, { status: 400 });
    }

    const updated = messageStore.updateStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
