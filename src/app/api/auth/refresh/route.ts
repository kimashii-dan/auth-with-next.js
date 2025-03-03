import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { connect } from "@/config/db";
import User from "@/models/userModel";
import { cookies } from "next/headers";

connect();

export async function POST() {
  try {
    const refreshToken = (await cookies()).get("refreshToken")?.value;
    console.log("Received cookies:", (await cookies()).getAll());

    if (!refreshToken) {
      console.error("Refresh token missing");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      refreshToken,
      new TextEncoder().encode(process.env.TOKEN_SECRET!)
    );

    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const accessTokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const encoder = new TextEncoder();
    const accessToken = await new SignJWT(accessTokenData)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("15m")
      .sign(encoder.encode(process.env.TOKEN_SECRET!));

    const response = NextResponse.json({
      message: "Token refreshed successfully",
    });

    (await cookies()).set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 403 }
    );
  }
}
