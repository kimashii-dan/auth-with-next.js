/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/config/db";
import Stats from "@/models/statsModel";
import Race from "@/models/raceModel";

connect();

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      console.log("hey");
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
