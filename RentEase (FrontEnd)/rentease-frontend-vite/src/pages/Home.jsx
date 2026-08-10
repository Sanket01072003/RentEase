import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategoriesApi, getAvailableProductsApi } from '../services/api';
import ProductCard from '../components/ProductCard.jsx';

const s = {
  hero:      { background:'linear-gradient(135deg,#1a237e 0%,#283593 50%,#3949ab 100%)', color:'white', padding:'80px 24px', textAlign:'center' },
  heroTitle: { fontSize:46, fontWeight:700, marginBottom:16 },
  heroSub:   { fontSize:18, opacity:0.9, marginBottom:32 },
  heroBtn:   { background:'#42a5f5', color:'white', border:'none', padding:'14px 36px', borderRadius:30, fontSize:16, fontWeight:700, cursor:'pointer', marginRight:12 },
  heroBtn2:  { background:'transparent', color:'white', border:'2px solid white', padding:'14px 36px', borderRadius:30, fontSize:16, fontWeight:700, cursor:'pointer' },
  section:   { maxWidth:1200, margin:'0 auto', padding:'48px 24px' },
  sTitle:    { fontSize:28, fontWeight:700, color:'#1a237e', marginBottom:8 },
  sSub:      { fontSize:15, color:'#666', marginBottom:28 },
  cats:      { display:'flex', gap:10, flexWrap:'wrap', marginBottom:36 },
  catBtn:    { padding:'9px 22px', borderRadius:25, border:'2px solid #1a237e', background:'white', color:'#1a237e', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.2s' },
  catActive: { background:'#1a237e', color:'white' },
  grid:      { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:24 },
  viewAll:   { display:'block', margin:'32px auto 0', background:'#1a237e', color:'white', border:'none', padding:'12px 36px', borderRadius:8, fontSize:15, fontWeight:600, cursor:'pointer' },
  features:  { background:'#e3f2fd', padding:'60px 24px' },
  featGrid:  { maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:24 },
  featCard:  { background:'white', borderRadius:12, padding:28, textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
  featIcon:  { fontSize:40, marginBottom:12 },
  featTitle: { fontSize:17, fontWeight:700, color:'#1a237e', marginBottom:8 },
  featDesc:  { fontSize:14, color:'#666', lineHeight:1.5 },
  empty:     { textAlign:'center', padding:'60px 0', color:'#888' },
};

export default function Home() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getAvailableProductsApi(), getAllCategoriesApi()])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data || []);
        setCategories(cRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCat
    ? products.filter(p => p.category?.categoryId === activeCat)
    : products.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroTitle}>🏠 Rent Anything, Anytime</div>
        <div style={s.heroSub}>Find and rent cameras, bikes, tools and more from trusted owners.</div>
        <button style={s.heroBtn} onClick={() => navigate('/products')}>Browse Products</button>
        <button style={s.heroBtn2} onClick={() => navigate('/register')}>List Your Product</button>
      </div>

      {/* Categories + Products */}
      <div style={s.section}>
        <div style={s.sTitle}>Browse by Category</div>
        <div style={s.sSub}>Find exactly what you need</div>
        <div style={s.cats}>
          <button style={{ ...s.catBtn, ...(activeCat === null ? s.catActive : {}) }} onClick={() => setActiveCat(null)}>All</button>
          {categories.map(c => (
            <button key={c.categoryId}
              style={{ ...s.catBtn, ...(activeCat === c.categoryId ? s.catActive : {}) }}
              onClick={() => setActiveCat(c.categoryId)}>
              {c.categoryName}
            </button>
          ))}
        </div>

        <div style={s.sTitle}>Featured Products</div>
        <div style={s.sSub}>Available for rent right now</div>

        {loading
          ? <div style={s.empty}>Loading products...</div>
          : filtered.length === 0
            ? <div style={s.empty}>No products available</div>
            : <div style={s.grid}>{filtered.map(p => <ProductCard key={p.productId} product={p} />)}</div>
        }
        {!activeCat && products.length > 8 && (
          <button style={s.viewAll} onClick={() => navigate('/products')}>View All Products</button>
        )}
      </div>

      {/* Features */}
      <div style={s.features}>
        <div style={s.featGrid}>
          {[
            { icon:'🔒', title:'Secure Payments',  desc:'Pay safely via Razorpay. Deposit refunded on return.' },
            { icon:'📦', title:'Wide Selection',   desc:'Electronics, bikes, tools and more.' },
            { icon:'⭐', title:'Verified Reviews', desc:'Read honest reviews from real renters.' },
            { icon:'🚀', title:'Easy Process',     desc:'Browse, pick dates, pay online and pick up.' },
          ].map(f => (
            <div key={f.title} style={s.featCard}>
              <div style={s.featIcon}>{f.icon}</div>
              <div style={s.featTitle}>{f.title}</div>
              <div style={s.featDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
