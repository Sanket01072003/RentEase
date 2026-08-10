import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { getProductApi, getReviewsByProductApi, createRentalApi, createOrderApi, verifyPaymentApi } from '../services/api';
import { getProductApi, getReviewsByProductApi, createRentalApi, createOrderApi, verifyPaymentApi, cancelRentalApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RAZORPAY_KEY } from '../utils/constants';
import toast from 'react-hot-toast';

const s = {
  page:      { maxWidth:1100, margin:'0 auto', padding:'32px 24px' },
  grid:      { display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, marginBottom:40 },
  imgBox:    { borderRadius:16, overflow:'hidden', background:'linear-gradient(135deg,#1a237e,#42a5f5)', minHeight:320, display:'flex', alignItems:'center', justifyContent:'center', fontSize:80 },
  // img:       { width:'100%', height:360, objectFit:'cover', borderRadius:16 },
  img:       { width:'100%', height:360, objectFit:'contain', backgroundColor:'#f5f5f5', borderRadius:16 },
  name:      { fontSize:28, fontWeight:700, color:'#1a237e', marginBottom:8 },
  cat:       { display:'inline-block', background:'#e3f2fd', color:'#1a237e', padding:'4px 14px', borderRadius:20, fontSize:13, fontWeight:600, marginBottom:12 },
  desc:      { fontSize:15, color:'#555', lineHeight:1.7, marginBottom:16 },
  priceBox:  { background:'#f5f5f5', borderRadius:12, padding:20, marginBottom:16 },
  price:     { fontSize:30, fontWeight:700, color:'#2e7d32' },
  deposit:   { fontSize:14, color:'#888', marginTop:4 },
  badge:     { display:'inline-block', padding:'5px 14px', borderRadius:20, fontSize:13, fontWeight:600, marginBottom:12 },
  AVAILABLE: { background:'#e8f5e9', color:'#2e7d32' },
  RENTED:    { background:'#ffebee', color:'#c62828' },
  UNAVAILABLE:{ background:'#f5f5f5', color:'#888' },
  rentForm:  { background:'#e3f2fd', borderRadius:12, padding:20 },
  formTitle: { fontSize:16, fontWeight:700, color:'#1a237e', marginBottom:12 },
  dateRow:   { display:'flex', gap:12, marginBottom:12 },
  dateBox:   { flex:1 },
  dateLabel: { fontSize:12, fontWeight:600, color:'#444', marginBottom:4, display:'block' },
  dateInput: { width:'100%', padding:'10px 12px', border:'1.5px solid #90caf9', borderRadius:8, fontSize:14, outline:'none' },
  fareBox:   { background:'white', borderRadius:8, padding:14, marginBottom:12 },
  fareRow:   { display:'flex', justifyContent:'space-between', fontSize:14, marginBottom:4, color:'#555' },
  fareTotal: { display:'flex', justifyContent:'space-between', fontWeight:700, fontSize:15, borderTop:'1px solid #ddd', paddingTop:8, marginTop:6 },
  payBtn:    { width:'100%', background:'#2e7d32', color:'white', border:'none', padding:'13px 0', borderRadius:8, fontSize:15, fontWeight:700, cursor:'pointer' },
  loginBtn:  { width:'100%', background:'#1a237e', color:'white', border:'none', padding:'13px 0', borderRadius:8, fontSize:15, fontWeight:700, cursor:'pointer' },
  reviews:   { marginTop:40 },
  revTitle:  { fontSize:22, fontWeight:700, color:'#1a237e', marginBottom:16 },
  revCard:   { background:'white', borderRadius:10, padding:16, marginBottom:12, boxShadow:'0 1px 6px rgba(0,0,0,0.08)' },
  stars:     { color:'#f9a825', fontSize:18, marginBottom:4 },
  revComment:{ fontSize:14, color:'#555' },
  revMeta:   { fontSize:12, color:'#aaa', marginTop:6 },
};

