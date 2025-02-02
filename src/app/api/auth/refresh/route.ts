import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { connect } from "@/config/db";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      refreshToken,
      new TextEncoder().encode(process.env.TOKEN_SECRET)
    );

    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const encoder = new TextEncoder();
    const accessToken = await new SignJWT({ id: user._id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("15m")
      .sign(encoder.encode(process.env.TOKEN_SECRET!));

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 403 }
    );
  }
}
