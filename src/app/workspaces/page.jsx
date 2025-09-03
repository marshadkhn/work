"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Briefcase,
  DollarSign,
  LoaderCircle,
  Calendar,
  Tag,
  Globe,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { countries } from "@/lib/countries";

// Modal Component
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

// Project Card Component
const ProjectCard = ({ project, currencySymbol = "$", onDelete }) => {
  const amountPaid = project.payments.reduce((acc, p) => acc + p.amount, 0);
  const amountDue = project.totalAmount - amountPaid;
  const progress =
    project.totalAmount > 0 ? (amountPaid / project.totalAmount) * 100 : 0;

  return (
    <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-blue-500 transition-all duration-300 group relative">
      <button
        onClick={() => onDelete(project._id, "project")}
        className="absolute top-2 right-2 p-1 bg-red-600/50 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-slate-100">{project.name}</h4>
          <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/50">
            {project.category}
          </span>
        </div>
        <div className="text-lg font-bold text-slate-100">
          {currencySymbol}
          {project.totalAmount.toLocaleString()}
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-slate-600 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1.5">
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
    </div>
  );
};

// Form initial states
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
  deadline: "",
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

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/workspaces");
      setWorkspaces(res.data.data);
    } catch (error) {
      console.error("Failed to fetch workspaces", error);
    }
    setIsLoading(false);
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

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <LoaderCircle className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );

  return (
    <div className="text-slate-100">
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
          const currencySymbol = countryInfo ? countryInfo.symbol : "$";
          return (
            <div
              key={workspace._id}
              className="bg-slate-800 p-6 rounded-xl border border-slate-700"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-slate-400" />
                  <h2 className="text-2xl font-bold text-slate-100">
                    {workspace.name}
                  </h2>
                  <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full">
                    {workspace.type}
                  </span>
                  <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full">
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
                      onDelete={(projectId) =>
                        openDeleteModal(projectId, "project", project.name)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-slate-700 rounded-lg">
                  <p className="text-slate-500">
                    No projects yet in this workspace.
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {workspaces.length === 0 && !isLoading && (
          <div className="text-center py-16 border-2 border-dashed border-slate-700 rounded-lg">
            <Briefcase className="h-12 w-12 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-400">
              No Workspaces Found
            </h3>
            <p className="text-slate-500 mt-2">
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
              className="px-4 py-2 text-slate-300 rounded-lg hover:bg-slate-700"
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
            Icon={DollarSign}
            name="totalAmount"
            type="number"
            placeholder={`Total Amount in ${currentWorkspace?.currency}`}
            value={newProject.totalAmount}
            onChange={(e) =>
              setNewProject({ ...newProject, totalAmount: e.target.value })
            }
            required
          />
          <InputField
            Icon={Calendar}
            name="deadline"
            type="date"
            value={newProject.deadline}
            onChange={(e) =>
              setNewProject({ ...newProject, deadline: e.target.value })
            }
          />

          <div className="flex justify-end pt-4 gap-3">
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
              className="px-4 py-2 text-slate-300 rounded-lg hover:bg-slate-700"
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
          <p className="text-lg text-slate-300">
            Are you sure you want to delete{" "}
            <strong className="font-bold text-slate-100">
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
            <p className="text-sm text-slate-400 mt-2">
              This action cannot be undone.
            </p>
          )}
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
