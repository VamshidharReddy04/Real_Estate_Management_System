import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAgentProperties, deleteProperty } from '../store/slices/propertySlice';
import { formatPrice, formatDate } from '../utils/helpers';
import API from '../utils/axios';
import toast from 'react-hot-toast';

const TAB_LIST = ['properties', 'inquiries', 'profile'];

export default function AgentDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { agentProperties, loading } = useSelector(s => s.properties);
  const [tab, setTab] = useState('properties');
  const [inquiries, setInquiries] = useState([]);
  const [loadingInq, setLoadingInq] = useState(false);

  useEffect(() => { dispatch(fetchAgentProperties()); }, []);
  useEffect(() => { if (tab === 'inquiries') loadInquiries(); }, [tab]);

  const loadInquiries = async () => {
    setLoadingInq(true);
    try {
      const res = await API.get('/inquiries/agent');
      setInquiries(res.data.inquiries);
    } catch { toast.error('Failed to load inquiries'); }
    finally { setLoadingInq(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    const res = await dispatch(deleteProperty(id));
    if (!res.error) toast.success('Property deleted');
    else toast.error('Failed to delete');
  };

  const handleReply = async (id, reply) => {
    try {
      await API.put(`/inquiries/${id}`, { reply });
      toast.success('Reply sent!');
      setInquiries(inqs => inqs.map(i => i._id === id ? { ...i, reply, status: 'replied' } : i));
    } catch { toast.error('Failed to send reply'); }
  };

  const stats = {
    total: agentProperties.length,
    approved: agentProperties.filter(p => p.isApproved).length,
    pending: agentProperties.filter(p => !p.isApproved).length,
    totalViews: agentProperties.reduce((s, p) => s + (p.views || 0), 0),
  };

  const statusBadge = (p) => p.isApproved
    ? <span className="badge bg-green-100 text-green-700">✅ Live</span>
    : <span className="badge bg-amber-100 text-amber-700">⏳ Pending</span>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
            <p className="text-gray-500 text-sm">Manage your property listings</p>
          </div>
        </div>
        <Link to="/agent/add" className="btn-primary">+ Add Property</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Listings', value: stats.total, icon: '🏠', color: 'bg-blue-50 text-blue-600' },
          { label: 'Live Properties', value: stats.approved, icon: '✅', color: 'bg-green-50 text-green-600' },
          { label: 'Pending Review', value: stats.pending, icon: '⏳', color: 'bg-amber-50 text-amber-600' },
          { label: 'Total Views', value: stats.totalViews, icon: '👁️', color: 'bg-purple-50 text-purple-600' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {TAB_LIST.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t === 'properties' ? '🏠 My Properties' : t === 'inquiries' ? '💬 Inquiries' : '👤 Profile'}
          </button>
        ))}
      </div>

      {/* Properties Tab */}
      {tab === 'properties' && (
        loading ? <div className="text-center py-10 text-gray-400">Loading...</div> :
        agentProperties.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏚️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties listed yet</h3>
            <p className="text-gray-400 mb-6">Start by adding your first property listing</p>
            <Link to="/agent/add" className="btn-primary">+ Add First Property</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {agentProperties.map(p => {
              const img = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=60';
              return (
                <div key={p._id} className="card p-4 flex gap-4 items-center flex-wrap sm:flex-nowrap">
                  <img src={img} alt={p.title} className="w-20 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{p.title}</h3>
                      {statusBadge(p)}
                    </div>
                    <p className="text-xs text-gray-400">📍 {p.location?.city} • 👁️ {p.views} views • 📅 {formatDate(p.createdAt)}</p>
                    <p className="text-primary-700 font-bold mt-1">{formatPrice(p.price, p.priceUnit)}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link to={`/properties/${p._id}`} className="text-xs px-3 py-1.5 border rounded-lg hover:bg-gray-50 transition-colors">View</Link>
                    <button onClick={() => navigate(`/agent/edit/${p._id}`)} className="text-xs px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Inquiries Tab */}
      {tab === 'inquiries' && (
        loadingInq ? <div className="text-center py-10 text-gray-400">Loading...</div> :
        inquiries.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700">No inquiries yet</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map(inq => (
              <InquiryCard key={inq._id} inq={inq} onReply={handleReply} />
            ))}
          </div>
        )
      )}

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="card p-6 max-w-md">
          <h2 className="font-semibold text-gray-800 mb-4">Agent Profile</h2>
          <div className="space-y-3">
            {[
              { label: 'Full Name', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'Phone', value: user?.phone || 'Not provided' },
              { label: 'Role', value: 'Agent' },
              { label: 'License', value: user?.agentInfo?.license || 'Not provided' },
              { label: 'Agency', value: user?.agentInfo?.agency || 'Not provided' },
            ].map(f => (
              <div key={f.label} className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">{f.label}</span>
                <span className="text-sm font-medium text-gray-800">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InquiryCard({ inq, onReply }) {
  const [replyText, setReplyText] = useState('');
  const [open, setOpen] = useState(false);
  const statusColor = { pending: 'bg-amber-100 text-amber-700', read: 'bg-blue-100 text-blue-700', replied: 'bg-green-100 text-green-700' };

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
        <div>
          <p className="font-semibold text-gray-800 text-sm">{inq.name}</p>
          <p className="text-xs text-gray-500">{inq.email} {inq.phone && `• ${inq.phone}`}</p>
          <Link to={`/properties/${inq.property?._id}`} className="text-xs text-primary-600 hover:underline mt-0.5 block">
            🏠 {inq.property?.title}
          </Link>
        </div>
        <span className={`badge ${statusColor[inq.status]} capitalize`}>{inq.status}</span>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg mb-3">
        <p className="text-sm text-gray-700">"{inq.message}"</p>
      </div>
      {inq.reply && (
        <div className="bg-primary-50 p-3 rounded-lg mb-3">
          <p className="text-xs text-primary-600 font-medium mb-1">Your reply:</p>
          <p className="text-sm text-primary-800">"{inq.reply}"</p>
        </div>
      )}
      {!inq.reply && (
        <div>
          <button onClick={() => setOpen(!open)} className="text-sm text-primary-600 hover:underline font-medium">
            {open ? '✕ Cancel' : '💬 Reply'}
          </button>
          {open && (
            <div className="mt-3 flex gap-2">
              <input value={replyText} onChange={e => setReplyText(e.target.value)}
                placeholder="Type your reply..." className="input-field text-sm flex-1" />
              <button onClick={() => { onReply(inq._id, replyText); setOpen(false); }}
                className="btn-primary text-sm py-2 px-4">Send</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
