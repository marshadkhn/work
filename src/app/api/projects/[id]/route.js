import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/lib/models/Project";

export async function DELETE(request, { params }) {
  const { id } = params;
  await dbConnect();
  try {
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Project deleted." });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
