import React, { useState } from 'react';
import { BRAND } from './constants';
import { Icon, Avatar, Modal, FormField, StatCard, Progress, EmptyState, ConfirmDialog } from './components';
import { useStore } from './store';

// ============================================================
// INSTRUCTOR DASHBOARD
// ============================================================
export function InstructorDashboard() {
  const { currentUser, courses, assignments, payments, students } = useStore();
  const myCourses = courses.filter(c => c.instructorId === currentUser.id);
  const courseIds = myCourses.map(c => c.id);
  const myPayments = payments.filter(p => courseIds.includes(p.courseId) && p.status === 'completed');
  const myAssignments = assignments.filter(a => courseIds.includes(a.courseId));
  const pendingReviews = myAssignments.flatMap(a => (a.submissions || []).filter(s => s.score === null || s.score === undefined));
  const totalStudents = new Set(myPayments.map(p => p.studentId)).size;
  const totalEarnings = myPayments.reduce((s, p) => s + p.amount * 0.7, 0);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.blue})`, borderRadius: 18, padding: '26px 30px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.1 }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ color: '#fff', fontSize: 21, fontWeight: 800 }}>Welcome, {currentUser.name.split(' ')[0]}! 🎓</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: 6, fontSize: 13 }}>
            {pendingReviews.length > 0 ? `You have ${pendingReviews.length} submission${pendingReviews.length !== 1 ? 's' : ''} awaiting review.` : 'All submissions reviewed. Great work!'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard icon="book" label="My Courses" value={myCourses.length} color={BRAND.blue} />
        <StatCard icon="users" label="Total Students" value={totalStudents} color={BRAND.purple} />
        <StatCard icon="clipboard" label="Pending Reviews" value={pendingReviews.length} color={BRAND.orange} />
        <StatCard icon="dollar" label="Total Earnings" value={`₦${Math.round(totalEarnings).toLocaleString()}`} color={BRAND.green} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>My Courses</h3>
          {myCourses.map(c => {
            const enrolled = myPayments.filter(p => p.courseId === c.id).length;
            return (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${BRAND.gray100}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: c.cover, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="book" size={16} color="#fff" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: BRAND.gray400 }}>{enrolled} students</div>
                </div>
                <span className={`badge ${c.status === 'published' ? 'badge-green' : 'badge-yellow'}`}>{c.status}</span>
              </div>
            );
          })}
          {myCourses.length === 0 && <EmptyState icon="book" title="No courses yet" message="Create your first course!" />}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Recent Submissions</h3>
          {pendingReviews.slice(0, 5).map((sub, i) => {
            const assignment = myAssignments.find(a => a.submissions?.includes(sub));
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${BRAND.gray100}` }}>
                <Avatar name={sub.studentId} size={32} bg={BRAND.blue} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{assignment?.title || 'Assignment'}</div>
                  <div style={{ fontSize: 11, color: BRAND.gray400 }}>Submitted {sub.submittedAt}</div>
                </div>
                <span className="badge badge-orange">Needs Review</span>
              </div>
            );
          })}
          {pendingReviews.length === 0 && <EmptyState icon="check" title="All caught up!" message="No pending reviews" />}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// INSTRUCTOR COURSES
