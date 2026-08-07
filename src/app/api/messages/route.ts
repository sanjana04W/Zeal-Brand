import { NextRequest, NextResponse } from "next/server";
import { messageStore } from "@/lib/messageStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/messages — returns all messages
export async function GET() {
  try {
    const messages = messageStore.getAll();
    const unreadCount = messageStore.getUnreadCount();
    return NextResponse.json({ messages, unreadCount });
  } catch (err) {
    console.error("/api/messages GET error:", err);
    return NextResponse.json({ error: "Failed to read messages." }, { status: 500 });
  }
}

// POST /api/messages — creates a new message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = String(body.name || body.fullName || "Customer").trim();
    const email = String(body.email || body.emailAddress || "").trim().toLowerCase();
    const phone = String(body.phone || body.telephone || "").trim();
    const message = String(body.message || body.inquiry || body.text || "").trim();
    const rawSubject = String(body.subject || body.topic || "").trim();
    const subject = rawSubject || `Inquiry from ${name}`;

    if (!message) {
      return NextResponse.json({ error: "A message body is required." }, { status: 400 });
    }
    if (!email && !phone) {
      return NextResponse.json(
        { error: "Please provide an email or phone number." },
        { status: 400 }
      );
    }

    const newMsg = messageStore.add({ name, email, phone, subject, message });
    console.log(`[API] Message saved: ${newMsg.id} from ${newMsg.name} (${newMsg.email || newMsg.phone})`);
    return NextResponse.json({ success: true, message: newMsg }, { status: 201 });
  } catch (err) {
    console.error("/api/messages POST error:", err);
    return NextResponse.json(
      { error: "Failed to save message to database. Please try again." },
      { status: 500 }
    );
  }
}

// PATCH /api/messages — update status
export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "id and status required." }, { status: 400 });
    }
    const updated = messageStore.updateStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/messages PATCH error:", err);
    return NextResponse.json({ error: "Failed to update message." }, { status: 500 });
  }
}
