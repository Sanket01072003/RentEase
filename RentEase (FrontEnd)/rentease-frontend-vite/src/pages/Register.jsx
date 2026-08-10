import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerOwnerApi, registerRenterApi } from '../services/api';
import toast from 'react-hot-toast';

const s = {
  page:  { minHeight:'100vh', background:'linear-gradient(135deg,#e3f2fd,#f5f5f5)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 },
  card:  { background:'white', borderRadius:16, padding:40, width:'100%', maxWidth:460, boxShadow:'0 8px 32px rgba(0,0,0,0.12)' },
  logo:  { textAlign:'center', fontSize:40, marginBottom:8 },
  title: { textAlign:'center', fontSize:24, fontWeight:700, color:'#1a237e', marginBottom:4 },
  sub:   { textAlign:'center', fontSize:14, color:'#888', marginBottom:24 },
  toggle:{ display:'flex', background:'#f0f0f0', borderRadius:10, padding:4, marginBottom:24 },
  tBtn:  { flex:1, padding:'10px 0', borderRadius:8, border:'none', fontSize:14, fontWeight:600, cursor:'pointer', transition:'all 0.2s' },
  label: { display:'block', fontSize:13, fontWeight:600, color:'#444', marginBottom:6, marginTop:14 },
  input: { width:'100%', padding:'12px 14px', border:'1.5px solid #ddd', borderRadius:8, fontSize:15, outline:'none' },
  btn:   { width:'100%', background:'#1a237e', color:'white', border:'none', padding:'13px 0', borderRadius:8, fontSize:16, fontWeight:700, cursor:'pointer', marginTop:20, marginBottom:14 },
  link:  { color:'#1a237e', fontWeight:600 },
};

export default function Register() {
  const [role, setRole]       = useState('RENTER');
  const [form, setForm]       = useState({ name:'', mail:'', password:'', phone:'' });
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.mail || !form.password || !form.phone) { toast.error('Fill all fields'); return; }
    if (form.password.length < 6) { toast.error('Password min 6 chars'); return; }
    setLoading(true);
    try {
      if (role === 'OWNER') await registerOwnerApi(form);
      else                  await registerRenterApi(form);
      toast.success('Registered! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed!');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🏠</div>
        <div style={s.title}>Create Account</div>
        <div style={s.sub}>Join RentEase today</div>
        <div style={s.toggle}>
          <button style={{ ...s.tBtn, background: role==='RENTER'?'#1a237e':'transparent', color: role==='RENTER'?'white':'#666' }} onClick={() => setRole('RENTER')}>🛍️ I want to Rent</button>
          <button style={{ ...s.tBtn, background: role==='OWNER'?'#1a237e':'transparent',  color: role==='OWNER'?'white':'#666'  }} onClick={() => setRole('OWNER')}>🏪 I want to List</button>
        </div>
        <form onSubmit={submit}>
          <label style={s.label}>Full Name</label>
          <input style={s.input} name="name" placeholder="Rajesh Kumar" value={form.name} onChange={handle} />
          <label style={s.label}>Email</label>
          <input style={s.input} name="mail" type="email" placeholder="your@email.com" value={form.mail} onChange={handle} />
          <label style={s.label}>Phone</label>
          <input style={s.input} name="phone" placeholder="9876543210" value={form.phone} onChange={handle} />
          <label style={s.label}>Password</label>
          <input style={s.input} name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handle} />
          <button style={s.btn} disabled={loading}>{loading ? 'Registering...' : `Register as ${role==='OWNER'?'Owner':'Renter'}`}</button>
        </form>
        <div style={{ textAlign:'center', fontSize:13, color:'#666' }}>Already have an account? <Link to="/login" style={s.link}>Login</Link></div>
      </div>
    </div>
  );
}
