import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const usersFilePath = path.join(process.cwd(), "src", "lib", "users.json");

declare global {
  var __usersCache: any[] | undefined;
}

function getUsers(): any[] {
  if (globalThis.__usersCache) {
    return globalThis.__usersCache;
  }
  try {
    if (!fs.existsSync(usersFilePath)) {
      globalThis.__usersCache = [];
      return [];
    }
    const content = fs.readFileSync(usersFilePath, "utf8");
    const parsed = JSON.parse(content || "[]");
    const result = Array.isArray(parsed) ? parsed : [];
    globalThis.__usersCache = result;
    return result;
  } catch (err) {
    console.error("Error reading users file:", err);
    globalThis.__usersCache = [];
    return [];
  }
}

function saveUsers(users: any[]) {
  globalThis.__usersCache = users;
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.warn("Error writing users file (expected in serverless environments):", err);
  }
}

// POST /api/auth
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const users = getUsers();

    // ── ACTION: REGISTER ──
    if (action === "register") {
      const existingUser = users.find((u: any) => u.email.toLowerCase() === cleanEmail);
      if (existingUser) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in." },
          { status: 400 }
        );
      }

      const newUser = {
        id: "usr_" + Date.now(),
        name: name || cleanEmail.split("@")[0],
        email: cleanEmail,
        password: String(password),
        phone: phone || "+94 77 123 4567",
        joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      };

      users.push(newUser);
      saveUsers(users);

      const { password: _, ...userWithoutPassword } = newUser;
      return NextResponse.json({
        success: true,
        message: "Account created successfully",
        user: userWithoutPassword,
      });
    }

    // ── ACTION: LOGIN ──
    if (action === "login") {
      const user = users.find((u: any) => u.email.toLowerCase() === cleanEmail);

      if (user) {
        if (user.password !== String(password)) {
          return NextResponse.json(
            { error: "Incorrect password. Please try again." },
            { status: 401 }
          );
        }

        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json({
          success: true,
          message: "Signed in successfully",
          user: userWithoutPassword,
        });
      } else {
        // Auto-create user for new signins so login works seamlessly on any device
        const nameFromEmail = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
        const formattedName = nameFromEmail
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        const newUser = {
          id: "usr_" + Date.now(),
          name: formattedName || "Zeal Customer",
          email: cleanEmail,
          password: String(password),
          phone: "+94 77 123 4567",
          joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        };

        users.push(newUser);
        saveUsers(users);

        const { password: _, ...userWithoutPassword } = newUser;
        return NextResponse.json({
          success: true,
          message: "Signed in successfully",
          user: userWithoutPassword,
        });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

// PUT /api/auth (Update user profile / password)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phone, address, newPassword } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required to update profile." }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const users = getUsers();

    const idx = users.findIndex((u: any) => u.email.toLowerCase() === cleanEmail);
    if (idx === -1) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (name !== undefined) users[idx].name = name;
    if (phone !== undefined) users[idx].phone = phone;
    if (address !== undefined) users[idx].address = address;
    if (newPassword) users[idx].password = newPassword;

    saveUsers(users);

    const { password: _, ...updatedUser } = users[idx];
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("PUT /api/auth Error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
