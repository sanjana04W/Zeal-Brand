import { NextRequest, NextResponse } from "next/server";
import { messageStore } from "@/lib/messageStore";

// GET /api/messages — returns all messages
export async function GET() {
  const messages = messageStore.getAll();
  const unreadCount = messageStore.getUnreadCount();
  return NextResponse.json({ messages, unreadCount });
}

// POST /api/messages — creates a new message from contact form or inquiry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = String(body.name || body.fullName || body.userName || body.senderName || "Customer").trim();
    const email = String(body.email || body.emailAddress || body.userEmail || body.senderEmail || "").trim().toLowerCase();
    const phone = String(body.phone || body.telephone || body.mobile || body.contactNumber || "").trim();
    const message = String(body.message || body.inquiry || body.comment || body.text || body.body || "").trim();
    const rawSubject = String(body.subject || body.topic || body.title || "").trim();
    const subject = rawSubject || (message ? `Inquiry from ${name}` : `Message from ${name}`);

    if (!message && !name) {
      return NextResponse.json(
        { error: "A message or name is required to submit an inquiry." },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Please provide an email or phone number for follow-up." },
        { status: 400 }
      );
    }

    const newMsg = messageStore.add({
      name: name || "Customer",
      email: email || "no-email@zealbrand.com",
      phone,
      subject: subject.slice(0, 100),
      message: message || "(No message body provided)",
    });

    return NextResponse.json({ success: true, message: newMsg }, { status: 201 });
  } catch (error) {
    console.error("API /api/messages POST error:", error);
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
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
