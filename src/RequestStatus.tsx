"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import adminEmails from "./config/adminEmails";

export default function RequestStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [showReopenConfirm, setShowReopenConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data.user ?? null);
    })();
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Failed to fetch request:", error);
        setRequest(null);
      } else {
        setRequest(data);
      }
      setLoading(false);
    })();
  }, [id]);

  const isRequester =
    currentUser && request && String(currentUser.id) === String(request.user_id);
  const isAdmin = currentUser && adminEmails.includes(currentUser.email || "");

  const updateFlags = async (patch: Record<string, any>) => {
    if (!request) return;
    setSaving(true);
    const { error, data } = await supabase
      .from("maintenance_requests")
      .update(patch)
      .eq("id", request.id)
      .select()
      .single();

    if (error) console.error("Update error:", error);
    if (data) setRequest(data);
    setSaving(false);

    // If both confirmations true, mark completed
    const r = data ?? request;
    if (r.requester_confirmed && r.worker_confirmed && r.status !== "completed") {
      await supabase
        .from("maintenance_requests")
        .update({ status: "completed" })
        .eq("id", request.id);
      setRequest({ ...r, status: "completed" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-slate-700 animate-pulse">Loading request...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Request Not Found</h2>
          <p className="text-slate-600">The maintenance request you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white";
      case "in-progress":
        return "bg-blue-500 text-white";
      case "pending":
        return "bg-amber-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-8">
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .neumorphic {
          background: linear-gradient(145deg, #ffffff, #f0f0f0);
          box-shadow: 8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff;
        }
        .progress-gradient {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="glass-card rounded-3xl p-5 sm:p-8 mb-6 hover-lift">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Request #{request.id.slice(0, 8)}
                </h1>
              </div>
              <p className="text-sm text-slate-500 ml-15">Submitted on {new Date(request.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="flex flex-col gap-3">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getPriorityColor(request.priority)}`}>
                {request.priority?.toUpperCase() || "NORMAL"} PRIORITY
              </span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                {request.status?.toUpperCase()}
              </span>
              </div>
              <div className="self-start">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm font-medium
bg-blue-50 text-blue-700
border border-blue-100
flex items-center gap-2
hover:bg-blue-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="glass-card rounded-3xl p-6 mb-6 hover-lift">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Requester Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Name</p>
              <p className="text-lg font-semibold text-slate-800">{request.name}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Email</p>
              <p className="text-lg font-semibold text-slate-800 truncate">{request.email}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Building</p>
              <p className="text-lg font-semibold text-slate-800">{request.building}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Room Number</p>
              <p className="text-lg font-semibold text-slate-800">{request.roomNo}</p>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="glass-card rounded-3xl p-6 mb-6 hover-lift">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Request Details
          </h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-5 rounded-2xl border border-violet-100">
              <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-2">Category</p>
              <p className="text-2xl font-bold text-slate-800 capitalize">{request.category}</p>
            </div>
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-5 rounded-2xl border border-slate-200">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Problem Description</p>
              <p className="text-lg text-slate-700 leading-relaxed">{request.problem}</p>
            </div>
            {/* Fixed tags parsing */}
            {request.tags && request.tags !== '[]' && (() => {
              let tags = [];
              try {
                // Try to parse as JSON array
                const parsed = JSON.parse(request.tags);
                tags = Array.isArray(parsed) ? parsed : [];
              } catch {
                // Fallback: handle comma-separated string
                tags = String(request.tags)
                  .replace(/[\[\]"']/g, '')
                  .split(',')
                  .map(t => t.trim())
                  .filter(Boolean);
              }
              return tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null;
            })()}
          </div>
        </div>

        {/* Progress Card */}
        <div className="glass-card rounded-3xl p-6 mb-6 hover-lift">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Progress Status
          </h2>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex-1 h-6 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full overflow-hidden shadow-inner relative">
              <div
                className="progress-gradient h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                style={{ width: `${request.progress ?? 0}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent min-w-[4rem] text-right">
              {request.progress ?? 0}%
            </div>
          </div>
          <p className="text-sm text-slate-500 text-center mt-2">
            {request.progress === 100
              ? "🎉 Completed!"
              : request.progress >= 50
              ? "⚡ Making great progress"
              : "🚀 Getting started"}
          </p>
        </div>

        {/* Quick Actions - Mark Complete Button (NEW) */}
        {isRequester && !request.requester_confirmed && (
          <div className="glass-card rounded-3xl p-6 mb-6 hover-lift bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Ready to confirm?</h3>
                  <p className="text-sm text-slate-600">Mark this request as complete from your side</p>
                </div>
              </div>
              <button
                className="px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl flex items-center gap-2 whitespace-nowrap"
                disabled={saving}
                onClick={() => updateFlags({ requester_confirmed: true })}
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Confirming...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark as Complete
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Confirmation completed state (NEW) */}
        {isRequester && request.requester_confirmed && (
          <div className="glass-card rounded-3xl p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-700">✓ You've confirmed completion!</h3>
                <p className="text-sm text-green-600">Waiting for worker confirmation to finalize</p>
              </div>
            </div>
          </div>
        )}

        {/* REOPEN BUTTON */}
        {isRequester && request.status === "completed" && (
          <div className="glass-card rounded-3xl p-6 mb-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-rose-300 hover-lift">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v6h6M20 20v-6h-6M5 19l14-14" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-rose-700">Need to reopen this request?</h3>
                  <p className="text-sm text-rose-600">If the issue still persists, reopen the request.</p>
                </div>
              </div>

              <button
                onClick={() => setShowReopenConfirm(true)}
                disabled={saving}
                className="px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl flex items-center gap-2 whitespace-nowrap"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Reopening...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v6h6M20 20v-6h-6M5 19l14-14" />
                    </svg>
                    Reopen Request
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Reopen Confirmation Modal */}
        {showReopenConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowReopenConfirm(false)}
            ></div>
            <div className="bg-white rounded-lg p-6 max-w-lg w-full relative z-10 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800">Reopen request?</h3>
                  <p className="text-sm text-slate-600 mt-1">This will set the request back to pending and clear confirmations. Are you sure you want to continue?</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-100 text-slate-700 hover:bg-gray-200 transition-all"
                  onClick={() => setShowReopenConfirm(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold hover:opacity-95 transition-all"
                  onClick={async () => {
                    await updateFlags({
                      status: "pending",
                      requester_confirmed: false,
                      worker_confirmed: false,
                      progress: 0,
                    });
                    setShowReopenConfirm(false);
                  }}
                  disabled={saving}
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Reopening...
                    </span>
                  ) : (
                    "Yes, Reopen"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Requester Confirmation */}
          <div className="glass-card rounded-3xl p-6 hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  request.requester_confirmed
                    ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg"
                    : "bg-gradient-to-br from-slate-200 to-slate-300"
                }`}
              >
                {request.requester_confirmed ? (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Requester</h3>
                <p className={`text-sm font-semibold ${request.requester_confirmed ? "text-green-600" : "text-amber-600"}`}>
                  {request.requester_confirmed ? "✓ Confirmed" : "⏳ Pending"}
                </p>
              </div>
            </div>
            {isRequester && (
              <button
                className={`w-full py-3 px-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${
                  request.requester_confirmed
                    ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white cursor-not-allowed opacity-75"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-2xl hover:scale-105 active:scale-95"
                }`}
                disabled={saving || request.requester_confirmed}
                onClick={() => updateFlags({ requester_confirmed: true })}
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Confirming...
                  </span>
                ) : request.requester_confirmed ? (
                  "✓ Confirmed"
                ) : (
                  "✓ Confirm Completion"
                )}
              </button>
            )}
          </div>

          {/* Worker Confirmation */}
          <div className="glass-card rounded-3xl p-6 hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  request.worker_confirmed
                    ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg"
                    : "bg-gradient-to-br from-slate-200 to-slate-300"
                }`}
              >
                {request.worker_confirmed ? (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Worker</h3>
                <p className={`text-sm font-semibold ${request.worker_confirmed ? "text-green-600" : "text-amber-600"}`}>
                  {request.worker_confirmed ? "✓ Confirmed" : "⏳ Pending"}
                </p>
              </div>
            </div>
            {isAdmin && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-slate-700">Adjust Progress</label>
                    <span className="text-sm font-bold text-blue-600">{request.progress ?? 0}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={request.progress ?? 0}
                    onChange={(e) => updateFlags({ progress: Number(e.target.value) })}
                    className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${
                      request.worker_confirmed
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white cursor-not-allowed opacity-75"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-2xl hover:scale-105 active:scale-95"
                    }`}
                    disabled={saving || request.worker_confirmed}
                    onClick={() => updateFlags({ worker_confirmed: true })}
                  >
                    {saving ? "..." : request.worker_confirmed ? "✓ Confirmed" : "✓ Confirm"}
                  </button>
                  <button
                    className="px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 hover:from-slate-300 hover:to-slate-400 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                    onClick={() => updateFlags({ progress: 0 })}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="glass-card rounded-3xl p-6 border-l-4 border-blue-500">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-1">Completion Requirements</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                The request will be automatically marked as <span className="font-semibold text-green-600">completed</span> once both the requester and the worker confirm completion. This ensures accountability and satisfaction from both parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
