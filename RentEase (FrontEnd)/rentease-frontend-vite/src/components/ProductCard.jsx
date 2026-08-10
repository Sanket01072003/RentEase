import React from 'react';
import { useNavigate } from 'react-router-dom';

const s = {
  card: { background:'white', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.1)', transition:'transform 0.2s', cursor:'pointer' },
  img: { width:'100%', height:180, objectFit:'cover' },
  placeholder: { width:'100%', height:180, background:'linear-gradient(135deg,#1a237e,#42a5f5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:56 },
  body: { padding:16 },
  name: { fontSize:16, fontWeight:700, color:'#1a237e', marginBottom:6 },
  desc: { fontSize:13, color:'#666', marginBottom:10, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  row: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 },
  price: { fontSize:18, fontWeight:700, color:'#2e7d32' },
  deposit: { fontSize:12, color:'#888' },
  badge: { fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:600 },
  AVAILABLE: { background:'#e8f5e9', color:'#2e7d32' },
  RENTED: { background:'#ffebee', color:'#c62828' },
  UNAVAILABLE: { background:'#f5f5f5', color:'#888' },
  btn: { width:'100%', background:'#1a237e', color:'white', border:'none', padding:'10px 0', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', marginTop:8 },
};

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const status = product.status || 'AVAILABLE';

  return (
    <div style={s.card}
      onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform='none'}
    >
      {product.imageUrl
        ? <img src={product.imageUrl} alt={product.productName} style={s.img} onError={e => e.target.style.display='none'} />
        : <div style={s.placeholder}>📦</div>
      }
      <div style={s.body}>
        <div style={s.name}>{product.productName}</div>
        <div style={s.desc}>{product.description}</div>
        <div style={s.row}>
          <span style={s.price}>₹{product.pricePerDay}<span style={{fontSize:12,fontWeight:400}}>/day</span></span>
          <span style={{...s.badge, ...s[status]}}>{status}</span>
        </div>
        <div style={s.deposit}>Deposit: ₹{product.depositAmount}</div>
        <button style={s.btn} onClick={() => navigate(`/products/${product.productId}`)}>View Details</button>
      </div>
    </div>
  );
}
