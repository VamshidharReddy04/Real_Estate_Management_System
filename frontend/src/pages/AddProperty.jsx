import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../store/slices/propertySlice';
import { PROPERTY_TYPES, FURNISHED_OPTIONS, AMENITIES_LIST } from '../utils/helpers';
import toast from 'react-hot-toast';

const STEPS = ['Basic Info', 'Location', 'Features', 'Amenities & Images'];

const defaultForm = {
  title: '', description: '', type: 'apartment', status: 'sale',
  price: '', priceUnit: 'total',
  location: { address: '', city: '', state: '', country: 'India', zipCode: '' },
  features: { bedrooms: 2, bathrooms: 1, area: '', areaUnit: 'sqft', parking: false, furnished: 'unfurnished', floor: '', totalFloors: '', yearBuilt: '' },
  amenities: [],
};

export default function AddProperty() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.properties);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const set = (path, val) => {
    setForm(f => {
      const copy = { ...f };
      const keys = path.split('.');
      let ref = copy;
      keys.slice(0, -1).forEach(k => { ref[k] = { ...ref[k] }; ref = ref[k]; });
      ref[keys[keys.length - 1]] = val;
      return copy;
    });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) return toast.error('Max 10 images allowed');
    setImages(prev => [...prev, ...files]);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => setPreviews(p => [...p, ev.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (i) => {
    setImages(imgs => imgs.filter((_, idx) => idx !== i));
    setPreviews(pvs => pvs.filter((_, idx) => idx !== i));
  };

  const toggleAmenity = (a) => setForm(f => ({
    ...f,
    amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
  }));

  const validateStep = () => {
    if (step === 0) {
      if (!form.title.trim()) return toast.error('Title is required');
      if (!form.description.trim()) return toast.error('Description is required');
      if (!form.price) return toast.error('Price is required');
    }
    if (step === 1) {
      if (!form.location.address.trim()) return toast.error('Address is required');
      if (!form.location.city.trim()) return toast.error('City is required');
      if (!form.location.state.trim()) return toast.error('State is required');
    }
    if (step === 2 && !form.features.area) return toast.error('Area is required');
    return true;
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    const { amenities, ...rest } = form;
    fd.append('data', JSON.stringify({ ...rest, amenities }));
    images.forEach(img => fd.append('images', img));

    const res = await dispatch(createProperty(fd));
    if (!res.error) {
      toast.success('🎉 Property submitted for review!');
      navigate('/agent');
    } else {
      toast.error(res.payload || 'Failed to submit property');
    }
  };

  const inputCls = 'input-field text-sm';
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Property</h1>
      <p className="text-gray-500 text-sm mb-8">Fill in the details below to list your property</p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 cursor-pointer ${i <= step ? 'text-primary-600' : 'text-gray-400'}`}
              onClick={() => i < step && setStep(i)}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${i < step ? 'bg-primary-600 text-white' : i === step ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 'bg-gray-200 text-gray-500'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="hidden sm:block text-sm font-medium">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 rounded ${i < step ? 'bg-primary-500' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="card p-6">
        {/* Step 0 - Basic Info */}
        {step === 0 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div>
              <label className={labelCls}>Property Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="e.g. Luxurious 3BHK Apartment in Banjara Hills"
                className={inputCls} maxLength={100} />
              <p className="text-xs text-gray-400 mt-1">{form.title.length}/100</p>
            </div>
            <div>
              <label className={labelCls}>Description *</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={4} placeholder="Describe the property, surroundings, and key highlights..."
                className={`${inputCls} resize-none`} maxLength={2000} />
              <p className="text-xs text-gray-400 mt-1">{form.description.length}/2000</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Property Type *</label>
                <select value={form.type} onChange={e => set('type', e.target.value)} className={inputCls}>
                  {PROPERTY_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Listing Type *</label>
                <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Price (₹) *</label>
                <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
                  placeholder="e.g. 5000000" className={inputCls} min={0} />
              </div>
              <div>
                <label className={labelCls}>Price Unit</label>
                <select value={form.priceUnit} onChange={e => set('priceUnit', e.target.value)} className={inputCls}>
                  <option value="total">Total Price</option>
                  <option value="per_month">Per Month</option>
                  <option value="per_year">Per Year</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 1 - Location */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Location Details</h2>
            <div>
              <label className={labelCls}>Street Address *</label>
              <input value={form.location.address} onChange={e => set('location.address', e.target.value)}
                placeholder="e.g. 42, MG Road, Jubilee Hills" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>City *</label>
                <input value={form.location.city} onChange={e => set('location.city', e.target.value)}
                  placeholder="e.g. Hyderabad" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>State *</label>
                <input value={form.location.state} onChange={e => set('location.state', e.target.value)}
                  placeholder="e.g. Telangana" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>ZIP Code</label>
                <input value={form.location.zipCode} onChange={e => set('location.zipCode', e.target.value)}
                  placeholder="e.g. 500034" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Country</label>
                <input value={form.location.country} onChange={e => set('location.country', e.target.value)}
                  className={inputCls} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 - Features */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Property Features</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Bedrooms</label>
                <input type="number" value={form.features.bedrooms} min={0}
                  onChange={e => set('features.bedrooms', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Bathrooms</label>
                <input type="number" value={form.features.bathrooms} min={0}
                  onChange={e => set('features.bathrooms', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Area *</label>
                <input type="number" value={form.features.area}
                  onChange={e => set('features.area', e.target.value)} placeholder="e.g. 1200" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Area Unit</label>
                <select value={form.features.areaUnit} onChange={e => set('features.areaUnit', e.target.value)} className={inputCls}>
                  <option value="sqft">sqft</option>
                  <option value="sqm">sqm</option>
                  <option value="acres">acres</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Floor No.</label>
                <input type="number" value={form.features.floor} min={0}
                  onChange={e => set('features.floor', e.target.value)} placeholder="e.g. 3" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Total Floors</label>
                <input type="number" value={form.features.totalFloors} min={0}
                  onChange={e => set('features.totalFloors', e.target.value)} placeholder="e.g. 10" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Furnishing</label>
                <select value={form.features.furnished} onChange={e => set('features.furnished', e.target.value)} className={inputCls}>
                  {FURNISHED_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Year Built</label>
                <input type="number" value={form.features.yearBuilt}
                  onChange={e => set('features.yearBuilt', e.target.value)} placeholder="e.g. 2020" className={inputCls} />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.features.parking}
                onChange={e => set('features.parking', e.target.checked)} className="w-4 h-4 accent-primary-600" />
              <span className="text-sm font-medium text-gray-700">🚗 Parking Available</span>
            </label>
          </div>
        )}

        {/* Step 3 - Amenities + Images */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_LIST.map(a => (
                  <button key={a} type="button" onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${form.amenities.includes(a) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'}`}>
                    {form.amenities.includes(a) ? '✅ ' : ''}{a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-3">Property Images (Max 10)</h2>
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all">
                <span className="text-3xl mb-2">📸</span>
                <span className="text-sm font-medium text-gray-600">Click to upload images</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — up to 5MB each</span>
                <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
              </label>

              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} alt="" className="w-full h-16 rounded-lg object-cover" />
                      <button onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
          <button disabled={step === 0} onClick={() => setStep(s => s - 1)}
            className="btn-secondary disabled:opacity-40">← Back</button>

          {step < STEPS.length - 1 ? (
            <button onClick={() => { if (validateStep() === true) setStep(s => s + 1); }}
              className="btn-primary">Continue →</button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="btn-primary">
              {loading ? '⏳ Submitting...' : '🚀 Submit Property'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
