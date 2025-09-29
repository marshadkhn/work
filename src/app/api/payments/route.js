import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/lib/models/Project";

export async function POST(request) {
  await dbConnect();
  try {
    const { projectId, paymentData } = await request.json();

    if (!projectId || !paymentData) {
      return NextResponse.json(
        { success: false, error: "Missing projectId or paymentData" },
        { status: 400 }
      );
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    project.payments.push(paymentData);
    await project.save();

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
