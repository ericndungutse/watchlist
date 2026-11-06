import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { signAuthToken, getAuthCookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    await connectToDatabase();

    // Query user and explicitly include password since select: false
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare provided password with bcrypt hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await signAuthToken({
      userId: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });

    const cookieOptions = getAuthCookieOptions();

    const response = NextResponse.json(
      {
        success: true,
        message: "Logged in successfully",
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set HTTP-only secure session cookie
    response.cookies.set(cookieOptions.name, token, cookieOptions);

    return response;
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during login",
      },
      { status: 500 }
    );
  }
}
