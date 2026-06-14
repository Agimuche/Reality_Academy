import React, { useState } from 'react';
import { BRAND } from './constants';
import { Icon, Avatar, Modal, FormField, StatCard, EmptyState, ConfirmDialog, Progress } from './components';
import { useStore } from './store';

// ============================================================
// ADMIN DASHBOARD
// ============================================================
export function AdminDashboard() {
  const { courses, payments, users } = useStore();
  const allPayments = payments.filter(p => p.status === 'completed' && p.type !== 'instructor_payout');
  const totalRevenue = allPayments.reduce((s, p) => s + p.amount, 0);
  const platformRevenue = totalRevenue * 0.3;
  const allStudents = Object.values(users).filter(u => u.role === 'student');
  const allInstructors = Object.values(users).filter(u => u.role === 'instructor');
  const publishedCourses = courses.filter(c => c.status === 'published');

  const revenueByC = publishedCourses.map(c => ({
    title: c.title.length > 18 ? c.title.slice(0, 18) + '…' : c.title,
    total: allPayments.filter(p => p.courseId === c.id).reduce((s, p) => s + p.amount, 0),
    cover: c.cover,
  })).sort((a, b) => b.total - a.total);

  const maxRev = Math.max(...revenueByC.map(c => c.total), 1);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: `linear-gradient(135deg, ${BRAND.red}, ${BRAND.blue})`, borderRadius: 18, padding: '26px 30px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.1 }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ color: '#fff', fontSize: 21, fontWeight: 800 }}>Platform Overview</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4, fontSize: 13 }}>Welcome to The Reality Academy Admin Portal</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard icon="users" label="Total Students" value={allStudents.length} color={BRAND.blue} />
        <StatCard icon="grad" label="Instructors" value={allInstructors.length} color={BRAND.purple} />
        <StatCard icon="book" label="Courses" value={publishedCourses.length} color={BRAND.green} />
        <StatCard icon="dollar" label="Platform Revenue (30%)" value={`₦${Math.round(platformRevenue).toLocaleString()}`} color={BRAND.red} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Revenue by Course</h3>
          {revenueByC.length === 0 ? <EmptyState icon="chart" title="No revenue yet" /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {revenueByC.map((c, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: BRAND.gray700 }}>{c.title}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.blue }}>₦{c.total.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 8, background: BRAND.gray100, borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(c.total / maxRev) * 100}%`, background: c.cover, borderRadius: 100, transition: 'width 0.6s' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Recent Transactions</h3>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {allPayments.slice(-8).reverse().map((p, i) => {
              const student = users[p.studentId];
              const course = courses.find(c => c.id === p.courseId);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1px solid ${BRAND.gray100}` }}>
                  <Avatar name={student?.name} size={30} bg={BRAND.blue} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student?.name}</div>
                    <div style={{ fontSize: 11, color: BRAND.gray400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course?.title}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: BRAND.green, fontSize: 13, flexShrink: 0 }}>₦{p.amount.toLocaleString()}</span>
                </div>
              );
            })}
            {allPayments.length === 0 && <EmptyState icon="pay" title="No transactions" />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN STUDENTS
// ============================================================
export function AdminStudents() {
  const { users, updateUser, showToast } = useStore();
  const students = Object.values(users).filter(u => u.role === 'student');
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState(null);
  const [form, setForm] = useState({});

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

  const openEdit = (s) => { setEditModal(s); setForm({ name: s.name, email: s.email, phone: s.phone || '', address: s.address || '' }); };
  const handleSave = () => {
    if (!form.name || !form.email) { showToast('Name and email are required', 'error'); return; }
    updateUser(editModal.id, form);
    setEditModal(null);
    showToast('Student updated!');
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Icon name="search" size={14} color={BRAND.gray400} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <span className="badge badge-blue">{filtered.length} students</span>
      </div>

      <div className="card">
        {filtered.length === 0 ? <EmptyState icon="users" title="No students found" /> : (
          <table>
            <thead><tr><th>Student</th><th>Email</th><th>Courses</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={s.name} size={34} bg={BRAND.blue} />
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                    </div>
                  </td>
                  <td style={{ color: BRAND.gray500, fontSize: 13 }}>{s.email}</td>
                  <td><span className="badge badge-blue">{(s.enrolled || []).length} courses</span></td>
                  <td style={{ fontSize: 12, color: BRAND.gray400 }}>{s.joinDate || 'Jan 2024'}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}><Icon name="edit" size={13} /> Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Edit Student">
        <FormField label="Full Name" required><input className="input" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></FormField>
        <FormField label="Email Address" required><input className="input" type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></FormField>
        <FormField label="Phone Number"><input className="input" type="tel" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+234 xxx xxx xxxx" /></FormField>
        <FormField label="Address"><textarea className="input" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} style={{ minHeight: 70 }} /></FormField>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <button className="btn btn-outline" onClick={() => setEditModal(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}><Icon name="save" size={14} /> Save</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// ADMIN INSTRUCTORS
// ============================================================
export function AdminInstructors() {
  const { users, courses, payments, payInstructor, showToast } = useStore();
  const instructors = Object.values(users).filter(u => u.role === 'instructor');
  const [payModal, setPayModal] = useState(null);
  const [payAmount, setPayAmount] = useState('');

  const getStats = (instructor) => {
    const myCourses = courses.filter(c => c.instructorId === instructor.id);
    const courseIds = myCourses.map(c => c.id);
    const myPayments = payments.filter(p => courseIds.includes(p.courseId) && p.status === 'completed');
    const gross = myPayments.reduce((s, p) => s + p.amount, 0);
    const owed = gross * 0.7;
    const paid = payments.filter(p => p.type === 'instructor_payout' && p.instructorId === instructor.id).reduce((s, p) => s + p.amount, 0);
    const students = new Set(myPayments.map(p => p.studentId)).size;
    return { courses: myCourses.length, students, owed: Math.round(owed), paid, balance: Math.round(owed - paid) };
  };

  const handlePay = () => {
    const amount = Number(payAmount);
    if (!amount || amount <= 0) { showToast('Enter a valid amount', 'error'); return; }
    const stats = getStats(payModal);
    if (amount > stats.balance) { showToast(`Balance is only ₦${stats.balance.toLocaleString()}`, 'error'); return; }
    payInstructor(payModal.id, amount);
    setPayModal(null);
    showToast(`₦${amount.toLocaleString()} paid to ${payModal.name}!`);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 20 }}>Instructors</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 18 }}>
        {instructors.map(inst => {
          const stats = getStats(inst);
          return (
            <div key={inst.id} className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start', marginBottom: 18 }}>
                <Avatar name={inst.name} size={52} bg={BRAND.purple} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{inst.name}</div>
                  <div style={{ fontSize: 12, color: BRAND.gray400 }}>{inst.email}</div>
                  {inst.bio && <p style={{ fontSize: 11, color: BRAND.gray500, marginTop: 4, lineHeight: 1.4 }}>{inst.bio?.slice(0, 60)}...</p>}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                {[['book', stats.courses, 'Courses', BRAND.blue], ['users', stats.students, 'Students', BRAND.purple], ['dollar', `₦${stats.balance.toLocaleString()}`, 'Owed', BRAND.green]].map(([icon, val, label, color], i) => (
                  <div key={i} style={{ background: `${color}10`, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                    <Icon name={icon} size={14} color={color} />
                    <div style={{ fontWeight: 800, fontSize: 15, color, marginTop: 3 }}>{val}</div>
                    <div style={{ fontSize: 10, color: BRAND.gray400 }}>{label}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => { setPayModal(inst); setPayAmount(String(stats.balance)); }}
                disabled={stats.balance <= 0}>
                <Icon name="pay" size={14} /> {stats.balance > 0 ? `Pay ₦${stats.balance.toLocaleString()}` : 'All Paid Up'}
              </button>
            </div>
          );
        })}
        {instructors.length === 0 && <EmptyState icon="grad" title="No instructors yet" />}
      </div>

      <Modal open={!!payModal} onClose={() => setPayModal(null)} title={`Pay ${payModal?.name}`}>
        {payModal && (
          <div>
            <div style={{ background: BRAND.blueBg, borderRadius: 12, padding: 16, marginBottom: 18 }}>
              <div style={{ display: 'flex', justify: 'space-between', gap: 20 }}>
                <Avatar name={payModal.name} size={44} bg={BRAND.purple} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{payModal.name}</div>
                  <div style={{ fontSize: 12, color: BRAND.gray500, marginTop: 2 }}>Balance: <strong style={{ color: BRAND.green }}>₦{getStats(payModal).balance.toLocaleString()}</strong></div>
                </div>
              </div>
            </div>
            <FormField label="Amount to Pay (₦)" required>
              <input className="input" type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder="Enter amount" />
            </FormField>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
              <button className="btn btn-outline" onClick={() => setPayModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handlePay}><Icon name="pay" size={14} /> Confirm Payment</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============================================================
// ADMIN COURSES
// ============================================================
export function AdminCourses() {
  const { courses, payments, users, addCourse, updateCourse, deleteCourse, showToast } = useStore();
  const instructors = Object.values(users).filter(u => u.role === 'instructor');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', category: '', price: '', duration: '', description: '', instructorId: '', modules: 8, lessons: 40 });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor?.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = () => {
    if (!form.title || !form.instructorId || !form.price) { showToast('Fill required fields', 'error'); return; }
    const instructor = users[form.instructorId];
    addCourse({ ...form, price: Number(form.price), modules: Number(form.modules) || 8, lessons: Number(form.lessons) || 40, instructor: instructor?.name || 'Unknown' });
    setModal(false);
    showToast('Course created!');
  };

  const categories = ['Technology', 'Business', 'Design', 'Health', 'Language', 'Mathematics', 'Science', 'Arts'];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, justifyContent: 'space-between' }}>
        <div style={{ flex: 1, maxWidth: 340, position: 'relative' }}>
          <Icon name="search" size={14} color={BRAND.gray400} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={() => { setForm({ title: '', category: '', price: '', duration: '', description: '', instructorId: instructors[0]?.id || '', modules: 8, lessons: 40 }); setModal(true); }}>
          <Icon name="plus" size={15} /> Add Course
        </button>
      </div>

      <div className="card">
        {filtered.length === 0 ? <EmptyState icon="book" title="No courses" /> : (
          <table>
            <thead><tr><th>Course</th><th>Instructor</th><th>Category</th><th>Price</th><th>Students</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(c => {
                const enrolled = payments.filter(p => p.courseId === c.id && p.status === 'completed').length;
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: c.cover, flexShrink: 0 }} />
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{c.title}</div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: BRAND.gray600 }}>{c.instructor}</td>
                    <td><span className="badge badge-blue">{c.category}</span></td>
                    <td style={{ fontWeight: 700, color: BRAND.blue }}>₦{c.price.toLocaleString()}</td>
                    <td>{enrolled}</td>
                    <td>
                      <button onClick={() => { updateCourse(c.id, { status: c.status === 'published' ? 'draft' : 'published' }); showToast(`Course ${c.status === 'published' ? 'unpublished' : 'published'}`); }}
                        className="badge" style={{ cursor: 'pointer', border: 'none', background: c.status === 'published' ? BRAND.greenBg : BRAND.yellowBg, color: c.status === 'published' ? BRAND.green : BRAND.yellow }}>
                        {c.status === 'published' ? '● Published' : '○ Draft'}
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-icon" onClick={() => setConfirmDelete(c)} title="Delete" style={{ color: BRAND.red }}><Icon name="trash" size={14} color={BRAND.red} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add New Course">
        <FormField label="Course Title" required><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormField label="Instructor" required>
            <select className="input" value={form.instructorId} onChange={e => setForm({ ...form, instructorId: e.target.value })}>
              <option value="">Select instructor</option>
              {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </FormField>
          <FormField label="Category">
            <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </FormField>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <FormField label="Price (₦)" required><input className="input" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></FormField>
          <FormField label="Duration"><input className="input" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="8 weeks" /></FormField>
          <FormField label="Modules"><input className="input" type="number" value={form.modules} onChange={e => setForm({ ...form, modules: e.target.value })} /></FormField>
        </div>
        <FormField label="Description"><textarea className="input" style={{ minHeight: 80 }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></FormField>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate}><Icon name="save" size={14} /> Create Course</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Delete Course" message={`Delete "${confirmDelete?.title}"? This cannot be undone.`}
        onConfirm={() => { deleteCourse(confirmDelete.id); setConfirmDelete(null); showToast('Course deleted'); }}
        onCancel={() => setConfirmDelete(null)} />
    </div>
  );
}

// ============================================================
// ADMIN PAYMENTS
// ============================================================
export function AdminPayments() {
  const { payments, courses, users } = useStore();
  const enrollments = payments.filter(p => p.status === 'completed' && p.type !== 'instructor_payout');
  const payouts = payments.filter(p => p.type === 'instructor_payout');
  const totalGross = enrollments.reduce((s, p) => s + p.amount, 0);
  const platformFee = totalGross * 0.3;
  const instructorPayouts = payouts.reduce((s, p) => s + p.amount, 0);
  const [tab, setTab] = useState('enrollments');

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard icon="dollar" label="Gross Revenue" value={`₦${totalGross.toLocaleString()}`} color={BRAND.blue} />
        <StatCard icon="dollar" label="Platform Revenue (30%)" value={`₦${Math.round(platformFee).toLocaleString()}`} color={BRAND.red} />
        <StatCard icon="pay" label="Instructor Payouts" value={`₦${instructorPayouts.toLocaleString()}`} color={BRAND.green} />
        <StatCard icon="clipboard" label="Total Transactions" value={enrollments.length} color={BRAND.purple} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['enrollments', 'payouts'].map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
            {t === 'enrollments' ? `Enrollments (${enrollments.length})` : `Instructor Payouts (${payouts.length})`}
          </button>
        ))}
      </div>

      <div className="card">
        {tab === 'enrollments' ? (
          enrollments.length === 0 ? <EmptyState icon="pay" title="No transactions yet" /> : (
            <table>
              <thead><tr><th>Student</th><th>Course</th><th>Amount</th><th>Platform (30%)</th><th>Instructor (70%)</th><th>Method</th><th>Date</th><th>Ref</th></tr></thead>
              <tbody>
                {enrollments.map(p => {
                  const student = users[p.studentId];
                  const course = courses.find(c => c.id === p.courseId);
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <Avatar name={student?.name} size={28} bg={BRAND.blue} />
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{student?.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: BRAND.gray600 }}>{course?.title}</td>
                      <td style={{ fontWeight: 700, color: BRAND.blue }}>₦{p.amount.toLocaleString()}</td>
                      <td style={{ color: BRAND.red }}>₦{Math.round(p.amount * 0.3).toLocaleString()}</td>
                      <td style={{ color: BRAND.green }}>₦{Math.round(p.amount * 0.7).toLocaleString()}</td>
                      <td style={{ color: BRAND.gray500, fontSize: 12 }}>{p.method}</td>
                      <td style={{ color: BRAND.gray400, fontSize: 12 }}>{p.date}</td>
                      <td><code style={{ fontSize: 10, background: BRAND.gray100, padding: '2px 6px', borderRadius: 4 }}>{p.ref}</code></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        ) : (
          payouts.length === 0 ? <EmptyState icon="pay" title="No payouts yet" /> : (
            <table>
              <thead><tr><th>Instructor</th><th>Amount</th><th>Date</th><th>Reference</th></tr></thead>
              <tbody>
                {payouts.map(p => {
                  const instructor = users[p.instructorId];
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <Avatar name={instructor?.name} size={28} bg={BRAND.purple} />
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{instructor?.name}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: BRAND.green }}>₦{p.amount.toLocaleString()}</td>
                      <td style={{ color: BRAND.gray400, fontSize: 12 }}>{p.date}</td>
                      <td><code style={{ fontSize: 10, background: BRAND.gray100, padding: '2px 6px', borderRadius: 4 }}>{p.ref}</code></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}

// ============================================================
// ADMIN REPORTS
// ============================================================
export function AdminReports() {
  const { users, courses, payments, assignments } = useStore();
  const allStudents = Object.values(users).filter(u => u.role === 'student');
  const enrollments = payments.filter(p => p.status === 'completed' && p.type !== 'instructor_payout');
  const totalRevenue = enrollments.reduce((s, p) => s + p.amount, 0);
  const allSubs = assignments.flatMap(a => a.submissions || []);
  const gradedSubs = allSubs.filter(s => s.score !== null && s.score !== undefined);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 20 }}>Platform Reports</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard icon="users" label="Total Users" value={Object.keys(users).length} color={BRAND.blue} />
        <StatCard icon="book" label="Total Courses" value={courses.length} color={BRAND.purple} />
        <StatCard icon="clipboard" label="Submissions" value={allSubs.length} color={BRAND.orange} />
        <StatCard icon="dollar" label="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} color={BRAND.green} />
      </div>

      <div className="card">
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BRAND.gray100}`, fontWeight: 700, fontSize: 14 }}>Student Progress Summary</div>
        {allStudents.length === 0 ? <EmptyState icon="users" title="No students yet" /> : (
          <table>
            <thead><tr><th>Student</th><th>Courses Enrolled</th><th>Avg Progress</th><th>Submissions</th><th>Avg Score</th></tr></thead>
            <tbody>
              {allStudents.map(s => {
                const enrolled = (s.enrolled || []).length;
                const avgProgress = enrolled > 0 ? Math.round(Object.values(s.progress || {}).reduce((a, b) => a + b, 0) / enrolled) : 0;
                const studentSubs = gradedSubs.filter(sub => sub.studentId === s.id);
                const avgScore = studentSubs.length > 0 ? Math.round(studentSubs.reduce((acc, sub) => {
                  const a = assignments.find(x => x.submissions?.includes(sub));
                  return acc + (sub.score / (a?.totalScore || 100)) * 100;
                }, 0) / studentSubs.length) : null;
                return (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={s.name} size={30} bg={BRAND.blue} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: BRAND.gray400 }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{enrolled}</span></td>
                    <td>
                      <div style={{ display: 'flex', align: 'center', gap: 7, minWidth: 100 }}>
                        <Progress value={avgProgress} style={{ flex: 1 }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: BRAND.blue }}>{avgProgress}%</span>
                      </div>
                    </td>
                    <td>{allSubs.filter(sub => sub.studentId === s.id).length}</td>
                    <td style={{ fontWeight: 700, color: avgScore !== null ? (avgScore >= 70 ? BRAND.green : BRAND.orange) : BRAND.gray400 }}>
                      {avgScore !== null ? `${avgScore}%` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ADMIN SETTINGS
// ============================================================
export function AdminSettings() {
  const { showToast } = useStore();
  const [general, setGeneral] = useState({ platformName: 'The Reality Academy', supportEmail: 'support@realityacademy.edu', contactPhone: '+234 800 000 0000', address: 'Lagos, Nigeria', currency: 'NGN', timezone: 'Africa/Lagos' });
  const [payment, setPayment] = useState({ instructorShare: 70, platformShare: 30, gateway: 'Paystack', paystackKey: 'pk_live_***', bankName: 'Reality Academy MFB', accountNumber: '0123456789', accountName: 'The Reality Academy Ltd' });

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 20 }}>Settings</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="settings" size={16} color={BRAND.blue} /> General Settings
          </h3>
          <FormField label="Platform Name"><input className="input" value={general.platformName} onChange={e => setGeneral({ ...general, platformName: e.target.value })} /></FormField>
          <FormField label="Support Email"><input className="input" type="email" value={general.supportEmail} onChange={e => setGeneral({ ...general, supportEmail: e.target.value })} /></FormField>
          <FormField label="Contact Phone"><input className="input" value={general.contactPhone} onChange={e => setGeneral({ ...general, contactPhone: e.target.value })} /></FormField>
          <FormField label="Address"><input className="input" value={general.address} onChange={e => setGeneral({ ...general, address: e.target.value })} /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Currency">
              <select className="input" value={general.currency} onChange={e => setGeneral({ ...general, currency: e.target.value })}>
                <option value="NGN">NGN (₦)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </FormField>
            <FormField label="Timezone">
              <select className="input" value={general.timezone} onChange={e => setGeneral({ ...general, timezone: e.target.value })}>
                <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </FormField>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => showToast('General settings saved!')}><Icon name="save" size={14} /> Save General Settings</button>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="pay" size={16} color={BRAND.green} /> Payment Settings
          </h3>
          <div style={{ background: BRAND.blueBg, borderRadius: 10, padding: 14, marginBottom: 18 }}>
            <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Revenue Split</p>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: BRAND.green }}>{payment.instructorShare}%</div>
                <div style={{ fontSize: 11, color: BRAND.gray500 }}>Instructor</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: BRAND.red }}>{payment.platformShare}%</div>
                <div style={{ fontSize: 11, color: BRAND.gray500 }}>Platform</div>
              </div>
            </div>
          </div>
          <FormField label="Payment Gateway">
            <select className="input" value={payment.gateway} onChange={e => setPayment({ ...payment, gateway: e.target.value })}>
              <option>Paystack</option>
              <option>Flutterwave</option>
              <option>Bank Transfer Only</option>
            </select>
          </FormField>
          <FormField label="Paystack Secret Key"><input className="input" type="password" value={payment.paystackKey} onChange={e => setPayment({ ...payment, paystackKey: e.target.value })} /></FormField>
          <FormField label="Bank Account Name"><input className="input" value={payment.accountName} onChange={e => setPayment({ ...payment, accountName: e.target.value })} /></FormField>
          <FormField label="Account Number"><input className="input" value={payment.accountNumber} onChange={e => setPayment({ ...payment, accountNumber: e.target.value })} /></FormField>
          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => showToast('Payment settings saved!')}><Icon name="save" size={14} /> Save Payment Settings</button>
        </div>
      </div>
    </div>
  );
}
