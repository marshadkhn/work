import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/lib/models/Project";

export async function GET() {
  await dbConnect();
  try {
    const allProjects = await Project.find({});

    let totalRevenue = 0;
    let totalPaid = 0;
    let ongoingProjects = 0;

    allProjects.forEach((project) => {
      totalRevenue += project.totalAmount;
      const paidForProject = project.payments.reduce(
        (acc, p) => acc + p.amount,
        0
      );
      totalPaid += paidForProject;
      if (project.status === "Ongoing") {
        ongoingProjects++;
      }
    });

    const pendingAmount = totalRevenue - totalPaid;

    const stats = {
      totalRevenue,
      pendingAmount,
      ongoingProjects,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
