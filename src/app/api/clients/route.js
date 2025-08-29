import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Client from "@/lib/models/Client";

export async function GET() {
  await dbConnect();

  try {
    const clients = await Client.find({});
    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const client = await Client.create(body);
    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
