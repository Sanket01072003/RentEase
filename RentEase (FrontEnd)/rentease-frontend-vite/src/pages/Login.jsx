import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const s = {
  page:  { minHeight:'100vh', background:'linear-gradient(135deg,#e3f2fd,#f5f5f5)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 },
  card:  { background:'white', borderRadius:16, padding:40, width:'100%', maxWidth:420, boxShadow:'0 8px 32px rgba(0,0,0,0.12)' },
  logo:  { textAlign:'center', fontSize:40, marginBottom:8 },
  title: { textAlign:'center', fontSize:24, fontWeight:700, color:'#1a237e', marginBottom:4 },
  sub:   { textAlign:'center', fontSize:14, color:'#888', marginBottom:28 },
  label: { display:'block', fontSize:13, fontWeight:600, color:'#444', marginBottom:6 },
  input: { width:'100%', padding:'12px 14px', border:'1.5px solid #ddd', borderRadius:8, fontSize:15, outline:'none', marginBottom:18 },
  btn:   { width:'100%', background:'#1a237e', color:'white', border:'none', padding:'13px 0', borderRadius:8, fontSize:16, fontWeight:700, cursor:'pointer', marginBottom:14 },
  link:  { color:'#1a237e', fontWeight:600 },
};

export default function Login() {
  const [form, setForm]       = useState({ mail:'', password:'' });
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (!form.mail || !form.password) { toast.error('Fill all fields'); return; }
    setLoading(true);
    try {
      const res   = await loginApi(form);
      const token = res.data?.data;
      if (!token) throw new Error('No token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role    = payload.role;
      const id      = payload.id;
      const name    = payload.sub.split('@')[0];
      login(token, role, id, name);
      toast.success('Logged in!');
      if (role === 'OWNER')       navigate('/owner/dashboard');
      else if (role === 'ADMIN')  navigate('/admin/dashboard');
      else                        navigate('/renter/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed!');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🏠</div>
        <div style={s.title}>Welcome Back</div>
        <div style={s.sub}>Login to your RentEase account</div>
        <form onSubmit={submit}>
          <label style={s.label}>Email</label>
          <input style={s.input} name="mail" type="email" placeholder="your@email.com" value={form.mail} onChange={handle} />
          <label style={s.label}>Password</label>
          <input style={s.input} name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} />
          <button style={s.btn} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <div style={{ textAlign:'center', fontSize:13, marginBottom:10 }}>
          <Link to="/forgot-password" style={s.link}>Forgot Password?</Link>
        </div>
        <div style={{ textAlign:'center', fontSize:13, color:'#666' }}>
          No account? <Link to="/register" style={s.link}>Register</Link>
        </div>
      </div>
    </div>
  );
}
