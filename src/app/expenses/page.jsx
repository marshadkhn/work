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
  Edit,
  AlertTriangle,
  DollarSign,
  Info,
} from "lucide-react";

// Reusable Modal Component
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-100">{title}</h2>
        {children}
      </div>
    </div>
  );
};

// Reusable InputField Component
const InputField = ({ Icon, name, as = "input", children, ...props }) => {
  const Component = as;
  const isSelect = as === "select";
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1 capitalize">
        {name.replace(/([A-Z])/g, " $1")}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
        <Component
          name={name}
          {...props}
          className={`w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isSelect ? "appearance-none pr-10" : ""
          }`}
        >
          {children}
        </Component>
        {isSelect && (
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-5 h-5 text-slate-400"
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
      // YEH HAI FIX: Agar API se data nahi aata, toh ek khaali array set karo
      setExpenses(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch expenses", error);
      setExpenses([]); // Error aane par bhi khaali array set karo
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
    if (!expenses) return []; // Ek aur safety check
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      if (view === "Daily")
        return expenseDate.toDateString() === now.toDateString();
      if (view === "Monthly")
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      if (view === "Yearly")
        return expenseDate.getFullYear() === now.getFullYear();
      return true;
    });
  }, [expenses, view]);

  const totalExpense = filteredExpenses.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  return (
    <div className="text-slate-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Expense Tracker</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-5 w-5 mr-2" /> New Expense
        </button>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-slate-400">{view} Expenses</p>
            <p className="text-3xl font-bold text-red-400">
              ${totalExpense.toLocaleString()}
            </p>
          </div>
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setView("Daily")}
              className={`px-3 py-1 text-sm rounded-md ${
                view === "Daily" ? "bg-blue-600 text-white" : "text-slate-300"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setView("Monthly")}
              className={`px-3 py-1 text-sm rounded-md ${
                view === "Monthly" ? "bg-blue-600 text-white" : "text-slate-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setView("Yearly")}
              className={`px-3 py-1 text-sm rounded-md ${
                view === "Yearly" ? "bg-blue-600 text-white" : "text-slate-300"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <LoaderCircle className="h-8 w-8 animate-spin mx-auto" />
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-slate-700 rounded-lg mr-4">
                      <Wallet className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100">
                        {expense.description}
                      </p>
                      <p className="text-xs text-slate-400">
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
                      ${expense.amount.toLocaleString()}
                    </p>
                    <button
                      onClick={() =>
                        openDeleteModal(expense._id, expense.description)
                      }
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-700 rounded-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">
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
              className="px-4 py-2 text-slate-300 rounded-lg hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Expense
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-slate-300">
            Are you sure you want to delete this expense:{" "}
            <strong className="font-bold text-slate-100">
              "{itemToDelete?.description}"
            </strong>
            ?
          </p>
          <p className="text-sm text-slate-400 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-6 py-2 text-slate-300 rounded-lg hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
