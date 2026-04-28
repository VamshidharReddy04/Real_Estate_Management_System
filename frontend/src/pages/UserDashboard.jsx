import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { formatPrice, formatDate } from '../utils/helpers';
import API from '../utils/axios';
import toast from 'react-hot-toast';

const TAB_LIST = ['wishlist', 'inquiries', 'profile'];

export default function UserDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { items, loading } = useSelector(s => s.wishlist);
  const [tab, setTab] = useState('wishlist');
  const [inquiries, setInquiries] = useState([]);
  const [loadingInq, setLoadingInq] = useState(false);

  useEffect(() => { dispatch(fetchWishlist()); }, []);
  useEffect(() => {
    if (tab === 'inquiries') fetchInquiries();
  }, [tab]);

  const fetchInquiries = async () => {
    setLoadingInq(true);
    try {
      const res = await API.get('/inquiries/my');
      setInquiries(res.data.inquiries);
    } catch { toast.error('Failed to load inquiries'); }
    finally { setLoadingInq(false); }
  };

  const handleRemoveWishlist = async (propertyId) => {
    await dispatch(removeFromWishlist(propertyId));
    toast.success('Removed from wishlist');
  };

  const statusColor = { pending: 'bg-amber-100 text-amber-700', read: 'bg-blue-100 text-blue-700', replied: 'bg-green-100 text-green-700' };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, {user?.name}!</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Saved Properties', value: items.length, icon: '❤️', color: 'bg-red-50 text-red-600' },
          { label: 'My Inquiries', value: inquiries.length, icon: '💬', color: 'bg-blue-50 text-blue-600' },
          { label: 'Account Type', value: 'User', icon: '👤', color: 'bg-green-50 text-green-600' },
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
            {t === 'wishlist' ? '❤️ Wishlist' : t === 'inquiries' ? '💬 Inquiries' : '👤 Profile'}
          </button>
        ))}
      </div>

      {/* Wishlist Tab */}
      {tab === 'wishlist' && (
        loading ? <div className="text-center py-10 text-gray-400">Loading...</div> :
        items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-400 mb-6">Start exploring properties and save your favorites!</p>
            <Link to="/" className="btn-primary">Browse Properties</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(item => {
              const p = item.property;
              if (!p || typeof p === 'string') return null;
              const img = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80';
              return (
                <div key={p._id} className="card overflow-hidden group">
                  <div className="relative h-44 bg-gray-100">
                    <img src={img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button onClick={() => handleRemoveWishlist(p._id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors">
                      ✕
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{p.title}</h3>
                    <p className="text-gray-400 text-xs mb-2">📍 {p.location?.city}, {p.location?.state}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-primary-700 font-bold">{formatPrice(p.price, p.priceUnit)}</p>
                      <Link to={`/properties/${p._id}`} className="text-xs text-primary-600 hover:underline font-medium">View →</Link>
                    </div>
                    <p className="text-xs text-gray-300 mt-2">Saved {formatDate(item.addedAt)}</p>
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
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No inquiries yet</h3>
            <p className="text-gray-400">Contact agents to inquire about properties</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map(inq => (
              <div key={inq._id} className="card p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex gap-3 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      <img src={inq.property?.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&q=60'}
                        alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <Link to={`/properties/${inq.property?._id}`}
                        className="font-semibold text-gray-800 hover:text-primary-600 text-sm">{inq.property?.title}</Link>
                      <p className="text-xs text-gray-500 mt-0.5">Agent: {inq.agent?.name}</p>
                      <p className="text-gray-600 text-sm mt-2 bg-gray-50 p-2 rounded-lg">"{inq.message}"</p>
                      {inq.reply && (
                        <div className="mt-2 bg-primary-50 border border-primary-100 p-2 rounded-lg">
                          <p className="text-xs text-primary-700 font-medium mb-0.5">Agent Reply:</p>
                          <p className="text-sm text-primary-800">"{inq.reply}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`badge ${statusColor[inq.status]} capitalize mb-1`}>{inq.status}</span>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(inq.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="card p-6 max-w-md">
          <h2 className="font-semibold text-gray-800 mb-4">Profile Information</h2>
          <div className="space-y-3">
            {[{ label: 'Full Name', value: user?.name }, { label: 'Email', value: user?.email }, { label: 'Phone', value: user?.phone || 'Not provided' }, { label: 'Role', value: user?.role }, { label: 'Member Since', value: formatDate(user?.createdAt) }].map(f => (
              <div key={f.label} className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">{f.label}</span>
                <span className="text-sm font-medium text-gray-800 capitalize">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
