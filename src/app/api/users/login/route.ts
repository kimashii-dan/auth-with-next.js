/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/config/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { SignJWT } from "jose";
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

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const encoder = new TextEncoder();
    const token = await new SignJWT(tokenData)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime("1d") // Set expiration to 1 day
      .sign(encoder.encode(process.env.TOKEN_SECRET));

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      id: user._id,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
