import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Workspace from "@/lib/models/Workspace";
import Project from "@/lib/models/Project";

// GET all workspaces with their projects
export async function GET() {
  await dbConnect();
  try {
    const workspaces = await Workspace.find({}).lean();
    for (const workspace of workspaces) {
      workspace.projects = await Project.find({ workspace: workspace._id });
    }
    return NextResponse.json({ success: true, data: workspaces });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// POST a new workspace
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const workspace = await Workspace.create(body);
    return NextResponse.json(
      { success: true, data: workspace },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
