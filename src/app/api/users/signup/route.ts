/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/config/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { SignJWT } from "jose";
import Stats from "@/models/statsModel";
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, username, password } = reqBody;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User creation failed" },
        { status: 500 }
      );
    }

    const newStats = new Stats({ player_id: user._id });
    await newStats.save();

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const encoder = new TextEncoder();
    const token = await new SignJWT(tokenData)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime("1d")
      .sign(encoder.encode(process.env.TOKEN_SECRET));

    const response = NextResponse.json({
      message: "Sign-up successful",
      success: true,
      id: user._id,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 86400,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
