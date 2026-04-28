import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProperties,
  approveProperty,
  deleteProperty,
} from "../store/slices/propertySlice";
import { formatPrice, formatDate, getAgentDisplayName } from "../utils/helpers";
import API from "../utils/axios";
import toast from "react-hot-toast";

const TABS = ["properties", "users", "inquiries", "stats"];

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { adminProperties, loading } = useSelector((s) => s.properties);
  const [tab, setTab] = useState("properties");
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminProperties());
    fetchStats();
  }, []);
  useEffect(() => {
    if (tab === "users") loadUsers();
    if (tab === "inquiries") loadInquiries();
  }, [tab]);

  const fetchStats = async () => {
    try {
      const r = await API.get("/admin/stats");
      setStats(r.data.stats);
    } catch {}
  };
  const loadUsers = async () => {
    setLoadingData(true);
    try {
      const r = await API.get("/admin/users");
      setUsers(r.data.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoadingData(false);
    }
  };
  const loadInquiries = async () => {
    setLoadingData(true);
    try {
      const r = await API.get("/inquiries/admin");
      setInquiries(r.data.inquiries);
    } catch {
      toast.error("Failed");
    } finally {
      setLoadingData(false);
    }
  };

  const handleApprove = async (id, val) => {
    const res = await dispatch(approveProperty({ id, isApproved: val }));
    if (!res.error) toast.success(`Property ${val ? "approved" : "rejected"}`);
  };

  const handleDeleteProp = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    const res = await dispatch(deleteProperty(id));
    if (!res.error) toast.success("Deleted");
    else toast.error("Failed");
  };

  const handleUserAction = async (id, data) => {
    try {
      await API.put(`/admin/users/${id}`, data);
      toast.success("User updated");
      setUsers((us) => us.map((u) => (u._id === id ? { ...u, ...data } : u)));
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      setUsers((us) => us.filter((u) => u._id !== id));
    } catch {
      toast.error("Failed");
    }
  };

  const roleColor = {
    user: "bg-blue-100 text-blue-700",
    agent: "bg-purple-100 text-purple-700",
    admin: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">⚙️ Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage the entire EstateHub platform
        </p>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Total Users",
              value: stats.totalUsers,
              icon: "👤",
              color: "bg-blue-50 text-blue-600",
            },
            {
              label: "Total Agents",
              value: stats.totalAgents,
              icon: "🏢",
              color: "bg-purple-50 text-purple-600",
            },
            {
              label: "Live Properties",
              value: stats.totalProperties,
              icon: "✅",
              color: "bg-green-50 text-green-600",
            },
            {
              label: "Pending Review",
              value: stats.pendingProperties,
              icon: "⏳",
              color: "bg-amber-50 text-amber-600",
            },
            {
              label: "Inquiries",
              value: stats.totalInquiries,
              icon: "💬",
              color: "bg-pink-50 text-pink-600",
            },
          ].map((s) => (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${s.color}`}
              >
                {s.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
        {[
          ["properties", "🏠 Properties"],
          ["users", "👤 Users"],
          ["inquiries", "💬 Inquiries"],
        ].map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === t ? "bg-white text-primary-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Properties Tab */}
      {tab === "properties" &&
        (loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">
                {adminProperties.length} total properties
              </p>
              <Link to="/agent/add" className="btn-primary text-sm py-2">
                + Add Property
              </Link>
            </div>
            {adminProperties.map((p) => {
              const img =
                p.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=60";
              return (
                <div
                  key={p._id}
                  className="card p-4 flex gap-4 items-center flex-wrap sm:flex-nowrap"
                >
                  <img
                    src={img}
                    alt={p.title}
                    className="w-16 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {p.title}
                      </h3>
                      <span
                        className={`badge ${p.isApproved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {p.isApproved ? "✅ Live" : "⏳ Pending"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.location?.city} • Agent: {getAgentDisplayName(p.agent)}{" "}
                      • {formatDate(p.createdAt)}
                    </p>
                    <p className="text-primary-700 font-bold text-sm mt-1">
                      {formatPrice(p.price, p.priceUnit)}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0 flex-wrap">
                    <Link
                      to={`/properties/${p._id}`}
                      className="text-xs px-3 py-1.5 border rounded-lg hover:bg-gray-50"
                    >
                      View
                    </Link>
                    {!p.isApproved ? (
                      <button
                        onClick={() => handleApprove(p._id, true)}
                        className="text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                      >
                        ✅ Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApprove(p._id, false)}
                        className="text-xs px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100"
                      >
                        ⏸ Suspend
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteProp(p._id)}
                      className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      {/* Users Tab */}
      {tab === "users" &&
        (loadingData ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Name", "Email", "Role", "Status", "Joined", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-500">{u.email}</td>
                    <td className="py-3 px-3">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleUserAction(u._id, { role: e.target.value })
                        }
                        className={`badge border-0 cursor-pointer ${roleColor[u.role]} capitalize text-xs`}
                      >
                        <option value="user">user</option>
                        <option value="agent">agent</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`badge ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {u.isActive ? "Active" : "Banned"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-400">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() =>
                            handleUserAction(u._id, { isActive: !u.isActive })
                          }
                          className={`text-xs px-2 py-1 rounded-lg ${u.isActive ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                        >
                          {u.isActive ? "Ban" : "Unban"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {/* Inquiries Tab */}
      {tab === "inquiries" &&
        (loadingData ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div key={inq._id} className="card p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-sm text-gray-800">
                      {inq.name} → {inq.agent?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {inq.property?.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg">
                      "{inq.message}"
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`badge capitalize ${inq.status === "replied" ? "bg-green-100 text-green-700" : inq.status === "read" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {inq.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(inq.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
