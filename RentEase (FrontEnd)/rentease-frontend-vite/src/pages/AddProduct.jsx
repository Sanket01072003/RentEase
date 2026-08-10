import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProductApi, getAllCategoriesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const s = {
  page:  { maxWidth:700, margin:'0 auto', padding:'32px 24px' },
  card:  { background:'white', borderRadius:16, padding:36, boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  title: { fontSize:26, fontWeight:700, color:'#1a237e', marginBottom:6 },
  sub:   { fontSize:14, color:'#888', marginBottom:28 },
  label: { display:'block', fontSize:13, fontWeight:600, color:'#444', marginBottom:6, marginTop:18 },
  input: { width:'100%', padding:'12px 14px', border:'1.5px solid #ddd', borderRadius:8, fontSize:15, outline:'none' },
  select:{ width:'100%', padding:'12px 14px', border:'1.5px solid #ddd', borderRadius:8, fontSize:15, outline:'none', background:'white' },
  textarea:{ width:'100%', padding:'12px 14px', border:'1.5px solid #ddd', borderRadius:8, fontSize:15, outline:'none', height:100, resize:'vertical' },
  row:   { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 },
  btn:   { width:'100%', background:'#1a237e', color:'white', border:'none', padding:'13px 0', borderRadius:8, fontSize:16, fontWeight:700, cursor:'pointer', marginTop:24 },
  back:  { width:'100%', background:'#f5f5f5', color:'#666', border:'none', padding:'11px 0', borderRadius:8, fontSize:14, cursor:'pointer', marginTop:10 },
  catToggle: { background:'none', border:'none', color:'#1a237e', fontSize:13, fontWeight:600, cursor:'pointer', padding:0, marginTop:6 },
  catBox:    { background:'#f5f5f5', borderRadius:8, padding:14, marginTop:10, display:'flex', gap:10, alignItems:'flex-end' },
  catAddBtn: { background:'#2e7d32', color:'white', border:'none', padding:'11px 16px', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' },
};

export default function AddProduct() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [form, setForm] = useState({
    productName:'', description:'', pricePerDay:'',
    depositAmount:'', categoryId:'',
  });
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    getAllCategoriesApi().then(r => setCategories(r.data || [])).catch(() => {});
  }, []);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submit = async e => {
    e.preventDefault();
    if (!form.productName || !form.description || !form.pricePerDay || !form.depositAmount || !form.categoryId) {
      toast.error('Fill all required fields'); return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('productName', form.productName);
      fd.append('description', form.description);
      fd.append('pricePerDay', parseFloat(form.pricePerDay));
      fd.append('depositAmount', parseFloat(form.depositAmount));
      fd.append('categoryId', parseInt(form.categoryId));
      fd.append('ownerId', parseInt(user.id));
      if (imageFile) fd.append('image', imageFile);

      await addProductApi(fd);
      toast.success('Product added successfully!');
      navigate('/owner/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product!');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.title}>📦 Add New Product</div>
        <div style={s.sub}>List your product for rent on RentEase</div>
        <form onSubmit={submit}>
          <label style={s.label}>Product Name *</label>
          <input style={s.input} name="productName" placeholder="e.g. Canon DSLR Camera" value={form.productName} onChange={handle} />

          <label style={s.label}>Description *</label>
          <textarea style={s.textarea} name="description" placeholder="Describe your product..." value={form.description} onChange={handle} />

          <label style={s.label}>Category *</label>
          <select style={s.select} name="categoryId" value={form.categoryId} onChange={handle}>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
          </select>

          <div style={s.row}>
            <div>
              <label style={s.label}>Price Per Day (₹) *</label>
              <input style={s.input} name="pricePerDay" type="number" placeholder="500" value={form.pricePerDay} onChange={handle} min="1" />
            </div>
            <div>
              <label style={s.label}>Deposit Amount (₹) *</label>
              <input style={s.input} name="depositAmount" type="number" placeholder="5000" value={form.depositAmount} onChange={handle} min="0" />
            </div>
          </div>

          <label style={s.label}>Product Image (optional)</label>
          <input style={s.input} type="file" accept="image/*" onChange={handleFile} />
          {imagePreview && (
            <img src={imagePreview} alt="preview" style={{ marginTop:12, width:'100%', maxHeight:220, objectFit:'cover', borderRadius:10 }} />
          )}

          <button style={s.btn} disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</button>
          <button type="button" style={s.back} onClick={() => navigate('/owner/dashboard')}>← Back to Dashboard</button>
        </form>
      </div>
    </div>
  );
}
