import React, { useState, useEffect, useRef } from 'react';
import { BRAND } from './constants';

// ============================================================
// ICON COMPONENT
// ============================================================
export function Icon({ name, size = 18, color = 'currentColor', style = {} }) {
  const paths = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
    pay: <><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.4 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    play: <polygon points="5 3 19 12 5 21 5 3"/>,
    check: <polyline points="20 6 9 17 4 12"/>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    file: <><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></>,
    video: <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    award: <><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    clipboard: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></>,
    alert: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    menu: <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    chevRight: <polyline points="9 18 15 12 9 6"/>,
    chevDown: <polyline points="6 9 12 15 18 9"/>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    dollar: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    grad: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
    back: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    report: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths[name] || null}
    </svg>
  );
}

// ============================================================
// AVATAR
// ============================================================
export function Avatar({ name = '?', size = 38, bg = BRAND.blue }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg, ${bg}, ${bg}bb)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: size * 0.37, fontFamily: 'Poppins, sans-serif', flexShrink: 0, letterSpacing: '-0.5px' }}>
      {initials}
    </div>
  );
}

// ============================================================
// REALITY ACADEMY LOGO
// ============================================================
export function RealityLogo({ scale = 1, white = false }) {
  const c = white ? '#fff' : BRAND.blue;
  const rc = white ? 'rgba(255,255,255,0.9)' : BRAND.red;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', lineHeight: 1 }}>
        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11 * scale, fontWeight: 700, color: c, marginBottom: 3 * scale, marginRight: 5 * scale, alignSelf: 'flex-start', marginTop: 4 * scale, letterSpacing: '0.04em' }}>The</span>
        <div style={{ position: 'relative' }}>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 34 * scale, fontWeight: 900, color: c, letterSpacing: '-0.03em', lineHeight: 1 }}>Reality</span>
          <span style={{ position: 'absolute', top: 2 * scale, left: 63 * scale, width: 7 * scale, height: 7 * scale, borderRadius: '50%', background: rc }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 7 * scale, paddingLeft: 2 * scale, marginTop: -3 * scale }}>
        {'Academy'.split('').map((ch, i) => (
          <span key={i} style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11 * scale, fontWeight: 600, color: c, letterSpacing: '0.1em' }}>{ch}</span>
        ))}
      </div>
    </div>
  );
}

// Brand manual dot/triangle border pattern
export function DotBorder({ color = BRAND.blue, redColor = BRAND.red, opacity = 0.5 }) {
  const pattern = ['circle', 'triangle', 'circle-gray', 'triangle', 'circle'];
  return (
    <div style={{ height: 10, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 3, opacity, padding: '0 4px' }}>
      {Array.from({ length: 60 }).map((_, i) => {
        const t = i % 5;
        if (t === 0 || t === 2) return <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: t === 2 ? '#aaa' : color, flexShrink: 0 }} />;
        if (t === 1 || t === 3) return <div key={i} style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderBottom: `7px solid ${t === 1 ? color : redColor}`, flexShrink: 0 }} />;
        return <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#888', flexShrink: 0 }} />;
      })}
    </div>
  );
}

// ============================================================
// MODAL
// ============================================================
export function Modal({ open, onClose, title, children, width = 520 }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: width }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${BRAND.gray200}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 1, borderRadius: '18px 18px 0 0' }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>{title}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><Icon name="x" size={17} /></button>
        </div>
        <div style={{ padding: '22px 24px' }}>{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// FORM FIELD
// ============================================================
export function FormField({ label, required, children, hint }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label className="label">{label}{required && <span style={{ color: BRAND.red }}> *</span>}</label>}
      {children}
      {hint && <p style={{ fontSize: 11, color: BRAND.gray400, marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================
export function StatCard({ icon, label, value, sub, color = BRAND.blue, trend, onClick }) {
  return (
    <div className="card" style={{ padding: '18px 22px', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={20} color={color} />
        </div>
        {trend && <span style={{ fontSize: 11, fontWeight: 700, color: BRAND.green, background: BRAND.greenBg, padding: '2px 8px', borderRadius: 100 }}>↑ {trend}</span>}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: BRAND.black, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: BRAND.gray500, marginTop: 3 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: BRAND.gray400, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

// ============================================================
// PROGRESS BAR
// ============================================================
export function Progress({ value = 0, color, height = 8 }) {
  const bg = color === 'red' ? `linear-gradient(90deg,${BRAND.red},#ff6666)` : color === 'green' ? `linear-gradient(90deg,${BRAND.green},#4ade80)` : `linear-gradient(90deg,${BRAND.blue},${BRAND.blueLight})`;
  return (
    <div style={{ height, background: BRAND.gray200, borderRadius: 100, overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ height: '100%', width: `${Math.min(100, Math.max(0, value))}%`, background: bg, borderRadius: 100, transition: 'width 0.5s ease' }} />
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================
export function EmptyState({ icon, title, message, action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: BRAND.gray400 }}>
      <Icon name={icon || 'file'} size={52} color={BRAND.gray200} />
      <h3 style={{ marginTop: 16, fontSize: 16, fontWeight: 700, color: BRAND.gray500 }}>{title}</h3>
      {message && <p style={{ marginTop: 6, fontSize: 13, textAlign: 'center' }}>{message}</p>}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}

// ============================================================
// CONFIRM DIALOG
// ============================================================
export function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = false }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '24px 24px 20px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: danger ? BRAND.redLight : BRAND.blueBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Icon name="alert" size={22} color={danger ? BRAND.red : BRAND.blue} />
          </div>
          <h3 style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
          <p style={{ textAlign: 'center', fontSize: 13, color: BRAND.gray500, marginBottom: 24 }}>{message}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onCancel}>Cancel</button>
            <button className={`btn ${danger ? 'btn-red' : 'btn-primary'}`} style={{ flex: 1, justifyContent: 'center' }} onClick={onConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}
