import React, { useEffect, useState } from 'react';
import { getAllCategoriesApi, addCategoryApi, deleteCategoryApi, getAllProductsApi, deleteProductApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const s = {
  page:   { maxWidth:800, margin:'0 auto', padding:'32px 24px' },
  title:  { fontSize:26, fontWeight:700, color:'#1a237e', marginBottom:6 },
  sub:    { fontSize:14, color:'#888', marginBottom:28 },
  card:   { background:'white', borderRadius:16, padding:28, boxShadow:'0 4px 20px rgba(0,0,0,0.1)', marginBottom:24 },
  cardTitle: { fontSize:17, fontWeight:700, color:'#1a237e', marginBottom:16 },
  row:    { display:'flex', gap:10, marginBottom:20 },
  input:  { flex:1, padding:'11px 14px', border:'1.5px solid #ddd', borderRadius:8, fontSize:14, outline:'none' },
  addBtn: { background:'#1a237e', color:'white', border:'none', padding:'11px 20px', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' },
  list:   { display:'flex', flexDirection:'column', gap:10 },
  item:   { display:'flex', alignItems:'center', justifyContent:'space-between', background:'#f5f5f5', borderRadius:10, padding:'12px 16px' },
  itemName: { fontSize:14, fontWeight:600, color:'#333' },
  itemDesc: { fontSize:12, color:'#888', marginTop:2 },
  delBtn: { background:'#ffebee', color:'#c62828', border:'none', padding:'7px 14px', borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer' },
  empty:  { textAlign:'center', color:'#888', fontSize:14, padding:'20px 0' },
  prodItem: { display:'flex', alignItems:'center', gap:12, background:'#f5f5f5', borderRadius:10, padding:'10px 16px' },
  thumb:    { width:48, height:48, borderRadius:8, objectFit:'cover', background:'#e0e0e0', flexShrink:0 },
  prodInfo: { flex:1 },
  prodMeta: { fontSize:12, color:'#888', marginTop:2 },
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [name, setName]             = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding]         = useState(false);

  const [products, setProducts]         = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const load = () =>
    getAllCategoriesApi()
      .then(r => setCategories(r.data || []))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));

  const loadProducts = () =>
    getAllProductsApi()
      .then(r => setProducts(r.data || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setProductsLoading(false));

  useEffect(() => { load(); loadProducts(); }, []);

  const handleAdd = async () => {
    if (!name.trim()) { toast.error('Enter a category name'); return; }
    setAdding(true);
    try {
      await addCategoryApi({ categoryName: name.trim(), description: description.trim() || null });
      toast.success('Category added!');
      setName('');
      setDescription('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category!');
    } finally { setAdding(false); }
  };

  const handleDelete = async (id, categoryName) => {
    if (!window.confirm(`Delete category "${categoryName}"?`)) return;
    try {
      await deleteCategoryApi(id);
      toast.success('Category deleted!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category!');
    }
  };

  const handleDeleteProduct = async (id, productName) => {
    if (!window.confirm(`Delete product "${productName}"? This cannot be undone.`)) return;
    try {
      await deleteProductApi(id);
      toast.success('Product deleted!');
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product!');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.title}>🛡️ Admin Dashboard</div>
      <div style={s.sub}>Hi {user.name} — manage product categories for RentEase</div>

      <div style={s.card}>
        <div style={s.cardTitle}>➕ Add New Category</div>
        <div style={s.row}>
          <input
            style={s.input}
            placeholder="Category name (e.g. Electronics)"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            style={s.input}
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button style={s.addBtn} disabled={adding} onClick={handleAdd}>
            {adding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>📂 Existing Categories ({categories.length})</div>
        {loading ? (
          <div style={s.empty}>Loading...</div>
        ) : categories.length === 0 ? (
          <div style={s.empty}>No categories yet — add one above.</div>
        ) : (
          <div style={s.list}>
            {categories.map(c => (
              <div key={c.categoryId} style={s.item}>
                <div>
                  <div style={s.itemName}>{c.categoryName}</div>
                  {c.description && <div style={s.itemDesc}>{c.description}</div>}
                </div>
                <button style={s.delBtn} onClick={() => handleDelete(c.categoryId, c.categoryName)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>📦 All Products ({products.length})</div>
        {productsLoading ? (
          <div style={s.empty}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={s.empty}>No products yet.</div>
        ) : (
          <div style={s.list}>
            {products.map(p => (
              <div key={p.productId} style={s.prodItem}>
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.productName} style={s.thumb} />
                  : <div style={s.thumb} />
                }
                <div style={s.prodInfo}>
                  <div style={s.itemName}>{p.productName}</div>
                  <div style={s.prodMeta}>
                    {p.category?.categoryName || 'Uncategorized'} · Owner: {p.owner?.name || '—'} · {p.status}
                  </div>
                </div>
                <button style={s.delBtn} onClick={() => handleDeleteProduct(p.productId, p.productName)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
