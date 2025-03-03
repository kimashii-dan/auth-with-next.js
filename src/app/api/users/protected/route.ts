/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/config/db";
import Stats from "@/models/statsModel";
import Race from "@/models/raceModel";
import { cookies } from "next/headers";

connect();

export async function GET() {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    console.log(accessToken);
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token missing" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.TOKEN_SECRET!)
    );

    const user = await User.findById(payload.id);

    if (!user) {
      return NextResponse.json({ existence: false });
    }

    const stats = await Stats.findOne({ player_id: payload.id });

    const races = await Race.find({ player_id: payload.id })
      .sort({ _id: -1 })
      .limit(5);

    return NextResponse.json({
      success: true,
      user_data: user,
      stats_data: stats,
      races_data: races,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "Access token expired or invalid" },
      { status: 403 }
    );
  }
}
