import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Store the message in the database
    const contactMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        message,
      },
    });

    // Send email notification (async, don't wait for it)
    sendContactNotification({ name, email, message }).catch((err) => {
      console.error("Email notification failed:", err);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully!",
        id: contactMessage.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

// Admin credentials (in production, use proper authentication)
const ADMIN_EMAIL = "gautamofficial.in@gmail.com";
const ADMIN_PASSWORD = "!Aworker2#";

// GET endpoint to retrieve messages (protected)
export async function GET(request: Request) {
  try {
    // Check for Authorization header
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse Basic Auth
    const base64Credentials = authHeader.replace("Basic ", "");
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [email, password] = credentials.split(":");

    // Validate credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const messages = await db.contactMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
