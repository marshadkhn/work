import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Expense from "@/lib/models/Expense";

// DELETE an expense by ID
export async function DELETE(request, { params }) {
  const { id } = params;
  await dbConnect();
  try {
    await Expense.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Expense deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
