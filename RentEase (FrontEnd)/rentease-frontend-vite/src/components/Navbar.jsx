import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const s = {
  nav: { background:'#1a237e', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:64, boxShadow:'0 2px 8px rgba(0,0,0,0.3)', position:'sticky', top:0, zIndex:100 },
  logo: { color:'white', fontSize:22, fontWeight:700, letterSpacing:1 },
  links: { display:'flex', alignItems:'center', gap:16 },
  link: { color:'#90caf9', fontSize:14, fontWeight:500, padding:'6px 12px', borderRadius:6, transition:'all 0.2s' },
  logoutBtn: { background:'#ef5350', color:'white', border:'none', padding:'8px 18px', borderRadius:8, fontSize:14, fontWeight:600 },
  name: { color:'#a5d6a7', fontSize:14, fontWeight:600 },
};

export default function Navbar() {
  const { user, logout, isLoggedIn, isOwner, isRenter, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/');
  };

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.logo}>🏠 RentEase</Link>
      <div style={s.links}>
        <Link to="/products" style={s.link}>Products</Link>

        {!isLoggedIn() && <>
          <Link to="/login"    style={s.link}>Login</Link>
          <Link to="/register" style={s.link}>Register</Link>
        </>}

        {isLoggedIn() && isOwner() && <>
          <Link to="/owner/dashboard"   style={s.link}>Dashboard</Link>
          <Link to="/owner/add-product" style={s.link}>Add Product</Link>
        </>}

        {isLoggedIn() && isRenter() &&
          <Link to="/renter/dashboard" style={s.link}>Dashboard</Link>
        }

        {isLoggedIn() && isAdmin() &&
          <Link to="/admin/dashboard" style={s.link}>Admin Dashboard</Link>
        }

        {isLoggedIn() && <>
          <span style={s.name}>Hi, {user.name}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
        </>}
      </div>
    </nav>
  );
}
