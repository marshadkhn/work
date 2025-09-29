import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Workspace from "@/lib/models/Workspace";
import Project from "@/lib/models/Project"; // Keep this import

// GET all workspaces with their projects (Optimized with Aggregation)
export async function GET() {
  await dbConnect();
  try {
    const workspaces = await Workspace.aggregate([
      {
        $lookup: {
          from: "projects", // Make sure this is your projects collection name
          localField: "_id",
          foreignField: "workspace",
          as: "projects",
        },
      },
      {
        $sort: { createdAt: -1 }, // Optional: to sort workspaces by creation date
      },
    ]);

    return NextResponse.json({ success: true, data: workspaces });
  } catch (error) {
    console.error("API Error fetching workspaces:", error); // For debugging
    return NextResponse.json(
      { success: false, error: "Failed to fetch data." },
      { status: 500 }
    );
  }
}

// POST a new workspace (No changes needed here)
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
