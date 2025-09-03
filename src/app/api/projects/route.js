import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/lib/models/Project";

// POST a new project
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const project = await Project.create(body);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
