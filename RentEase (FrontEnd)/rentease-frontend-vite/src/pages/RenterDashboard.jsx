import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRentalsByRenterApi, cancelRentalApi, addReviewApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const s = {
  page:      { maxWidth:1100, margin:'0 auto', padding:'32px 24px' },
  header:    { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 },
  title:     { fontSize:28, fontWeight:700, color:'#1a237e' },
  sub:       { fontSize:14, color:'#888', marginTop:4 },
  addBtn:    { background:'#1a237e', color:'white', border:'none', padding:'10px 22px', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer' },
  statsRow:  { display:'flex', gap:16, marginBottom:28, flexWrap:'wrap' },
  statCard:  { background:'white', borderRadius:10, padding:'16px 24px', flex:1, minWidth:120, boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
  statNum:   { fontSize:28, fontWeight:700, color:'#1a237e' },
  statLabel: { fontSize:13, color:'#888', marginTop:4 },
  tabs:      { display:'flex', gap:8, marginBottom:24 },
  tab:       { padding:'10px 24px', borderRadius:8, border:'1.5px solid #ddd', background:'white', color:'#666', fontSize:14, fontWeight:600, cursor:'pointer' },
  tabActive: { background:'#1a237e', color:'white', border:'1.5px solid #1a237e' },
  card:      { background:'white', borderRadius:12, padding:20, marginBottom:14, boxShadow:'0 2px 10px rgba(0,0,0,0.08)', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 },
  pName:     { fontSize:17, fontWeight:700, color:'#1a237e', marginBottom:4 },
  detail:    { fontSize:13, color:'#666', marginBottom:3 },
  badge:     { display:'inline-block', padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:600 },
  ACTIVE:    { background:'#e8f5e9', color:'#2e7d32' },
  RETURNED:  { background:'#e3f2fd', color:'#1a237e' },
  CANCELLED: { background:'#ffebee', color:'#c62828' },
  actions:   { display:'flex', gap:8, flexWrap:'wrap' },
  cancelBtn: { background:'#ffebee', color:'#c62828', border:'1px solid #ef9a9a', padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' },
  reviewBtn: { background:'#e8f5e9', color:'#2e7d32', border:'1px solid #a5d6a7', padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' },
  empty:     { textAlign:'center', padding:'48px 0', color:'#aaa', fontSize:15 },
  overlay:   { position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 },
  modal:     { background:'white', borderRadius:16, padding:32, width:'90%', maxWidth:420 },
  mTitle:    { fontSize:20, fontWeight:700, color:'#1a237e', marginBottom:16 },
  stars:     { display:'flex', gap:8, marginBottom:16 },
  star:      { fontSize:34, cursor:'pointer', transition:'transform 0.1s' },
  textarea:  { width:'100%', padding:12, border:'1.5px solid #ddd', borderRadius:8, fontSize:14, height:100, resize:'vertical', outline:'none', marginBottom:16 },
  submitBtn: { width:'100%', background:'#1a237e', color:'white', border:'none', padding:'12px 0', borderRadius:8, fontSize:15, fontWeight:700, cursor:'pointer' },
  closeBtn:  { width:'100%', background:'#f5f5f5', color:'#666', border:'none', padding:'10px 0', borderRadius:8, fontSize:14, cursor:'pointer', marginTop:8 },
};

const TABS = ['ACTIVE', 'RETURNED', 'CANCELLED'];

export default function RenterDashboard() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [rentals, setRentals]         = useState([]);
  const [activeTab, setActiveTab]     = useState('ACTIVE');
  const [loading, setLoading]         = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [rating, setRating]           = useState(5);
  const [comment, setComment]         = useState('');
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    getRentalsByRenterApi(user.id)
      .then(r => setRentals(r.data || []))
      .catch(() => toast.error('Failed to load rentals'))
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = rentals.filter(r => r.status === activeTab);

  const handleCancel = async rentalId => {
    if (!window.confirm('Cancel this rental?')) return;
    try {
      await cancelRentalApi(rentalId);
      toast.success('Rental cancelled!');
      setRentals(prev => prev.map(r => r.rentalId === rentalId ? { ...r, status: 'CANCELLED' } : r));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed!');
    }
  };

  const submitReview = async () => {
    if (!comment.trim()) { toast.error('Write a comment'); return; }
    setSubmitting(true);
    try {
      await addReviewApi({
        renterId:  parseInt(user.id),
        productId: reviewModal.product?.productId,
        rentalId:  reviewModal.rentalId,
        rating,
        comment,
      });
      toast.success('Review submitted!');
      setReviewModal(null);
      setComment('');
      setRating(5);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review!');
    } finally { setSubmitting(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.title}>My Dashboard</div>
          <div style={s.sub}>Welcome back, {user?.name}</div>
        </div>
        <button style={s.addBtn} onClick={() => navigate('/products')}>+ Rent More</button>
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        {TABS.map(t => (
          <div key={t} style={s.statCard}>
            <div style={s.statNum}>{rentals.filter(r => r.status === t).length}</div>
            <div style={s.statLabel}>{t}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {TABS.map(t => (
          <button key={t}
            style={{ ...s.tab, ...(activeTab === t ? s.tabActive : {}) }}
            onClick={() => setActiveTab(t)}>
            {t} ({rentals.filter(r => r.status === t).length})
          </button>
        ))}
      </div>

      {/* Rental Cards */}
      {loading
        ? <div style={s.empty}>Loading...</div>
        : filtered.length === 0
          ? <div style={s.empty}>No {activeTab.toLowerCase()} rentals</div>
          : filtered.map(r => (
            <div key={r.rentalId} style={s.card}>
              <div>
                <div style={s.pName}>{r.product?.productName || 'Product'}</div>
                <div style={s.detail}>📅 {r.fromDate} → {r.toDate}</div>
                <div style={s.detail}>💰 Rent: ₹{r.totalRent} | Deposit: ₹{r.depositAmount}</div>
                <div style={s.detail}>🏷️ Rental ID: #{r.rentalId}</div>
                <span style={{ ...s.badge, ...s[r.status] }}>{r.status}</span>
              </div>
              <div style={s.actions}>
                {r.status === 'ACTIVE' && (
                  <button style={s.cancelBtn} onClick={() => handleCancel(r.rentalId)}>❌ Cancel</button>
                )}
                {r.status === 'RETURNED' && (
                  <button style={s.reviewBtn} onClick={() => { setReviewModal(r); setRating(5); setComment(''); }}>⭐ Review</button>
                )}
              </div>
            </div>
          ))
      }

      {/* Review Modal */}
      {reviewModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.mTitle}>Rate: {reviewModal.product?.productName}</div>
            <div style={s.stars}>
              {[1,2,3,4,5].map(n => (
                <span key={n} style={s.star}
                  onMouseEnter={e => e.target.style.transform='scale(1.2)'}
                  onMouseLeave={e => e.target.style.transform='scale(1)'}
                  onClick={() => setRating(n)}>
                  {n <= rating ? '★' : '☆'}
                </span>
              ))}
            </div>
            <textarea style={s.textarea} placeholder="Share your experience..." value={comment} onChange={e => setComment(e.target.value)} />
            <button style={s.submitBtn} onClick={submitReview} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button style={s.closeBtn} onClick={() => setReviewModal(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
