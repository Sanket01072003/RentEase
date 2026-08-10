import React from 'react';

const s = {
  footer: { background:'#1a237e', color:'white', padding:'32px 24px 20px', marginTop:60 },
  container: { maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:28 },
  col: { display:'flex', flexDirection:'column', gap:8 },
  title: { fontSize:18, fontWeight:700, marginBottom:8 },
  desc: { fontSize:13, color:'#90caf9', lineHeight:1.6 },
  heading: { fontSize:14, fontWeight:700, marginBottom:8, color:'#e3f2fd' },
  link: { fontSize:13, color:'#90caf9', marginBottom:6, cursor:'pointer' },
  bottom: { borderTop:'1px solid #3949ab', marginTop:28, paddingTop:16, textAlign:'center', fontSize:12, color:'#90caf9' },
  badges: { display:'flex', gap:8, justifyContent:'center', marginTop:10, flexWrap:'wrap' },
  badge: { background:'#283593', padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:600 },
};

export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.container}>
        <div style={s.col}>
          <div style={s.title}>🏠 RentEase</div>
          <div style={s.desc}>
            A product rental platform where Owners list items and Renters
            book them online with secure Razorpay payments and automatic
            deposit refunds.
          </div>
        </div>

        <div style={s.col}>
          <div style={s.heading}>Quick Links</div>
          <span style={s.link}>Browse Products</span>
          <span style={s.link}>Register as Owner</span>
          <span style={s.link}>Register as Renter</span>
          <span style={s.link}>How It Works</span>
        </div>

        <div style={s.col}>
          <div style={s.heading}>Support</div>
          <span style={s.link}>Contact Us</span>
          <span style={s.link}>Forgot Password</span>
          <span style={s.link}>Terms & Conditions</span>
          <span style={s.link}>Privacy Policy</span>
        </div>

        <div style={s.col}>
          <div style={s.heading}>Project Info</div>
          <span style={s.link}>CDAC PGCP-AC</span>
          <span style={s.link}>Spring Boot Microservices</span>
          <span style={s.link}>React + Vite</span>
        </div>
      </div>

      <div style={s.bottom}>
        © {new Date().getFullYear()} RentEase — Built as a CDAC PGCP-AC Project
        <div style={s.badges}>
          <span style={s.badge}>React</span>
          <span style={s.badge}>Spring Boot</span>
          <span style={s.badge}>MySQL</span>
          <span style={s.badge}>Razorpay</span>
          <span style={s.badge}>JWT Security</span>
          <span style={s.badge}>.NET Microservice</span>
        </div>
      </div>
    </footer>
  );
}
