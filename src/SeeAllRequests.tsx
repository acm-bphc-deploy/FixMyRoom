import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function SeeAllRequests() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await supabase
        .from("maintenance_requests")
        .select("*")
        .eq("email", email)
        .order("created_at", { ascending: false });
      
      setRequests(res.data || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [email]);

  const handleCardClick = (requestId) => {
    navigate(`/request/${requestId}`);
  };

  const getPriorityColor = (priority) => {
    const priorityLower = priority?.toLowerCase();
    if (priorityLower === "high") return "bg-red-100 text-red-800";
    if (priorityLower === "medium") return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getCategoryIcon = (category) => {
    const categoryLower = category?.toLowerCase();
    if (categoryLower === "plumbing") return "🚰";
    if (categoryLower === "electrical") return "⚡";
    if (categoryLower === "carpentry") return "🔨";
    return "🔧";
  };

  if (loading) {
    return <div className="p-6">Loading requests...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Maintenance Requests</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((request) => (
          <div
            key={request.id}
            onClick={() => handleCardClick(request.id)}
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200"
          >
            {/* Header Section */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(request.category)}</span>
                <div>
                  <h3 className="font-semibold text-gray-800 capitalize">
                    {request.category}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                  request.priority
                )}`}
              >
                {request.priority}
              </span>
            </div>

            {/* Problem Description */}
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {request.problem}
            </p>

            {/* Location Info */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span>📍</span>
              <span className="font-medium">{request.building}</span>
              <span>•</span>
              <span>Room {request.roomNo}</span>
            </div>

            {/* Visit Time */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <span>🕐</span>
              <span>{request.visitTime}</span>
            </div>

            {/* Status Badge */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500 capitalize">
                Status: <span className="font-medium">{request.status}</span>
              </span>
              {request.progress > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${request.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{request.progress}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No maintenance requests found
        </div>
      )}
    </div>
  );
}
