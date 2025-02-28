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

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60,
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 403 }
    );
  }
}
