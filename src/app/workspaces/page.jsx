"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Briefcase,
  LoaderCircle,
  Calendar,
  Tag,
  Globe,
  Trash2,
  AlertTriangle,
  Flag,
  CreditCard,
} from "lucide-react";
import { countries } from "@/lib/countries";

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

const ProjectCard = ({
  project,
  currencySymbol = "₹",
  onDelete,
  onManagePayments,
}) => {
  const amountPaid = project.payments.reduce((acc, p) => acc + p.amount, 0);
  const amountDue = project.totalAmount - amountPaid;
  const progress =
    project.totalAmount > 0 ? (amountPaid / project.totalAmount) * 100 : 0;

  const priorityColors = {
    High: "bg-red-500/20 text-red-400 border-red-500/30",
    Medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    Easy: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  return (
    <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 hover:border-blue-500 transition-all duration-300 group relative">
      <button
        onClick={() => onDelete(project._id, "project", project.name)}
        className="absolute top-2 right-2 p-1 bg-red-600/50 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-zinc-100">{project.name}</h4>
          <div className="flex gap-2 mt-1 flex-wrap">
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
              {project.category}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${
                priorityColors[project.priority]
              }`}
            >
              {project.priority}
            </span>
          </div>
        </div>
        <div className="text-lg font-bold text-zinc-100">
          {currencySymbol}
          {project.totalAmount.toLocaleString()}
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-zinc-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-zinc-400 mt-1.5">
          <span>
            Paid: {currencySymbol}
            {amountPaid.toLocaleString()}
          </span>
          <span>
            Due: {currencySymbol}
            {amountDue.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-zinc-700/50">
        <button
          onClick={() => onManagePayments(project)}
          className="w-full text-center text-xs font-semibold text-blue-400 hover:text-blue-300 py-1 rounded-md hover:bg-zinc-700/50 transition-colors"
        >
          Manage Payments
        </button>
      </div>
    </div>
  );
};

const InputField = ({
  Icon,
  name,
  as = "input",
  children,
  currencySymbol,
  ...props
}) => {
  const Component = as;
  const isSelect = as === "select";
  const DisplayIcon =
    name === "totalAmount"
      ? () => <span className="text-zinc-400">{currencySymbol || "₹"}</span>
      : Icon;

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-1 capitalize">
        {name.replace(/([A-Z])/g, " $1")}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center pointer-events-none text-zinc-400">
          {DisplayIcon && <DisplayIcon />}
        </div>
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

const initialWorkspaceState = {
  name: "",
  type: "Agency",
  country: "India",
  currency: "INR",
};
const initialProjectState = {
  name: "",
  category: "Full Stack",
  totalAmount: "",
  startDate: "",
  endDate: "",
  priority: "Medium",
};
const initialPaymentState = {
  amount: "",
  date: new Date().toISOString().split("T")[0],
  method: "UPI",
  type: "Milestone",
  note: "",
};

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState(initialWorkspaceState);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [newProject, setNewProject] = useState(initialProjectState);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [newPayment, setNewPayment] = useState(initialPaymentState);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/workspaces");
      setWorkspaces(res.data.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch workspaces. Full error:",
        error.response || error.message
      );
      setWorkspaces([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCountryChange = (e) => {
    const selectedCountryName = e.target.value;
    const selectedCountry = countries.find(
      (c) => c.name === selectedCountryName
    );
    if (selectedCountry) {
      setNewWorkspace({
        ...newWorkspace,
        country: selectedCountry.name,
        currency: selectedCountry.currency,
      });
    }
  };

  const handleAddWorkspace = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/workspaces", newWorkspace);
      setNewWorkspace(initialWorkspaceState);
      setIsWorkspaceModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to add workspace", error);
    }
  };

  const openProjectModal = (workspace) => {
    setCurrentWorkspace(workspace);
    setNewProject(initialProjectState);
    setIsProjectModalOpen(true);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const projectData = {
      ...newProject,
      workspace: currentWorkspace._id,
      totalAmount: Number(newProject.totalAmount),
    };
    try {
      await axios.post("/api/projects", projectData);
      setNewProject(initialProjectState);
      setIsProjectModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to add project", error);
    }
  };

  const openDeleteModal = (id, type, name) => {
    setItemToDelete({ id, type, name });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const { id, type } = itemToDelete;
    try {
      if (type === "workspace") {
        await axios.delete(`/api/workspaces/${id}`);
      } else if (type === "project") {
        await axios.delete(`/api/projects/${id}`);
      }
      fetchData();
    } catch (error) {
      console.error(`Failed to delete ${type}`, error);
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const openPaymentModal = (project) => {
    setCurrentProject(project);
    setIsPaymentModalOpen(true);
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    const paymentData = { ...newPayment, amount: Number(newPayment.amount) };
    try {
      await axios.post("/api/payments", {
        projectId: currentProject._id,
        paymentData,
      });
      setNewPayment(initialPaymentState);
      setIsPaymentModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to add payment", error);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <LoaderCircle className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );

  return (
    <div className="text-zinc-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workspaces</h1>
        <button
          onClick={() => setIsWorkspaceModalOpen(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-5 w-5 mr-2" /> New Workspace
        </button>
      </div>

      <div className="space-y-8">
        {workspaces.map((workspace) => {
          const countryInfo = countries.find(
            (c) => c.name === workspace.country
          );
          const currencySymbol = countryInfo ? countryInfo.symbol : "₹";
          return (
            <div
              key={workspace._id}
              className="bg-zinc-900 p-6 rounded-xl border border-zinc-800"
            >
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <Briefcase className="h-6 w-6 text-zinc-400" />
                  <h2 className="text-2xl font-bold text-zinc-100">
                    {workspace.name}
                  </h2>
                  <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full">
                    {workspace.type}
                  </span>
                  <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full">
                    {workspace.country} ({workspace.currency})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openProjectModal(workspace)}
                    className="flex items-center bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Project
                  </button>
                  <button
                    onClick={() =>
                      openDeleteModal(
                        workspace._id,
                        "workspace",
                        workspace.name
                      )
                    }
                    className="p-1.5 bg-red-600/80 text-white rounded-md hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {workspace.projects && workspace.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workspace.projects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      currencySymbol={currencySymbol}
                      onDelete={openDeleteModal}
                      onManagePayments={openPaymentModal}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-zinc-700 rounded-lg">
                  <p className="text-zinc-500">
                    No projects yet in this workspace.
                  </p>
                </div>
              )}
            </div>
          );
        })}
        {workspaces.length === 0 && !isLoading && (
          <div className="text-center py-16 border-2 border-dashed border-zinc-700 rounded-lg">
            <Briefcase className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
            <h3 className="text-xl font-semibold text-zinc-400">
              No Workspaces Found
            </h3>
            <p className="text-zinc-500 mt-2">
              Click "New Workspace" to add your first client or agency.
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        title="Create New Workspace"
      >
        <form onSubmit={handleAddWorkspace} className="space-y-4 pt-2">
          <InputField
            Icon={Briefcase}
            name="name"
            value={newWorkspace.name}
            onChange={(e) =>
              setNewWorkspace({ ...newWorkspace, name: e.target.value })
            }
            placeholder="e.g., Vercel, John Doe"
            required
          />
          <InputField
            Icon={Tag}
            name="type"
            as="select"
            value={newWorkspace.type}
            onChange={(e) =>
              setNewWorkspace({ ...newWorkspace, type: e.target.value })
            }
          >
            <option>Agency</option>
            <option>Individual</option>
          </InputField>
          <InputField
            Icon={Globe}
            name="country"
            as="select"
            value={newWorkspace.country}
            onChange={handleCountryChange}
          >
            {countries.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </InputField>
          <div className="flex justify-end pt-4 gap-3">
            <button
              type="button"
              onClick={() => setIsWorkspaceModalOpen(false)}
              className="px-4 py-2 text-zinc-300 rounded-lg hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Add New Project"
      >
        <form onSubmit={handleAddProject} className="space-y-4 pt-2">
          <InputField
            Icon={Briefcase}
            name="name"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
            required
          />
          <InputField
            Icon={Tag}
            name="category"
            as="select"
            value={newProject.category}
            onChange={(e) =>
              setNewProject({ ...newProject, category: e.target.value })
            }
          >
            <option>Full Stack</option>
            <option>Frontend</option>
            <option>Wordpress</option>
            <option>Webflow</option>
            <option>Framer</option>
            <option>Other</option>
          </InputField>
          <InputField
            name="totalAmount"
            type="number"
            placeholder={`Total Amount in ${
              currentWorkspace?.currency || "..."
            }`}
            value={newProject.totalAmount}
            onChange={(e) =>
              setNewProject({ ...newProject, totalAmount: e.target.value })
            }
            currencySymbol={
              countries.find((c) => c.currency === currentWorkspace?.currency)
                ?.symbol
            }
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              Icon={Calendar}
              name="Start Date"
              type="date"
              value={newProject.startDate}
              onChange={(e) =>
                setNewProject({ ...newProject, startDate: e.target.value })
              }
            />
            <InputField
              Icon={Calendar}
              name="End Date"
              type="date"
              value={newProject.endDate}
              onChange={(e) =>
                setNewProject({ ...newProject, endDate: e.target.value })
              }
            />
          </div>
          <InputField
            Icon={Flag}
            name="priority"
            as="select"
            value={newProject.priority}
            onChange={(e) =>
              setNewProject({ ...newProject, priority: e.target.value })
            }
          >
            <option>High</option>
            <option>Medium</option>
            <option>Easy</option>
          </InputField>
          <div className="flex justify-end pt-4 gap-3">
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
              className="px-4 py-2 text-zinc-300 rounded-lg hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Project
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
            Are you sure you want to delete{" "}
            <strong className="font-bold text-zinc-100">
              "{itemToDelete?.name}"
            </strong>
            ?
          </p>
          {itemToDelete?.type === "workspace" && (
            <p className="text-sm text-amber-400 mt-2">
              Warning: Deleting a workspace will also delete all projects inside
              it. This action cannot be undone.
            </p>
          )}
          {itemToDelete?.type === "project" && (
            <p className="text-sm text-zinc-400 mt-2">
              This action cannot be undone.
            </p>
          )}
        </div>
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-6 py-2 text-zinc-300 rounded-lg hover:bg-zinc-700"
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

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={`Payments for "${currentProject?.name}"`}
      >
        <div className="space-y-4">
          <div className="max-h-48 overflow-y-auto pr-2">
            {currentProject?.payments && currentProject.payments.length > 0 ? (
              currentProject.payments.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-zinc-800 p-2 rounded-md mb-2"
                >
                  <div>
                    <p className="font-semibold text-zinc-100">
                      ₹{p.amount.toLocaleString()}{" "}
                      <span className="text-xs text-zinc-400 ml-1">
                        ({p.type})
                      </span>
                    </p>
                    <p className="text-xs text-zinc-500">
                      {p.note || p.method} -{" "}
                      {new Date(p.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-zinc-500 py-4">
                No payments recorded yet.
              </p>
            )}
          </div>

          <form
            onSubmit={handleAddPayment}
            className="space-y-4 pt-4 border-t border-zinc-700"
          >
            <h4 className="font-semibold text-zinc-200">Add New Payment</h4>
            <InputField
              Icon={CreditCard}
              name="amount"
              type="number"
              placeholder="Amount"
              value={newPayment.amount}
              onChange={(e) =>
                setNewPayment({ ...newPayment, amount: e.target.value })
              }
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                Icon={Tag}
                name="type"
                as="select"
                value={newPayment.type}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, type: e.target.value })
                }
              >
                <option>Milestone</option>
                <option>Advance</option>
                <option>Final</option>
              </InputField>
              <InputField
                Icon={Calendar}
                name="date"
                type="date"
                value={newPayment.date}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, date: e.target.value })
                }
              />
            </div>
            <InputField
              Icon={Tag}
              name="method"
              as="select"
              value={newPayment.method}
              onChange={(e) =>
                setNewPayment({ ...newPayment, method: e.target.value })
              }
            >
              <option>UPI</option>
              <option>Bank Transfer</option>
              <option>Cash</option>
              <option>Other</option>
            </InputField>
            <InputField
              Icon={Briefcase}
              name="note"
              placeholder="Optional note (e.g., Phase 1 payment)"
              value={newPayment.note}
              onChange={(e) =>
                setNewPayment({ ...newPayment, note: e.target.value })
              }
            />
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Payment
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
