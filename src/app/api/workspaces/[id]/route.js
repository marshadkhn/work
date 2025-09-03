import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Workspace from "@/lib/models/Workspace";
import Project from "@/lib/models/Project";

export async function DELETE(request, { params }) {
  const { id } = params;
  await dbConnect();
  try {
    // Pehle us workspace se jude sabhi projects ko delete karein
    await Project.deleteMany({ workspace: id });
    // Phir workspace ko delete karein
    await Workspace.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Workspace and associated projects deleted.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
