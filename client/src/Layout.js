import React, { useState } from 'react';
import { BRAND } from './constants';
import { Icon, Avatar, RealityLogo, DotBorder } from './components';
import { useStore } from './store';

const NAV = {
  student: [
    { key: 'dashboard', icon: 'home', label: 'Dashboard' },
    { key: 'my-courses', icon: 'book', label: 'My Courses' },
    { key: 'browse', icon: 'search', label: 'Browse Courses' },
    { key: 'assignments', icon: 'clipboard', label: 'Assignments' },
    { key: 'chat', icon: 'chat', label: 'Messages' },
    { key: 'payments', icon: 'pay', label: 'Payments' },
    { key: 'certificates', icon: 'award', label: 'Certificates' },
  ],
  instructor: [
    { key: 'dashboard', icon: 'home', label: 'Dashboard' },
    { key: 'courses', icon: 'book', label: 'My Courses' },
    { key: 'students', icon: 'users', label: 'Students' },
    { key: 'assignments', icon: 'clipboard', label: 'Assignments' },
    { key: 'attendance', icon: 'calendar', label: 'Attendance' },
    { key: 'resources', icon: 'file', label: 'Resources' },
    { key: 'chat', icon: 'chat', label: 'Messages' },
    { key: 'earnings', icon: 'dollar', label: 'Earnings' },
    { key: 'reports', icon: 'report', label: 'Reports' },
  ],
  admin: [
    { key: 'dashboard', icon: 'home', label: 'Dashboard' },
    { key: 'students', icon: 'users', label: 'Students' },
    { key: 'instructors', icon: 'grad', label: 'Instructors' },
    { key: 'courses', icon: 'book', label: 'Courses' },
    { key: 'payments', icon: 'pay', label: 'Payments' },
    { key: 'reports', icon: 'chart', label: 'Reports' },
    { key: 'settings', icon: 'settings', label: 'Settings' },
  ],
};

export function Sidebar({ active, onNavigate, collapsed, onToggle }) {
  const { currentUser, logout, notifications } = useStore();
  const role = currentUser?.role || 'student';
  const items = NAV[role] || [];
  const unreadMsgs = (notifications || []).filter(n => !n.read).length;
  const roleColors = { student: BRAND.blue, instructor: BRAND.purple, admin: BRAND.red };
  const roleColor = roleColors[role] || BRAND.blue;

  return (
    <aside style={{ width: collapsed ? 64 : 238, minHeight: '100vh', background: '#fff', borderRight: `1px solid ${BRAND.gray200}`, display: 'flex', flexDirection: 'column', transition: 'width 0.22s ease', flexShrink: 0, position: 'relative', zIndex: 100 }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '18px 12px' : '22px 18px', borderBottom: `1px solid ${BRAND.gray100}`, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        {collapsed ? (
          <div style={{ width: 34, height: 34, borderRadius: 8, background: BRAND.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 17, fontFamily: 'Poppins,sans-serif' }}>R</span>
          </div>
        ) : (
          <RealityLogo scale={0.72} />
        )}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div style={{ margin: '10px 14px 0', padding: '6px 12px', background: `${roleColor}12`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: roleColor }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: roleColor, textTransform: 'capitalize' }}>{role} Portal</span>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {items.map(item => (
            <button key={item.key}
              className={`nav-item ${active === item.key ? 'active' : ''}`}
              onClick={() => onNavigate(item.key)}
              title={collapsed ? item.label : ''}
              style={{ justifyContent: collapsed ? 'center' : 'flex-start', paddingLeft: collapsed ? 0 : 14, position: 'relative' }}>
              <Icon name={item.icon} size={17} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.key === 'chat' && unreadMsgs > 0 && (
                <span style={{ marginLeft: 'auto', background: BRAND.red, color: '#fff', borderRadius: 100, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>{unreadMsgs}</span>
              )}
              {collapsed && item.key === 'chat' && unreadMsgs > 0 && (
                <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, background: BRAND.red, borderRadius: '50%' }} />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* User info */}
      <div style={{ padding: '12px 10px', borderTop: `1px solid ${BRAND.gray100}` }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8, padding: '8px 10px', background: BRAND.gray50, borderRadius: 10 }}>
            <Avatar name={currentUser?.name} size={32} bg={roleColor} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser?.name}</div>
              <div style={{ fontSize: 10, color: BRAND.gray400, textTransform: 'capitalize' }}>{currentUser?.email}</div>
            </div>
          </div>
        )}
        <button className="nav-item" onClick={logout} style={{ justifyContent: collapsed ? 'center' : 'flex-start', color: BRAND.red }} title={collapsed ? 'Sign Out' : ''}>
          <Icon name="logout" size={16} color={BRAND.red} />
          {!collapsed && <span style={{ color: BRAND.red }}>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={onToggle} style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, borderRadius: '50%', background: '#fff', border: `1.5px solid ${BRAND.gray200}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', zIndex: 10 }}>
        <Icon name={collapsed ? 'chevRight' : 'back'} size={11} color={BRAND.gray400} />
      </button>
    </aside>
  );
}

export function TopBar({ title, subtitle }) {
  const { notifications, readNotifications } = useStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = (notifications || []).filter(n => !n.read).length;

  const typeColors = { assignment: BRAND.blue, enrollment: BRAND.green, payment: BRAND.orange, resource: BRAND.purple, attendance: BRAND.red };
  const typeIcons = { assignment: 'clipboard', enrollment: 'grad', payment: 'pay', resource: 'file', attendance: 'calendar' };

  return (
    <div style={{ background: '#fff', borderBottom: `1px solid ${BRAND.gray200}`, padding: '0 24px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, flexShrink: 0 }}>
      <div>
        <h1 style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 11, color: BRAND.gray400, marginTop: 1 }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        <button className="btn btn-ghost btn-icon" style={{ position: 'relative' }}
          onClick={() => { setShowNotifs(v => !v); if (!showNotifs) readNotifications(); }}>
          <Icon name="bell" size={18} />
          {unread > 0 && <span className="notif-dot" />}
        </button>

        {showNotifs && (
          <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 310, background: '#fff', borderRadius: 14, border: `1px solid ${BRAND.gray200}`, boxShadow: '0 8px 32px rgba(0,0,0,0.14)', zIndex: 300, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BRAND.gray100}`, fontWeight: 700, fontSize: 13, display: 'flex', justifyContent: 'space-between' }}>
              <span>Notifications</span>
              {unread > 0 && <span style={{ fontSize: 11, color: BRAND.blue }}>{unread} new</span>}
            </div>
            <div style={{ maxHeight: 340, overflowY: 'auto' }}>
              {(notifications || []).map(n => (
                <div key={n.id} style={{ padding: '11px 16px', borderBottom: `1px solid ${BRAND.gray50}`, display: 'flex', gap: 10, alignItems: 'flex-start', background: n.read ? '#fff' : BRAND.blueBg }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `${typeColors[n.type] || BRAND.blue}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={typeIcons[n.type] || 'bell'} size={14} color={typeColors[n.type] || BRAND.blue} />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, lineHeight: 1.4 }}>{n.text}</p>
                    <p style={{ fontSize: 10, color: BRAND.gray400, marginTop: 2 }}>{n.time}</p>
                  </div>
                </div>
              ))}
              {!notifications?.length && <div style={{ padding: 24, textAlign: 'center', color: BRAND.gray400, fontSize: 13 }}>No notifications</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AppLayout({ active, onNavigate, title, subtitle, children }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: BRAND.gray50 }}>
      <Sidebar active={active} onNavigate={onNavigate} collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar title={title} subtitle={subtitle} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
