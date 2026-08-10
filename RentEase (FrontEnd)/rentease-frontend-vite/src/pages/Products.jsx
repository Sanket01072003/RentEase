import React, { useEffect, useState } from 'react';
import { getAllProductsApi, getAllCategoriesApi, getProductsByCategoryApi } from '../services/api';
import ProductCard from '../components/ProductCard.jsx';

const s = {
  page:   { maxWidth:1200, margin:'0 auto', padding:'32px 24px' },
  title:  { fontSize:30, fontWeight:700, color:'#1a237e', marginBottom:6 },
  sub:    { fontSize:15, color:'#666', marginBottom:24 },
  filters:{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:24, alignItems:'center' },
  search: { flex:1, minWidth:200, padding:'10px 16px', border:'1.5px solid #ddd', borderRadius:25, fontSize:14, outline:'none' },
  catBtn: { padding:'9px 20px', borderRadius:20, border:'1.5px solid #1a237e', background:'white', color:'#1a237e', fontSize:13, fontWeight:600, cursor:'pointer' },
  active: { background:'#1a237e', color:'white' },
  count:  { fontSize:14, color:'#888', marginBottom:16 },
  grid:   { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:24 },
  empty:  { textAlign:'center', padding:'60px 0', color:'#888', fontSize:16 },
};

export default function Products() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat]   = useState(null);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getAllCategoriesApi().then(r => setCategories(r.data || [])).catch(() => {});
    getAllProductsApi().then(r => setProducts(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCategory = async catId => {
    setActiveCat(catId);
    setLoading(true);
    try {
      const res = catId ? await getProductsByCategoryApi(catId) : await getAllProductsApi();
      setProducts(res.data || []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  const filtered = products.filter(p =>
    p.productName?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={s.page}>
      <div style={s.title}>All Products</div>
      <div style={s.sub}>Browse products available for rent</div>

      <div style={s.filters}>
        <input style={s.search} placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        <button style={{ ...s.catBtn, ...(activeCat === null ? s.active : {}) }} onClick={() => handleCategory(null)}>All</button>
        {categories.map(c => (
          <button key={c.categoryId}
            style={{ ...s.catBtn, ...(activeCat === c.categoryId ? s.active : {}) }}
            onClick={() => handleCategory(c.categoryId)}>
            {c.categoryName}
          </button>
        ))}
      </div>

      <div style={s.count}>{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</div>

      {loading
        ? <div style={s.empty}>Loading...</div>
        : filtered.length === 0
          ? <div style={s.empty}>😔 No products found</div>
          : <div style={s.grid}>{filtered.map(p => <ProductCard key={p.productId} product={p} />)}</div>
      }
    </div>
  );
}
