import React from 'react'

export default function Navbar() {
  return (
    <header style={{ position: 'fixed', inset: 0, top: 0, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', background: '#ffffff', borderBottom: '1px solid #e5e7eb', zIndex: 50 }}>
      <div style={{ fontWeight: 700, color: '#111827' }}>AUTOMATA</div>
      <div style={{ color: '#111827', fontSize: 13 }}>Automata Theory · III-CCSAD</div>
    </header>
  )
}
