import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Expense from "@/lib/models/Expense";

// GET all expenses
export async function GET() {
  await dbConnect();
  try {
    const expenses = await Expense.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// POST a new expense (Yeh naye field ko handle kar lega)
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const expense = await Expense.create(body);
    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
