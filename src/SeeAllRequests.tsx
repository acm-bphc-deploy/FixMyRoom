// SeeAllRequests.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

type RequestItem = {
  id: string;
  created_at?: string | null;
  category?: string | null;
  problem?: string | null;
  building?: string | null;
  roomNo?: string | null;
  priority?: string | null;
  status?: string | null;
  progress?: number | null;
  email?: string | null;
  [key: string]: any;
};

const PAGE_SIZE = 12;

export default function SeeAllRequests() {
  const params = useParams();
  const navigate = useNavigate();
  const paramEmail = (params as any).email;
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">(
    "all"
  );
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "priority_desc" | "priority_asc"
  >("newest");
  const [page, setPage] = useState(1);

  const [localBackup, setLocalBackup] = useState<RequestItem[] | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      let targetEmail = paramEmail ?? null;

      if (!targetEmail) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        targetEmail = user?.email ?? null;
      }

      if (!targetEmail) {
        throw new Error(
          "No email found. You may not be logged in or DB connection failed."
        );
      }

      const res = await supabase
        .from("maintenance_requests")
        .select("*")
        .eq("email", targetEmail)
        .order("created_at", { ascending: false })
        .limit(1000);

      if (res.error) throw res.error;

      setRequests(res.data);
      setLocalBackup(res.data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Could not load requests.");
      setRequests(localBackup || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [paramEmail]);

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = [...requests];

    if (activeTab === "active") {
      list = list.filter((r) =>
        ["pending", "in-progress"].includes((r.status || "").toLowerCase())
      );
    } else if (activeTab === "completed") {
      list = list.filter(
        (r) => (r.status || "").toLowerCase() === "completed"
      );
    }

    if (q.length > 0) {
      list = list.filter((r) => {
        const fields = [
          r.problem,
          r.category,
          r.building,
          r.roomNo,
          r.email,
          r.id,
        ]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());

        return fields.some((f) => f.includes(q));
      });
    }

    if (sortBy === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );
    } else if (sortBy === "oldest") {
      list.sort(
        (a, b) =>
          new Date(a.created_at || 0).getTime() -
          new Date(b.created_at || 0).getTime()
      );
    } else {
      const rank = (p?: string | null) =>
        p?.toLowerCase() === "high" ? 3 : p?.toLowerCase() === "medium" ? 2 : 1;

      if (sortBy === "priority_desc") {
        list.sort((a, b) => rank(b.priority) - rank(a.priority));
      } else {
        list.sort((a, b) => rank(a.priority) - rank(b.priority));
      }
    }

    return list;
  }, [requests, activeTab, search, sortBy]);

  const paginated = filteredSorted.slice(0, page * PAGE_SIZE);

  const loadMore = () => setPage((p) => p + 1);

  const handleCardClick = (id?: string) =>
    id && navigate(`/request/${id}`);

  const getPriorityColor = (priority?: string) => {
    const p = priority?.toLowerCase();
    if (p === "high") return "bg-red-100 text-red-800";
    if (p === "medium") return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getCategoryIcon = (category?: string) => {
    const c = category?.toLowerCase();
    if (c === "plumbing") return "🚰";
    if (c === "electricity" || c === "electrical") return "⚡";
    if (c === "carpentry") return "🔨";
    return "🔧";
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen min-w-[220px]">
      <div className="max-w-6xl mx-auto">
        
        {/* ⭐ Minimal Glass Back Button — Option A */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 px-4 py-2 flex items-center gap-2
                     rounded-xl bg-white/60 backdrop-blur
                     border border-gray-200 shadow-sm
                     hover:shadow-md hover:bg-white/80
                     transition-all text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </button>

        {/* Header + Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">
              My Maintenance Requests
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track past requests, reopen or view details.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search problem, category, building..."
                className="pl-4 pr-10 py-1.5 sm:py-2 rounded-lg border w-full sm:w-auto border-gray-200 bg-white shadow-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-200"/>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                ⌕
              </div>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setPage(1);
              }}
              className="py-1.5 sm:py-2 pl-3 pr-6 rounded-lg w-full sm:w-auto border border-gray-200 bg-white shadow-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="priority_desc">Priority: High → Low</option>
              <option value="priority_asc">Priority: Low → High</option>
            </select>

            <button
              onClick={() => fetchRequests()}
              className="px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow hover:scale-105 transition-transform"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/60 p-2 rounded-lg flex w-full gap-2 mb-6 border border-white/30 shadow-sm">
          {["all", "active", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as any);
                setPage(1);
              }}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-all flex-1 text-center ${
  activeTab === tab
    ? "bg-white shadow text-slate-900"
    : "text-slate-600"
}`}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
            <strong>Error:</strong> {errorMsg}
          </div>
        )}

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((request) => (
            <article
              key={request.id}
              onClick={() => handleCardClick(request.id)}
              className="bg-white rounded-2xl border border-gray-100 shadow hover:shadow-lg transition p-4 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-2xl">
                    {getCategoryIcon(request.category ?? undefined)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 capitalize break-words">
                      {request.category || "General"}
                    </h3>
                    <div className="text-xs text-gray-400">
                      <span className="sm:hidden">{request.created_at
                        ? new Date(request.created_at).toLocaleString()
                        : "-"}
                        </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                  <div
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                      request.priority ?? undefined
                    )}`}
                  >
                    {request.priority || "low"}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {request.status || "unknown"}
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-700 mb-3 line-clamp-3">
                {request.problem || "No description provided."}
              </p>

              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex flex-wrap items-center gap-1">
                  📍
                  <span className="font-medium text-slate-700">
                    {request.building || "-"}
                  </span>
                  • Room {request.roomNo || "-"}
                </div>

                <div>
                  {request.progress ? (
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${request.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600">
                        {request.progress}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredSorted.length === 0 && (
          <div className="text-center mt-12 text-gray-500">
            <p>No matching requests found.</p>
          </div>
        )}

        {/* Load More */}
        {paginated.length < filteredSorted.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="px-6 py-3 rounded-lg bg-white border border-gray-200 shadow hover:shadow-lg"
            >
              Load more
            </button>
          </div>
        )}

        <div className="text-center text-xs text-gray-400 mt-6">
          Showing {paginated.length} of {filteredSorted.length} requests
        </div>
      </div>
    </div>
  );
}
