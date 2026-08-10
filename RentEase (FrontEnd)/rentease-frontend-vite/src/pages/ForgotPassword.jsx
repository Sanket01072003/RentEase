import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPasswordApi, resetPasswordApi } from '../services/api';
import toast from 'react-hot-toast';

const s = {
  page:  { minHeight:'100vh', background:'linear-gradient(135deg,#e3f2fd,#f5f5f5)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 },
  card:  { background:'white', borderRadius:16, padding:40, width:'100%', maxWidth:420, boxShadow:'0 8px 32px rgba(0,0,0,0.12)' },
  logo:  { textAlign:'center', fontSize:40, marginBottom:8 },
  title: { textAlign:'center', fontSize:24, fontWeight:700, color:'#1a237e', marginBottom:4 },
  sub:   { textAlign:'center', fontSize:14, color:'#888', marginBottom:28 },
  label: { display:'block', fontSize:13, fontWeight:600, color:'#444', marginBottom:6 },
  input: { width:'100%', padding:'12px 14px', border:'1.5px solid #ddd', borderRadius:8, fontSize:15, outline:'none', marginBottom:18 },
  btn:   { width:'100%', background:'#1a237e', color:'white', border:'none', padding:'13px 0', borderRadius:8, fontSize:16, fontWeight:700, cursor:'pointer', marginBottom:10 },
  btn2:  { width:'100%', background:'#666', color:'white', border:'none', padding:'11px 0', borderRadius:8, fontSize:14, cursor:'pointer', marginBottom:14 },
  info:  { background:'#e3f2fd', borderRadius:8, padding:12, marginBottom:18, fontSize:13, color:'#1a237e', textAlign:'center' },
  link:  { color:'#1a237e', fontWeight:600 },
};

export default function ForgotPassword() {
  const [step, setStep]      = useState(1);
  const [mail, setMail]      = useState('');
  const [otp, setOtp]        = useState('');
  const [newPass, setNewPass] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate             = useNavigate();

  const sendOtp = async e => {
    e.preventDefault();
    if (!mail) { toast.error('Enter email'); return; }
    setLoading(true);
    try {
      await forgotPasswordApi({ mail });
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP!');
    } finally { setLoading(false); }
  };

  const resetPass = async e => {
    e.preventDefault();
    if (!otp || !newPass) { toast.error('Fill all fields'); return; }
    if (newPass.length < 6) { toast.error('Password min 6 chars'); return; }
    setLoading(true);
    try {
      await resetPasswordApi({ mail, otp, newPassword: newPass });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed!');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🔐</div>
        <div style={s.title}>Forgot Password</div>
        <div style={s.sub}>{step === 1 ? 'Enter email to receive OTP' : 'Enter OTP & new password'}</div>

        {step === 1 ? (
          <form onSubmit={sendOtp}>
            <label style={s.label}>Email Address</label>
            <input style={s.input} type="email" placeholder="your@email.com" value={mail} onChange={e => setMail(e.target.value)} />
            <button style={s.btn} disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
          </form>
        ) : (
          <form onSubmit={resetPass}>
            <div style={s.info}>📧 OTP sent to {mail}</div>
            <label style={s.label}>Enter OTP</label>
            <input style={s.input} placeholder="6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} />
            <label style={s.label}>New Password</label>
            <input style={s.input} type="password" placeholder="Min 6 characters" value={newPass} onChange={e => setNewPass(e.target.value)} />
            <button style={s.btn} disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
            <button type="button" style={s.btn2} onClick={() => setStep(1)}>← Resend OTP</button>
          </form>
        )}
        <div style={{ textAlign:'center', fontSize:13 }}>
          <Link to="/login" style={s.link}>← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
