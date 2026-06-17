import React, { useState, useEffect, useRef } from 'react';
import { BRAND } from './constants';
import { Avatar, Icon, EmptyState } from './components';
import { useStore } from './store';

export default function ChatView() {
  const { currentUser, users, messages, sendMessage } = useStore();
  const [selectedId, setSelectedId] = useState(null);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const endRef = useRef(null);

  // Build contact list: anyone with prior messages, plus all other users (so any role can chat with any role)
  const allOthers = Object.values(users).filter(u => u.id !== currentUser.id);

  const conversationsWith = allOthers.map(u => {
    const msgs = messages.filter(m => (m.from === currentUser.id && m.to === u.id) || (m.from === u.id && m.to === currentUser.id));
    const last = msgs[msgs.length - 1];
    return { user: u, last, msgCount: msgs.length };
  }).sort((a, b) => (b.msgCount - a.msgCount) || a.user.name.localeCompare(b.user.name));

  const filtered = conversationsWith.filter(c => c.user.name.toLowerCase().includes(search.toLowerCase()));
  const selected = users[selectedId];

  const chatMessages = selectedId ? messages.filter(m =>
    (m.from === currentUser.id && m.to === selectedId) || (m.from === selectedId && m.to === currentUser.id)
  ) : [];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages.length, selectedId]);

  const handleSend = () => {
    if (!text.trim() || !selectedId) return;
    sendMessage(currentUser.id, selectedId, text.trim());
    setText('');
  };

  const roleColors = { student: BRAND.blue, instructor: BRAND.purple, admin: BRAND.red };

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 'calc(100vh - 62px)' }}>
      {/* Contact list */}
      <div style={{ width: 280, borderRight: `1px solid ${BRAND.gray200}`, display: 'flex', flexDirection: 'column', background: '#fff', flexShrink: 0 }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${BRAND.gray100}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Messages</h3>
          <div style={{ position: 'relative' }}>
            <Icon name="search" size={14} color={BRAND.gray400} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
            <input className="input" style={{ paddingLeft: 32, fontSize: 12 }} placeholder="Search people..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(({ user, last }) => (
            <div key={user.id} onClick={() => setSelectedId(user.id)}
              style={{ padding: '12px 16px', display: 'flex', gap: 11, alignItems: 'center', cursor: 'pointer', background: selectedId === user.id ? BRAND.blueBg : '#fff', borderBottom: `1px solid ${BRAND.gray50}`, borderLeft: selectedId === user.id ? `3px solid ${BRAND.blue}` : '3px solid transparent' }}>
              <Avatar name={user.name} size={40} bg={roleColors[user.role] || BRAND.blue} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                  {last && <span style={{ fontSize: 10, color: BRAND.gray300, flexShrink: 0 }}>{last.time}</span>}
                </div>
                <div style={{ fontSize: 11, color: BRAND.gray400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {last ? (last.from === currentUser.id ? 'You: ' : '') + last.text : <span style={{ textTransform: 'capitalize' }}>{user.role}</span>}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: BRAND.gray400, fontSize: 13 }}>No contacts found</div>}
        </div>
      </div>

      {/* Chat area */}
      {selected ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '13px 20px', borderBottom: `1px solid ${BRAND.gray200}`, display: 'flex', alignItems: 'center', gap: 12, background: '#fff', flexShrink: 0 }}>
            <Avatar name={selected.name} size={38} bg={roleColors[selected.role] || BRAND.blue} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{selected.name}</div>
              <div style={{ fontSize: 11, color: BRAND.gray400, textTransform: 'capitalize' }}>{selected.role}{selected.role === 'instructor' ? ` • ${selected.bio?.slice(0, 30) || ''}` : ''}</div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 4, background: BRAND.gray50 }}>
            {chatMessages.map((msg, i) => {
              const isMine = msg.from === currentUser.id;
              const showDate = i === 0 || chatMessages[i-1].date !== msg.date;
              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <div style={{ textAlign: 'center', margin: '12px 0 6px' }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: BRAND.gray400, background: BRAND.gray100, padding: '3px 12px', borderRadius: 100 }}>{msg.date}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 4 }}>
                    <div className={isMine ? 'bubble-sent' : 'bubble-recv'}>{msg.text}</div>
                    <span style={{ fontSize: 10, color: BRAND.gray400, alignSelf: isMine ? 'flex-end' : 'flex-start', marginTop: 2, padding: '0 4px' }}>{msg.time}</span>
                  </div>
                </React.Fragment>
              );
            })}
            {chatMessages.length === 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: BRAND.gray400, gap: 10 }}>
                <Avatar name={selected.name} size={64} bg={roleColors[selected.role] || BRAND.blue} />
                <p style={{ fontSize: 13 }}>Start a conversation with {selected.name}</p>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div style={{ padding: '14px 20px', borderTop: `1px solid ${BRAND.gray200}`, display: 'flex', gap: 10, background: '#fff', flexShrink: 0 }}>
            <input className="input" value={text} onChange={e => setText(e.target.value)} placeholder={`Message ${selected.name.split(' ')[0]}...`}
              onKeyDown={e => e.key === 'Enter' && handleSend()} style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={handleSend} disabled={!text.trim()}>
              <Icon name="send" size={15} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, background: BRAND.gray50 }}>
          <EmptyState icon="chat" title="Select a conversation" message="Choose a contact from the left to start messaging" />
        </div>
      )}
    </div>
  );
}
