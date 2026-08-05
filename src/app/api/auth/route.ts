import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

declare global {
  var __ZEAL_USERS__: any[] | undefined;
}

const usersFilePath = path.join(process.cwd(), "src", "lib", "users.json");

function getUsers(): any[] {
  if (globalThis.__ZEAL_USERS__) {
    return globalThis.__ZEAL_USERS__;
  }
  try {
    if (!fs.existsSync(usersFilePath)) {
      globalThis.__ZEAL_USERS__ = [];
      return [];
    }
    const content = fs.readFileSync(usersFilePath, "utf8");
    globalThis.__ZEAL_USERS__ = JSON.parse(content || "[]");
  } catch (err) {
    console.error("Error reading users file:", err);
    globalThis.__ZEAL_USERS__ = [];
  }
  return globalThis.__ZEAL_USERS__ || [];
}

function saveUsers(users: any[]) {
  globalThis.__ZEAL_USERS__ = users;
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.warn("Serverless read-only filesystem warning, users stored in server memory:", err);
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
