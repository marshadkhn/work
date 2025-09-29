"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  DollarSign,
  Briefcase,
  TrendingUp,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// A robust, reusable Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    amber: "bg-amber-500",
  };
  return (
    <div className="bg-slate-800 p-6 rounded-xl flex items-center border border-slate-700">
      <div className={`p-3 rounded-lg mr-4 ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    ongoingProjects: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // A fallback username if the session email is not available
  const userName = session?.user?.email?.split("@")[0] || "Freelancer";

  useEffect(() => {
    const fetchData = async () => {
      // No need to set isLoading here, it's set initially
      try {
        // Fetch stats and recent projects in parallel for efficiency
        const [statsRes, projectsRes] = await Promise.all([
          axios.get("/api/stats"),
          axios.get("/api/workspaces"), // Assumes projects are nested in workspaces
        ]);

        if (statsRes.data?.data) {
          setStats(statsRes.data.data);
        }

        // Extract, sort, and slice projects safely
        const allProjects =
          projectsRes.data?.data?.flatMap((ws) => ws.projects) || [];
        const sortedProjects = allProjects.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentProjects(sortedProjects.slice(0, 5)); // Get the 5 most recent
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Optionally, set an error state here to show a message to the user
      } finally {
        // This ensures the loader is always turned off, even if an error occurs
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoaderCircle className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">
          Welcome ARSHAD!
        </h1>
        <p className="text-slate-400 mt-1">
          Here&apos;s a summary of your freelance business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Revenue (All Time)"
          value={`$${(stats.totalRevenue || 0).toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="green"
        />
        <StatCard
          title="Pending Amount"
          value={`$${(stats.pendingAmount || 0).toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="amber"
        />
        <StatCard
          title="Ongoing Projects"
          value={stats.ongoingProjects || 0}
          icon={<Briefcase className="h-6 w-6 text-white" />}
          color="blue"
        />
      </div>

      {/* Recent Projects Section */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-100">
            Recent Projects
          </h2>
          <Link
            href="/workspaces"
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
          >
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="divide-y divide-slate-700">
          {recentProjects.length > 0 ? (
            recentProjects.map((project) => {
              const amountPaid = project.payments.reduce(
                (acc, p) => acc + p.amount,
                0
              );
              const isOverdue =
                project.deadline && new Date(project.deadline) < new Date();
              return (
                <div
                  key={project._id}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-slate-200">
                      {project.name}
                    </p>
                    <p className="text-sm text-slate-400">{project.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-200">
                      ${amountPaid.toLocaleString()} / $
                      {project.totalAmount.toLocaleString()}
                    </p>
                    {project.deadline && (
                      <p
                        className={`text-xs ${
                          isOverdue ? "text-red-400" : "text-slate-400"
                        }`}
                      >
                        Due: {new Date(project.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-slate-500 text-center py-4">
              No recent projects to show.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