// ============================================================
export function InstructorCourses() {
  const { currentUser, courses, addCourse, updateCourse, deleteCourse, payments, showToast } = useStore();
  const myCourses = courses.filter(c => c.instructorId === currentUser.id);
  const [modal, setModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [form, setForm] = useState({ title: '', category: '', price: '', duration: '', description: '', modules: '', lessons: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openCreate = () => { setEditCourse(null); setForm({ title: '', category: '', price: '', duration: '', description: '', modules: 8, lessons: 40 }); setModal(true); };
  const openEdit = (c) => { setEditCourse(c); setForm({ title: c.title, category: c.category, price: c.price, duration: c.duration, description: c.description, modules: c.modules, lessons: c.lessons }); setModal(true); };

  const handleSave = () => {
    if (!form.title || !form.category || !form.price) { showToast('Please fill in all required fields', 'error'); return; }
    if (editCourse) {
      updateCourse(editCourse.id, { ...form, price: Number(form.price), modules: Number(form.modules), lessons: Number(form.lessons) });
      showToast('Course updated!');
    } else {
      addCourse({ ...form, price: Number(form.price), modules: Number(form.modules) || 8, lessons: Number(form.lessons) || 40, instructorId: currentUser.id, instructor: currentUser.name });
      showToast('Course created!');
    }
    setModal(false);
  };

  const categoryOptions = ['Technology', 'Business', 'Design', 'Health', 'Language', 'Mathematics', 'Science', 'Arts'];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 19, fontWeight: 800 }}>My Courses</h2>
        <button className="btn btn-primary" onClick={openCreate}><Icon name="plus" size={15} /> Create Course</button>
      </div>

      {myCourses.length === 0 ? (
        <EmptyState icon="book" title="No courses yet" message="Create your first course to start teaching" action={<button className="btn btn-primary" onClick={openCreate}><Icon name="plus" size={14} /> Create Course</button>} />
      ) : (
        <div className="card">
          <table>
            <thead><tr><th>Course</th><th>Category</th><th>Price</th><th>Students</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {myCourses.map(c => {
                const enrolled = payments.filter(p => p.courseId === c.id && p.status === 'completed').length;
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: c.cover, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon name="book" size={15} color="#fff" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{c.title}</div>
                          <div style={{ fontSize: 11, color: BRAND.gray400 }}>{c.duration} • {c.modules} modules</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{c.category}</span></td>
                    <td style={{ fontWeight: 700, color: BRAND.blue }}>₦{c.price.toLocaleString()}</td>
                    <td>{enrolled}</td>
                    <td>
                      <button onClick={() => updateCourse(c.id, { status: c.status === 'published' ? 'draft' : 'published' })}
                        className="badge" style={{ cursor: 'pointer', border: 'none', background: c.status === 'published' ? BRAND.greenBg : BRAND.yellowBg, color: c.status === 'published' ? BRAND.green : BRAND.yellow }}>
                        {c.status === 'published' ? '● Published' : '○ Draft'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-icon" onClick={() => openEdit(c)} title="Edit"><Icon name="edit" size={14} /></button>
                        <button className="btn btn-ghost btn-icon" onClick={() => setConfirmDelete(c)} title="Delete" style={{ color: BRAND.red }}><Icon name="trash" size={14} color={BRAND.red} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editCourse ? 'Edit Course' : 'Create New Course'}>
        <FormField label="Course Title" required><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Introduction to Python" /></FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormField label="Category" required>
            <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category</option>
              {categoryOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </FormField>
          <FormField label="Price (₦)" required><input className="input" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 15000" /></FormField>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <FormField label="Duration"><input className="input" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 8 weeks" /></FormField>
          <FormField label="Modules"><input className="input" type="number" value={form.modules} onChange={e => setForm({ ...form, modules: e.target.value })} placeholder="8" /></FormField>
          <FormField label="Lessons"><input className="input" type="number" value={form.lessons} onChange={e => setForm({ ...form, lessons: e.target.value })} placeholder="40" /></FormField>
        </div>
        <FormField label="Description"><textarea className="input" style={{ minHeight: 90 }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief course description..." /></FormField>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}><Icon name="save" size={14} /> {editCourse ? 'Update' : 'Create'} Course</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Delete Course" message={`Are you sure you want to delete "${confirmDelete?.title}"? This cannot be undone.`}
        onConfirm={() => { deleteCourse(confirmDelete.id); setConfirmDelete(null); showToast('Course deleted'); }}
        onCancel={() => setConfirmDelete(null)} />
    </div>
  );
}

// ============================================================
// INSTRUCTOR STUDENTS
// ============================================================
export function InstructorStudents() {
  const { currentUser, courses, payments, users } = useStore();
  const myCourses = courses.filter(c => c.instructorId === currentUser.id);
  const courseIds = myCourses.map(c => c.id);
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  const enrolled = payments.filter(p => courseIds.includes(p.courseId) && p.status === 'completed' && (selectedCourse === 'all' || p.courseId === selectedCourse));
  const uniqueStudents = [...new Map(enrolled.map(p => [p.studentId, p])).values()];

  const filtered = uniqueStudents.filter(p => {
    const user = users[p.studentId];
    return user?.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Icon name="search" size={14} color={BRAND.gray400} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" style={{ width: 200 }} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
          <option value="all">All Courses</option>
          {myCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      <div className="card">
        {filtered.length === 0 ? <EmptyState icon="users" title="No students yet" message="Students will appear here once they enroll" /> : (
          <table>
            <thead><tr><th>Student</th><th>Course</th><th>Progress</th><th>Enrolled Date</th><th>Amount Paid</th></tr></thead>
            <tbody>
              {filtered.map(p => {
                const user = users[p.studentId];
                const course = myCourses.find(c => c.id === p.courseId);
                const progress = user?.progress?.[p.courseId] || 0;
                return (
                  <tr key={`${p.studentId}-${p.courseId}`}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={user?.name} size={34} bg={BRAND.blue} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{user?.name || p.studentId}</div>
                          <div style={{ fontSize: 11, color: BRAND.gray400 }}>{user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: BRAND.gray600 }}>{course?.title}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
                        <Progress value={progress} style={{ flex: 1 }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: BRAND.blue, whiteSpace: 'nowrap' }}>{progress}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: BRAND.gray400 }}>{p.date}</td>
                    <td style={{ fontWeight: 700, color: BRAND.green }}>₦{p.amount.toLocaleString()}</td>
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
// INSTRUCTOR ASSIGNMENTS
// ============================================================
export function InstructorAssignments() {
  const { currentUser, courses, assignments, users, addAssignment, gradeSubmission, showToast } = useStore();
  const myCourses = courses.filter(c => c.instructorId === currentUser.id);
  const courseIds = myCourses.map(c => c.id);
  const myAssignments = assignments.filter(a => courseIds.includes(a.courseId));
  const [createModal, setCreateModal] = useState(false);
  const [gradeModal, setGradeModal] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', courseId: '', type: 'text', dueDate: '', totalScore: 100 });
  const [questions, setQuestions] = useState([{ id: 'q1', text: '', options: ['', '', '', ''], correct: 0 }]);
  const [gradeForm, setGradeForm] = useState({ score: '', feedback: '' });
  const [tab, setTab] = useState('all');

  const allSubs = myAssignments.flatMap(a => (a.submissions || []).map(s => ({ ...s, assignment: a })));
  const pending = allSubs.filter(s => s.score === null || s.score === undefined);
  const graded = allSubs.filter(s => s.score !== null && s.score !== undefined);

  const handleCreate = () => {
    if (!form.title || !form.courseId) { showToast('Fill in required fields', 'error'); return; }
    addAssignment({ ...form, totalScore: Number(form.totalScore), questions: form.type === 'quiz' ? questions : [] });
    setCreateModal(false);
    showToast('Assignment created!');
  };

  const addQuestion = () => setQuestions(prev => [...prev, { id: `q${Date.now()}`, text: '', options: ['', '', '', ''], correct: 0 }]);
  const updateQ = (i, field, val) => setQuestions(prev => prev.map((q, qi) => qi === i ? { ...q, [field]: val } : q));
  const updateOpt = (qi, oi, val) => setQuestions(prev => prev.map((q, i) => i === qi ? { ...q, options: q.options.map((o, j) => j === oi ? val : o) } : q));

  const submitGrade = () => {
    if (gradeForm.score === '' || isNaN(gradeForm.score)) { showToast('Enter a valid score', 'error'); return; }
    gradeSubmission(gradeModal.assignment.id, gradeModal.studentId, Number(gradeForm.score), gradeForm.feedback);
    setGradeModal(null);
    showToast('Submission graded!');
  };

  const displaySubs = tab === 'pending' ? pending : tab === 'graded' ? graded : allSubs;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 19, fontWeight: 800 }}>Assignments</h2>
        <button className="btn btn-primary" onClick={() => { setForm({ title: '', description: '', courseId: myCourses[0]?.id || '', type: 'text', dueDate: '', totalScore: 100 }); setQuestions([{ id: 'q1', text: '', options: ['', '', '', ''], correct: 0 }]); setCreateModal(true); }}>
          <Icon name="plus" size={15} /> Create Assignment
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard icon="clipboard" label="Total Assignments" value={myAssignments.length} color={BRAND.blue} />
        <StatCard icon="clock" label="Pending Review" value={pending.length} color={BRAND.orange} />
        <StatCard icon="check" label="Graded" value={graded.length} color={BRAND.green} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['all', 'pending', 'graded'].map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
            {t} {t === 'pending' ? `(${pending.length})` : t === 'graded' ? `(${graded.length})` : `(${allSubs.length})`}
          </button>
        ))}
      </div>

      <div className="card">
        {displaySubs.length === 0 ? <EmptyState icon="clipboard" title="No submissions" message="Nothing to review right now" /> : (
          <table>
            <thead><tr><th>Assignment</th><th>Student</th><th>Submitted</th><th>Score</th><th>Action</th></tr></thead>
            <tbody>
              {displaySubs.map((sub, i) => {
                const student = users[sub.studentId];
                return (
                  <tr key={i}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{sub.assignment.title}</div>
                      <div style={{ fontSize: 11, color: BRAND.gray400 }}>{sub.assignment.type === 'quiz' ? '📝 Quiz' : '📄 Text'} • {sub.assignment.totalScore} pts</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <Avatar name={student?.name} size={30} bg={BRAND.blue} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{student?.name}</div>
                          <div style={{ fontSize: 11, color: BRAND.gray400 }}>{student?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: BRAND.gray400 }}>{sub.submittedAt}</td>
                    <td>
                      {sub.score !== null && sub.score !== undefined
                        ? <span style={{ fontWeight: 700, color: BRAND.green }}>{sub.score}/{sub.assignment.totalScore}</span>
                        : <span className="badge badge-orange">Ungraded</span>}
                    </td>
                    <td>
                      {(sub.score === null || sub.score === undefined) ? (
                        <button className="btn btn-primary btn-sm" onClick={() => { setGradeModal(sub); setGradeForm({ score: '', feedback: '' }); }}>Grade</button>
                      ) : (
                        <button className="btn btn-outline btn-sm" onClick={() => { setGradeModal(sub); setGradeForm({ score: sub.score, feedback: sub.feedback || '' }); }}>View</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Assignment Modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Create Assignment">
        <FormField label="Title" required><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Assignment title" /></FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormField label="Course" required>
            <select className="input" value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })}>
              {myCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </FormField>
          <FormField label="Type">
            <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="text">Text/Project Submission</option>
              <option value="quiz">Multiple Choice Quiz</option>
            </select>
          </FormField>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormField label="Due Date"><input className="input" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></FormField>
          <FormField label="Total Score"><input className="input" type="number" value={form.totalScore} onChange={e => setForm({ ...form, totalScore: e.target.value })} /></FormField>
        </div>
        <FormField label="Description"><textarea className="input" style={{ minHeight: 70 }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></FormField>

        {form.type === 'quiz' && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, marginTop: 4 }}>Questions</div>
            {questions.map((q, qi) => (
              <div key={q.id} style={{ background: BRAND.gray50, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                <input className="input" style={{ marginBottom: 8 }} placeholder={`Question ${qi + 1}`} value={q.text} onChange={e => updateQ(qi, 'text', e.target.value)} />
                {q.options.map((opt, oi) => (
                  <div key={oi} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <input type="radio" name={`correct-${q.id}`} checked={q.correct === oi} onChange={() => updateQ(qi, 'correct', oi)} />
                    <input className="input" style={{ flex: 1 }} placeholder={`Option ${oi + 1}`} value={opt} onChange={e => updateOpt(qi, oi, e.target.value)} />
                  </div>
                ))}
              </div>
            ))}
            <button className="btn btn-outline btn-sm" onClick={addQuestion}><Icon name="plus" size={13} /> Add Question</button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
          <button className="btn btn-outline" onClick={() => setCreateModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate}><Icon name="save" size={14} /> Create</button>
        </div>
      </Modal>

      {/* Grade Modal */}
      <Modal open={!!gradeModal} onClose={() => setGradeModal(null)} title="Grade Submission">
        {gradeModal && (
          <div>
            <div style={{ background: BRAND.gray50, borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 13 }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{gradeModal.assignment.title}</p>
              <p style={{ color: BRAND.gray500 }}>Student: {users[gradeModal.studentId]?.name}</p>
              {gradeModal.text && <p style={{ marginTop: 10, padding: 10, background: '#fff', borderRadius: 8, color: BRAND.gray700, lineHeight: 1.5 }}>{gradeModal.text}</p>}
            </div>
            <FormField label={`Score (out of ${gradeModal.assignment.totalScore})`} required>
              <input className="input" type="number" value={gradeForm.score} onChange={e => setGradeForm({ ...gradeForm, score: e.target.value })} min="0" max={gradeModal.assignment.totalScore} />
            </FormField>
            <FormField label="Feedback"><textarea className="input" style={{ minHeight: 80 }} value={gradeForm.feedback} onChange={e => setGradeForm({ ...gradeForm, feedback: e.target.value })} placeholder="Write feedback for the student..." /></FormField>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
              <button className="btn btn-outline" onClick={() => setGradeModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitGrade}><Icon name="check" size={14} /> Submit Grade</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============================================================
// INSTRUCTOR ATTENDANCE
// ============================================================
export function InstructorAttendance() {
  const { currentUser, courses, payments, users, attendance, saveAttendance, showToast } = useStore();
  const myCourses = courses.filter(c => c.instructorId === currentUser.id);
  const [selectedCourse, setSelectedCourse] = useState(myCourses[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState({});

  const enrolledStudentIds = payments.filter(p => p.courseId === selectedCourse && p.status === 'completed').map(p => p.studentId);
  const enrolledStudents = enrolledStudentIds.map(id => users[id]).filter(Boolean);

  const existingRecord = attendance.find(a => a.courseId === selectedCourse && a.date === date);

  React.useEffect(() => {
    if (existingRecord) {
      setRecords(existingRecord.records);
    } else {
      const init = {};
      enrolledStudentIds.forEach(id => { init[id] = 'present'; });
      setRecords(init);
    }
  }, [selectedCourse, date]);

  const markAll = (status) => {
    const updated = {};
    enrolledStudentIds.forEach(id => { updated[id] = status; });
    setRecords(updated);
  };

  const handleSave = () => {
    saveAttendance(selectedCourse, date, records);
    showToast('Attendance saved!');
  };

  const statusColors = { present: BRAND.green, absent: BRAND.red, late: BRAND.orange };
  const statusBg = { present: BRAND.greenBg, absent: BRAND.redLight, late: BRAND.orangeBg };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 20 }}>Attendance</h2>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <FormField label="Course">
            <select className="input" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
              {myCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </FormField>
          <FormField label="Date"><input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} /></FormField>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button className="btn btn-sm" style={{ background: BRAND.greenBg, color: BRAND.green, border: `1px solid ${BRAND.green}33` }} onClick={() => markAll('present')}>✓ Mark All Present</button>
          <button className="btn btn-sm" style={{ background: BRAND.redLight, color: BRAND.red, border: `1px solid ${BRAND.red}33` }} onClick={() => markAll('absent')}>✗ Mark All Absent</button>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: BRAND.gray400, display: 'flex', alignItems: 'center' }}>
            {enrolledStudents.length} students
          </span>
        </div>

        {enrolledStudents.length === 0 ? <EmptyState icon="users" title="No students enrolled" message="Students will appear once they enroll in this course" /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {enrolledStudents.map(student => {
              const status = records[student.id] || 'present';
              return (
                <div key={student.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: BRAND.gray50, borderRadius: 10 }}>
                  <Avatar name={student.name} size={36} bg={BRAND.blue} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{student.name}</div>
                    <div style={{ fontSize: 11, color: BRAND.gray400 }}>{student.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['present', 'absent', 'late'].map(s => (
                      <button key={s} onClick={() => setRecords(r => ({ ...r, [student.id]: s }))}
                        style={{ padding: '5px 12px', borderRadius: 8, border: `2px solid ${status === s ? statusColors[s] : BRAND.gray200}`, background: status === s ? statusBg[s] : '#fff', color: status === s ? statusColors[s] : BRAND.gray400, fontSize: 11, fontWeight: 700, textTransform: 'capitalize', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', transition: 'all 0.15s' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {enrolledStudents.length > 0 && (
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleSave}><Icon name="save" size={14} /> Save Attendance</button>
        )}
      </div>

      {/* History */}
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Attendance History</h3>
        {attendance.filter(a => a.courseId === selectedCourse).length === 0 ? (
          <EmptyState icon="calendar" title="No records yet" message="Save today's attendance to see history" />
        ) : (
          <table>
            <thead><tr><th>Date</th><th>Present</th><th>Absent</th><th>Late</th><th>Rate</th></tr></thead>
            <tbody>
              {attendance.filter(a => a.courseId === selectedCourse).map((record, i) => {
                const vals = Object.values(record.records);
                const present = vals.filter(v => v === 'present').length;
                const absent = vals.filter(v => v === 'absent').length;
                const late = vals.filter(v => v === 'late').length;
                const total = vals.length;
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{record.date}</td>
                    <td><span className="badge badge-green">{present}</span></td>
                    <td><span className="badge badge-red">{absent}</span></td>
                    <td><span className="badge badge-orange">{late}</span></td>
                    <td style={{ fontWeight: 700, color: BRAND.green }}>{total > 0 ? Math.round((present / total) * 100) : 0}%</td>
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
// INSTRUCTOR RESOURCES
// ============================================================
export function InstructorResources() {
  const { currentUser, courses, resources, uploadResource, deleteResource, showToast } = useStore();
  const myCourses = courses.filter(c => c.instructorId === currentUser.id);
  const courseIds = myCourses.map(c => c.id);
  const myResources = resources.filter(r => courseIds.includes(r.courseId));
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', courseId: '', type: 'pdf', size: '', file: null });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleUpload = async () => {
    if (!form.title || !form.courseId) { showToast('Fill in all fields', 'error'); return; }
    await uploadResource({ ...form, instructorId: currentUser.id, file: form.file });
    setModal(false);
  };

  const typeIcons = { pdf: 'file', video: 'video', zip: 'file', doc: 'file' };
  const typeColors = { pdf: BRAND.red, video: BRAND.blue, zip: BRAND.orange, doc: BRAND.purple };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 19, fontWeight: 800 }}>Resources</h2>
        <button className="btn btn-primary" onClick={() => { setForm({ title: '', courseId: myCourses[0]?.id || '', type: 'pdf', size: '' }); setModal(true); }}>
          <Icon name="upload" size={15} /> Upload Resource
        </button>
      </div>

      {myResources.length === 0 ? (
        <EmptyState icon="file" title="No resources uploaded" message="Upload PDFs, videos, and documents for your students" action={<button className="btn btn-primary" onClick={() => setModal(true)}><Icon name="upload" size={14} /> Upload</button>} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 16 }}>
          {myResources.map(r => {
            const course = courses.find(c => c.id === r.courseId);
            return (
              <div key={r.id} className="card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${typeColors[r.type]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={typeIcons[r.type] || 'file'} size={20} color={typeColors[r.type] || BRAND.blue} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: BRAND.gray400 }}>{course?.title}</div>
                    <div style={{ fontSize: 10, color: BRAND.gray300, marginTop: 2 }}>{r.size} • {r.type.toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline btn-sm" style={{ flex: 1 }}><Icon name="download" size={12} /> Download</button>
                  <button className="btn btn-ghost btn-icon" style={{ color: BRAND.red }} onClick={() => setConfirmDelete(r)}><Icon name="trash" size={14} color={BRAND.red} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Upload Resource">
        <FormField label="Title" required><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Resource title" /></FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormField label="Course" required>
            <select className="input" value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })}>
              {myCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </FormField>
          <FormField label="Type">
            <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="pdf">PDF Document</option>
              <option value="video">Video</option>
              <option value="zip">ZIP Archive</option>
              <option value="doc">Word Document</option>
            </select>
          </FormField>
        </div>
        <FormField label="File Size (e.g. 2.4 MB)"><input className="input" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} placeholder="e.g. 2.4 MB" /></FormField>
        <div
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setForm({ ...form, file: f, title: form.title || f.name, size: `${(f.size/1024/1024).toFixed(2)} MB` }); }}
          onDragOver={(e) => e.preventDefault()}
          style={{ border: `2px dashed ${BRAND.gray200}`, borderRadius: 12, padding: 30, textAlign: 'center', marginBottom: 14, background: BRAND.gray50 }}>
          <Icon name="upload" size={28} color={BRAND.gray300} />
          <p style={{ fontSize: 13, color: BRAND.gray400, marginTop: 8 }}>Drag & drop your file here</p>
          <p style={{ fontSize: 11, color: BRAND.gray300 }}>Any file type allowed (max configured by server)</p>
          <div style={{ marginTop: 10 }}>
            <input id="resource-file-input" type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files[0]; if (f) setForm({ ...form, file: f, title: form.title || f.name, size: `${(f.size/1024/1024).toFixed(2)} MB` }); }} />
            <label htmlFor="resource-file-input" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>Browse Files</label>
          </div>
          {form.file && <div style={{ marginTop: 12, fontSize: 13, color: BRAND.gray700 }}>{form.file.name} • {form.size}</div>}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleUpload}><Icon name="upload" size={14} /> Upload</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} title="Delete Resource" message={`Delete "${confirmDelete?.title}"?`}
        onConfirm={() => { deleteResource(confirmDelete.id); setConfirmDelete(null); showToast('Resource deleted'); }}
        onCancel={() => setConfirmDelete(null)} />
    </div>
  );
}

// ============================================================
// INSTRUCTOR EARNINGS
// ============================================================
export function InstructorEarnings() {
  const { currentUser, courses, payments } = useStore();
  const myCourses = courses.filter(c => c.instructorId === currentUser.id);
  const courseIds = myCourses.map(c => c.id);
  const myPayments = payments.filter(p => courseIds.includes(p.courseId) && p.status === 'completed');
  const grossRevenue = myPayments.reduce((s, p) => s + p.amount, 0);
  const myEarnings = grossRevenue * 0.7;
  const platformFee = grossRevenue * 0.3;
  const paidOut = payments.filter(p => p.type === 'instructor_payout' && p.instructorId === currentUser.id).reduce((s, p) => s + p.amount, 0);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard icon="dollar" label="Gross Revenue" value={`₦${grossRevenue.toLocaleString()}`} color={BRAND.blue} />
        <StatCard icon="dollar" label="My Earnings (70%)" value={`₦${Math.round(myEarnings).toLocaleString()}`} color={BRAND.green} />
        <StatCard icon="dollar" label="Platform Fee (30%)" value={`₦${Math.round(platformFee).toLocaleString()}`} color={BRAND.orange} />
        <StatCard icon="pay" label="Total Paid Out" value={`₦${paidOut.toLocaleString()}`} color={BRAND.purple} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Earnings by Course</h3>
          {myCourses.map(c => {
            const coursePayments = myPayments.filter(p => p.courseId === c.id);
            const total = coursePayments.reduce((s, p) => s + p.amount * 0.7, 0);
            return (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: c.cover, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="book" size={14} color="#fff" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: BRAND.gray400 }}>{coursePayments.length} enrollments</div>
                </div>
                <span style={{ fontWeight: 700, color: BRAND.green, fontSize: 13 }}>₦{Math.round(total).toLocaleString()}</span>
              </div>
            );
          })}
          {myCourses.length === 0 && <EmptyState icon="dollar" title="No courses yet" />}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Payment History</h3>
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {myPayments.length === 0 ? <EmptyState icon="dollar" title="No payments yet" /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {myPayments.map(p => {
                  const course = courses.find(c => c.id === p.courseId);
                  return (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: BRAND.gray50, borderRadius: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: BRAND.green, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course?.title}</div>
                        <div style={{ fontSize: 10, color: BRAND.gray400 }}>{p.date} • {p.method}</div>
                      </div>
                      <span style={{ fontWeight: 700, color: BRAND.green, fontSize: 12, flexShrink: 0 }}>+₦{Math.round(p.amount * 0.7).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// INSTRUCTOR REPORTS
// ============================================================
export function InstructorReports() {
  const { currentUser, courses, payments, users, assignments, attendance } = useStore();
  const myCourses = courses.filter(c => c.instructorId === currentUser.id);
  const courseIds = myCourses.map(c => c.id);
  const myPayments = payments.filter(p => courseIds.includes(p.courseId) && p.status === 'completed');
  const enrolledStudentIds = [...new Set(myPayments.map(p => p.studentId))];

  const studentRows = enrolledStudentIds.map(sid => {
    const student = users[sid];
    const studentPayments = myPayments.filter(p => p.studentId === sid);
    const courseId = studentPayments[0]?.courseId;
    const progress = student?.progress?.[courseId] || 0;
    const allAsgn = assignments.filter(a => courseIds.includes(a.courseId));
    const graded = allAsgn.flatMap(a => (a.submissions || []).filter(s => s.studentId === sid && s.score !== null));
    const avgScore = graded.length > 0 ? Math.round(graded.reduce((acc, s) => {
      const a = allAsgn.find(x => x.submissions?.includes(s));
      return acc + (s.score / (a?.totalScore || 100)) * 100;
    }, 0) / graded.length) : null;
    const attRecords = attendance.filter(a => courseIds.includes(a.courseId)).flatMap(a => Object.entries(a.records).filter(([id]) => id === sid).map(([, v]) => v));
    const attendanceRate = attRecords.length > 0 ? Math.round(attRecords.filter(v => v === 'present').length / attRecords.length * 100) : null;
    return { student, courseId, progress, avgScore, attendanceRate };
  });

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 20 }}>Student Reports</h2>
      <div className="card">
        {studentRows.length === 0 ? <EmptyState icon="report" title="No data yet" message="Reports will appear as students enroll and complete work" /> : (
          <table>
            <thead><tr><th>Student</th><th>Course</th><th>Progress</th><th>Avg Score</th><th>Attendance</th><th>Status</th></tr></thead>
            <tbody>
              {studentRows.map(({ student, courseId, progress, avgScore, attendanceRate }, i) => {
                const course = courses.find(c => c.id === courseId);
                const status = progress >= 80 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started';
                return (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <Avatar name={student?.name} size={30} bg={BRAND.blue} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{student?.name}</div>
                          <div style={{ fontSize: 11, color: BRAND.gray400 }}>{student?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: BRAND.gray600 }}>{course?.title}</td>
                    <td>
                      <div style={{ display: 'flex', align: 'center', gap: 7, minWidth: 110 }}>
                        <Progress value={progress} style={{ flex: 1 }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: BRAND.blue }}>{progress}%</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: avgScore !== null ? (avgScore >= 70 ? BRAND.green : BRAND.orange) : BRAND.gray400 }}>
                      {avgScore !== null ? `${avgScore}%` : '—'}
                    </td>
                    <td style={{ fontWeight: 700, color: attendanceRate !== null ? (attendanceRate >= 75 ? BRAND.green : BRAND.red) : BRAND.gray400 }}>
                      {attendanceRate !== null ? `${attendanceRate}%` : '—'}
                    </td>
                    <td><span className="badge" style={{ background: status === 'Completed' ? BRAND.greenBg : status === 'In Progress' ? BRAND.blueBg : BRAND.gray100, color: status === 'Completed' ? BRAND.green : status === 'In Progress' ? BRAND.blue : BRAND.gray400 }}>{status}</span></td>
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
