/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/config/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const accessTokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const refreshTokenData = {
      id: user._id,
    };

    const encoder = new TextEncoder();
    const accessToken = await new SignJWT(accessTokenData)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime("15m")
      .sign(encoder.encode(process.env.TOKEN_SECRET));

    const refreshToken = await new SignJWT(refreshTokenData)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime("7d")
      .sign(encoder.encode(process.env.TOKEN_SECRET));

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    (await cookies()).set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    (await cookies()).set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
