"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Plus,
  LoaderCircle,
  Wallet,
  Calendar,
  Tag,
  Trash2,
  AlertTriangle,
  DollarSign,
  Info,
} from "lucide-react";

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 p-6 rounded-xl shadow-2xl w-full max-w-lg border border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-zinc-100">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const InputField = ({ Icon, name, as = "input", children, ...props }) => {
  const Component = as;
  const isSelect = as === "select";
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-1 capitalize">
        {name.replace(/([A-Z])/g, " $1")}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
        <Component
          name={name}
          {...props}
          className={`w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isSelect ? "appearance-none pr-10" : ""
          }`}
        >
          {children}
        </Component>
        {isSelect && (
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-5 h-5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

const initialExpenseState = {
  amount: "",
  category: "Food",
  description: "",
  date: new Date().toISOString().split("T")[0],
  otherCategoryDescription: "",
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState(initialExpenseState);
  const [view, setView] = useState("Monthly");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/expenses");
      setExpenses(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch expenses", error);
      setExpenses([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const expenseData = { ...newExpense, amount: Number(newExpense.amount) };
    if (expenseData.category !== "Other") {
      expenseData.otherCategoryDescription = "";
    }
    try {
      await axios.post("/api/expenses", expenseData);
      setNewExpense(initialExpenseState);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to add expense", error);
    }
  };

  const openDeleteModal = (id, description) => {
    setItemToDelete({ id, description });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await axios.delete(`/api/expenses/${itemToDelete.id}`);
      fetchData();
    } catch (error) {
      console.error("Failed to delete expense", error);
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const firstDayOfWeek = new Date(now);
    firstDayOfWeek.setDate(now.getDate() - now.getDay());
    firstDayOfWeek.setHours(0, 0, 0, 0);

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);

    if (!expenses) return [];

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      if (view === "Daily")
        return expenseDate.toDateString() === now.toDateString();
      if (view === "Weekly") {
        return expenseDate >= firstDayOfWeek && expenseDate <= lastDayOfWeek;
      }
      if (view === "Monthly")
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      if (view === "Yearly") return expenseDate.getFullYear() === currentYear;
      return true;
    });
  }, [expenses, view]);

  const totalExpense = filteredExpenses.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  return (
    <div className="text-zinc-100">
      {/* --- YEH SECTION RESPONSIVE KIYA GAYA HAI --- */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Expense Tracker</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors shadow-md w-full sm:w-auto justify-center"
        >
          <Plus className="h-5 w-5 mr-2" /> New Expense
        </button>
      </div>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        {/* --- YEH SECTION BHI RESPONSIVE KIYA GAYA HAI --- */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <p className="text-zinc-400">{view} Expenses</p>
            <p className="text-3xl font-bold text-red-400">
              ₹{totalExpense.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setView("Daily")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === "Daily"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setView("Weekly")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === "Weekly"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setView("Monthly")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === "Monthly"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setView("Yearly")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === "Yearly"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <LoaderCircle className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-zinc-800 rounded-lg mr-4">
                      <Wallet className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-100">
                        {expense.description}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {expense.category === "Other"
                          ? expense.otherCategoryDescription
                          : expense.category}
                        {" · "}
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-red-400">
                      ₹{expense.amount.toLocaleString()}
                    </p>
                    <button
                      onClick={() =>
                        openDeleteModal(expense._id, expense.description)
                      }
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-700 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-center py-8">
                No expenses found for this period.
              </p>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Expense"
      >
        <form onSubmit={handleAddExpense} className="space-y-4 pt-2">
          <InputField
            Icon={DollarSign}
            name="amount"
            type="number"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: e.target.value })
            }
            placeholder="0.00"
            required
          />
          <InputField
            Icon={Tag}
            name="category"
            as="select"
            value={newExpense.category}
            onChange={(e) =>
              setNewExpense({ ...newExpense, category: e.target.value })
            }
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Software</option>
            <option>Office Supplies</option>
            <option>Subcontractor</option>
            <option>Other</option>
          </InputField>
          {newExpense.category === "Other" && (
            <InputField
              Icon={Info}
              name="otherCategoryDescription"
              value={newExpense.otherCategoryDescription}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  otherCategoryDescription: e.target.value,
                })
              }
              placeholder="Specify other category"
              required
            />
          )}
          <InputField
            Icon={Wallet}
            name="description"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
            placeholder="e.g., Lunch with client"
            required
          />
          <InputField
            Icon={Calendar}
            name="date"
            type="date"
            value={newExpense.date}
            onChange={(e) =>
              setNewExpense({ ...newExpense, date: e.target.value })
            }
            required
          />
          <div className="flex justify-end pt-4 gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"
            >
              Add Expense
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-zinc-300">
            Are you sure you want to delete this expense:{" "}
            <strong className="font-bold text-zinc-100">
              "{itemToDelete?.description}"
            </strong>
            ?
          </p>
          <p className="text-sm text-zinc-400 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-6 py-2 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