export default function ProductDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user, isLoggedIn, isRenter } = useAuth();

  const [product, setProduct]   = useState(null);
  const [reviews, setReviews]   = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [paying, setPaying]     = useState(false);

  useEffect(() => {
    Promise.all([getProductApi(id), getReviewsByProductApi(id)])
      .then(([pRes, rRes]) => {
        setProduct(pRes.data);
        setReviews(rRes.data || []);
      })
      .catch(() => toast.error('Product not found!'))
      .finally(() => setLoading(false));
  }, [id]);

  const days  = (fromDate && toDate) ? Math.max(0, (new Date(toDate) - new Date(fromDate)) / 86400000) : 0;
  const rent  = days * (product?.pricePerDay || 0);
  const total = rent + (product?.depositAmount || 0);
  const today = new Date().toISOString().split('T')[0];

  const handlePay = async () => {
    if (!fromDate || !toDate) { toast.error('Select rental dates'); return; }
    if (days <= 0) { toast.error('End date must be after start date'); return; }
    setPaying(true);
    try {
      // Step 1 — Create Rental
      const rentalRes = await createRentalApi({
        renterId:  parseInt(user.id),
        productId: product.productId,
        fromDate,
        toDate,
      });
      const rentalId = rentalRes.data?.data?.rentalId;

      // Step 2 — Create Razorpay Order
      const orderRes  = await createOrderApi(rentalId);
      const orderData = orderRes.data;

      // Step 3 — Open Razorpay Checkout
      const options = {
        key:         orderData.keyId || RAZORPAY_KEY,
        amount:      orderData.amount * 100,
        currency:    orderData.currency || 'INR',
        name:        'RentEase',
        description: `Rent: ${product.productName}`,
        order_id:    orderData.razorpayOrderId,
        prefill: {
          name:  orderData.renterName,
          email: orderData.renterMail,
        },
        theme: { color: '#1a237e' },
        handler: async response => {
          try {
            // Step 4 — Verify Payment
            await verifyPaymentApi({
              rentalId,
              razorOrderId:   response.razorpay_order_id,
              razorPaymentId: response.razorpay_payment_id,
              razorSignature: response.razorpay_signature,
              totalAmount:    total,
            });
            toast.success('🎉 Payment successful! Rental confirmed.');
            navigate('/renter/dashboard');
          } catch {
            toast.error('Payment verification failed!');
          } finally {
            setPaying(false);
          }
        },
        // modal: { ondismiss: () => { toast.error('Payment cancelled'); setPaying(false); } },
        modal: {
          ondismiss: async () => {
            toast.error('Payment cancelled');
            try { await cancelRentalApi(rentalId); } catch {}
            setPaying(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate rental!');
      setPaying(false);
    }
  };

  if (loading) return <div style={{ textAlign:'center', padding:80, fontSize:18 }}>Loading...</div>;
  if (!product) return <div style={{ textAlign:'center', padding:80 }}>Product not found</div>;

  const status = product.status || 'AVAILABLE';

  return (
    <div style={s.page}>
      <div style={s.grid}>
        {/* Image */}
        <div>
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.productName} style={s.img} />
            : <div style={s.imgBox}>📦</div>
          }
        </div>

        {/* Info */}
        <div>
          <span style={s.cat}>{product.category?.categoryName || 'Product'}</span>
          <div style={s.name}>{product.productName}</div>
          <span style={{ ...s.badge, ...s[status] }}>{status}</span>
          <div style={s.desc}>{product.description}</div>

          <div style={s.priceBox}>
            <div style={s.price}>₹{product.pricePerDay}<span style={{ fontSize:14, fontWeight:400 }}>/day</span></div>
            <div style={s.deposit}>Refundable Deposit: ₹{product.depositAmount}</div>
          </div>

          {/* Rent Form */}
          {status === 'AVAILABLE' && (
            <div style={s.rentForm}>
              <div style={s.formTitle}>📅 Select Rental Dates</div>
              <div style={s.dateRow}>
                <div style={s.dateBox}>
                  <span style={s.dateLabel}>From Date</span>
                  <input style={s.dateInput} type="date" min={today} value={fromDate} onChange={e => setFromDate(e.target.value)} />
                </div>
                <div style={s.dateBox}>
                  <span style={s.dateLabel}>To Date</span>
                  <input style={s.dateInput} type="date" min={fromDate || today} value={toDate} onChange={e => setToDate(e.target.value)} />
                </div>
              </div>

              {days > 0 && (
                <div style={s.fareBox}>
                  <div style={s.fareRow}><span>Rent ({days} day{days>1?'s':''} × ₹{product.pricePerDay})</span><span>₹{rent}</span></div>
                  <div style={s.fareRow}><span>Refundable Deposit</span><span>₹{product.depositAmount}</span></div>
                  <div style={s.fareTotal}><span>Total Payable</span><span>₹{total}</span></div>
                </div>
              )}

              {isLoggedIn() && isRenter()
                ? <button style={s.payBtn} onClick={handlePay} disabled={paying}>
                    {paying ? 'Processing...' : `💳 Rent & Pay ₹${total || ''}`}
                  </button>
                : <button style={s.loginBtn} onClick={() => navigate('/login')}>Login to Rent</button>
              }
            </div>
          )}

          {status !== 'AVAILABLE' && (
            <div style={{ background:'#ffebee', borderRadius:10, padding:16, textAlign:'center', color:'#c62828', fontWeight:600 }}>
              ❌ This product is currently not available for rent
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div style={s.reviews}>
        <div style={s.revTitle}>⭐ Reviews ({reviews.length})</div>
        {reviews.length === 0
          ? <p style={{ color:'#888' }}>No reviews yet.</p>
          : reviews.map(r => (
            <div key={r.reviewId} style={s.revCard}>
              <div style={s.stars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              <div style={s.revComment}>{r.comment}</div>
              <div style={s.revMeta}>{new Date(r.createdAt).toLocaleDateString()}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
