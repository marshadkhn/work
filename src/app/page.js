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
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { countries } from "@/lib/countries";

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    amber: "bg-amber-500",
    purple: "bg-purple-600",
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
    completedProjects: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratesRes, workspacesRes] = await Promise.all([
          axios.get("https://open.er-api.com/v6/latest/USD"),
          axios.get("/api/workspaces"),
        ]);

        const rates = ratesRes.data.rates;
        const workspaces = workspacesRes.data.data || [];

        let totalRevenueUSD = 0;
        let totalPaidUSD = 0;
        let ongoingProjectsCount = 0;
        let completedProjectsCount = 0;

        const allProjects = workspaces.flatMap((ws) =>
          ws.projects.map((p) => ({ ...p, workspace: ws }))
        );

        allProjects.forEach((project) => {
          const currency = project.workspace.currency;
          const rate = rates[currency] || 1;
          totalRevenueUSD += project.totalAmount / rate;
          const paidForProject = project.payments.reduce(
            (acc, p) => acc + p.amount,
            0
          );

          if (project.status === "Completed") {
            totalPaidUSD += project.totalAmount / rate;
            completedProjectsCount++;
          } else {
            totalPaidUSD += paidForProject / rate;
            if (project.status === "Ongoing") {
              ongoingProjectsCount++;
            }
          }
        });

        setStats({
          totalRevenue: totalRevenueUSD,
          pendingAmount: totalRevenueUSD - totalPaidUSD,
          ongoingProjects: ongoingProjectsCount,
          completedProjects: completedProjectsCount,
        });

        const sortedProjects = allProjects.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentProjects(sortedProjects.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCurrencySymbol = (currencyCode) => {
    const country = countries.find((c) => c.currency === currencyCode);
    return country ? country.symbol : "$";
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
          Welcome ARSHAD!
        </h1>
        <p className="text-slate-400 mt-1">
          Here&apos;s a summary of your freelance business.
        </p>
      </div>

      {/* --- YAHAN CHANGE HUA HAI --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue (USD)"
          value={`$${(stats.totalRevenue || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="green"
        />
        <StatCard
          title="Pending Amount (USD)"
          value={`$${(stats.pendingAmount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="amber"
        />
        <StatCard
          title="Ongoing Projects"
          value={stats.ongoingProjects || 0}
          icon={<Briefcase className="h-6 w-6 text-white" />}
          color="blue"
        />
        <StatCard
          title="Completed Projects"
          value={stats.completedProjects || 0}
          icon={<CheckCircle className="h-6 w-6 text-white" />}
          color="purple"
        />
      </div>

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
              const actualAmountPaid = project.payments.reduce(
                (acc, p) => acc + p.amount,
                0
              );
              const displayAmountPaid =
                project.status === "Completed"
                  ? project.totalAmount
                  : actualAmountPaid;

              const isOverdue =
                project.deadline && new Date(project.deadline) < new Date();
              const currencySymbol = getCurrencySymbol(
                project.workspace.currency
              );
              return (
                <div
                  key={project._id}
                  className="py-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-200">
                      {project.name}
                    </p>
                    <p className="text-sm text-slate-400">{project.category}</p>
                  </div>
                  <div className="w-full sm:w-auto text-left sm:text-right">
                    <p className="font-semibold text-slate-200">
                      {currencySymbol}
                      {displayAmountPaid.toLocaleString()} / {currencySymbol}
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
