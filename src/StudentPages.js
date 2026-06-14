import React, { useState } from 'react';
import { BRAND, COURSE_COLORS } from './constants';
import { Icon, Avatar, Modal, FormField, StatCard, Progress, EmptyState, RealityLogo } from './components';
import { useStore } from './store';

// ============================================================
// STUDENT DASHBOARD
// ============================================================
export function StudentDashboard({ onNavigate }) {
  const { currentUser, courses, assignments, attendance } = useStore();
  const enrolled = currentUser.enrolled || [];
  const myCourses = courses.filter(c => enrolled.includes(c.id));
  const myAssignments = assignments.filter(a => enrolled.includes(a.courseId));
  const pending = myAssignments.filter(a => !a.submissions?.find(s => s.studentId === currentUser.id));
  const graded = myAssignments.filter(a => a.submissions?.find(s => s.studentId === currentUser.id && s.score !== null));
  const avgScore = graded.length > 0 ? Math.round(graded.reduce((acc, a) => { const s = a.submissions.find(x => x.studentId === currentUser.id); return acc + (s.score / a.totalScore) * 100; }, 0) / graded.length) : null;
  const avgProgress = enrolled.length > 0 ? Math.round(Object.values(currentUser.progress || {}).reduce((a, b) => a + b, 0) / enrolled.length) : 0;

  return (
    <div style={{ padding: 24 }}>
      {/* Welcome banner */}
      <div style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blueDark})`, borderRadius: 18, padding: '26px 30px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.12 }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: 21, fontWeight: 800 }}>Welcome back, {currentUser.name.split(' ')[0]}! 👋</h2>
            <p style={{ color: 'rgba(255,255,255,0.82)', marginTop: 6, fontSize: 13 }}>
              {pending.length > 0 ? `You have ${pending.length} pending assignment${pending.length !== 1 ? 's' : ''}. Keep up the great work!` : 'You\'re all caught up. Great job!'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 12, padding: '10px 18px', backdropFilter: 'blur(10px)', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>{enrolled.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>Courses</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 12, padding: '10px 18px', backdropFilter: 'blur(10px)', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>{avgProgress}%</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>Progress</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 12, padding: '10px 18px', backdropFilter: 'blur(10px)', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>{avgScore !== null ? `${avgScore}%` : '—'}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>Avg Score</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard icon="book" label="Enrolled Courses" value={enrolled.length} color={BRAND.blue} />
        <StatCard icon="clipboard" label="Pending Tasks" value={pending.length} color={BRAND.orange} />
        <StatCard icon="check" label="Completed" value={graded.length} color={BRAND.green} />
        <StatCard icon="award" label="Certificates" value={enrolled.filter(cid => (currentUser.progress?.[cid] || 0) >= 80).length} color={BRAND.purple} />
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>My Courses</h3>
      {myCourses.length === 0 ? (
        <EmptyState icon="book" title="No courses yet" message="Browse our catalog and enroll in your first course!" action={
          <button className="btn btn-primary" onClick={() => onNavigate('browse')}><Icon name="search" size={14} /> Browse Courses</button>
        } />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 18, marginBottom: 28 }}>
          {myCourses.map(course => {
            const progress = currentUser.progress?.[course.id] || 0;
            return (
              <div key={course.id} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ height: 7, background: `linear-gradient(90deg, ${course.cover}, ${course.cover}99)` }} />
                <div style={{ padding: '16px 18px' }}>
                  <span className="badge badge-blue">{course.category}</span>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginTop: 8, marginBottom: 4 }}>{course.title}</h4>
                  <p style={{ fontSize: 11, color: BRAND.gray400, marginBottom: 12 }}>{course.instructor}</p>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: BRAND.gray400 }}>Progress</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: BRAND.blue }}>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNavigate('my-courses', course.id)}>
                    <Icon name="play" size={12} /> {progress > 0 ? 'Continue Learning' : 'Start Course'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pending.length > 0 && (
        <>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Pending Assignments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pending.slice(0, 3).map(a => {
              const course = courses.find(c => c.id === a.courseId);
              return (
                <div key={a.id} className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 13, alignItems: 'center' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: BRAND.blueBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={a.type === 'quiz' ? 'clipboard' : 'edit'} size={17} color={BRAND.blue} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: BRAND.gray400 }}>{course?.title} • Due: {a.dueDate}</div>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => onNavigate('assignments')}>Start Now</button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// COURSE DETAIL / LEARNING VIEW
// ============================================================
function CourseDetail({ course, onBack }) {
  const { currentUser, updateProgress, resources, showToast } = useStore();
  const progress = currentUser.progress?.[course.id] || 0;
  const myResources = resources.filter(r => r.courseId === course.id);
  const [activeModule, setActiveModule] = useState(0);

  const handleLessonComplete = () => {
    const newProgress = Math.min(100, progress + Math.round(100 / (course.syllabus?.length || 8)));
    updateProgress(currentUser.id, course.id, newProgress);
    showToast('Lesson marked as complete! 🎉');
  };

  const typeIcons = { pdf: 'file', video: 'video', zip: 'file', doc: 'file' };
  const typeColors = { pdf: BRAND.red, video: BRAND.blue, zip: BRAND.orange, doc: BRAND.purple };

  return (
    <div style={{ padding: 24 }}>
      <button className="btn btn-ghost" style={{ marginBottom: 18 }} onClick={onBack}><Icon name="back" size={15} /> Back to My Courses</button>

      <div style={{ background: `linear-gradient(135deg, ${course.cover}, ${course.cover}cc)`, borderRadius: 18, padding: '28px 30px', marginBottom: 24, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.1 }} />
        <div style={{ position: 'relative' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>{course.category}</span>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>{course.title}</h2>
          <p style={{ marginTop: 6, opacity: 0.85, fontSize: 13, maxWidth: 600 }}>{course.description}</p>
          <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
            <div><div style={{ fontSize: 20, fontWeight: 800 }}>{course.modules}</div><div style={{ fontSize: 11, opacity: 0.8 }}>Modules</div></div>
            <div><div style={{ fontSize: 20, fontWeight: 800 }}>{course.lessons}</div><div style={{ fontSize: 11, opacity: 0.8 }}>Lessons</div></div>
            <div><div style={{ fontSize: 20, fontWeight: 800 }}>{course.duration}</div><div style={{ fontSize: 11, opacity: 0.8 }}>Duration</div></div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, opacity: 0.8 }}>Your Progress</span>
                <span style={{ fontSize: 11, fontWeight: 700 }}>{progress}%</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.25)', borderRadius: 100 }}>
                <div style={{ height: '100%', width: `${progress}%`, background: '#fff', borderRadius: 100, transition: 'width 0.5s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Course Curriculum</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(course.syllabus || []).map((module, i) => {
              const moduleProgress = Math.min(100, Math.max(0, progress - i * (100 / course.syllabus.length)) * (course.syllabus.length));
              const isDone = (i + 1) * (100 / course.syllabus.length) <= progress;
              return (
                <div key={i} style={{ border: `1px solid ${BRAND.gray200}`, borderRadius: 12, overflow: 'hidden' }}>
                  <div onClick={() => setActiveModule(activeModule === i ? -1 : i)}
                    style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: activeModule === i ? BRAND.blueBg : '#fff' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: isDone ? BRAND.greenBg : BRAND.blueBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isDone ? <Icon name="check" size={15} color={BRAND.green} /> : <span style={{ fontWeight: 700, fontSize: 13, color: BRAND.blue }}>{i + 1}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>Module {i + 1}: {module}</div>
                      <div style={{ fontSize: 11, color: BRAND.gray400 }}>{Math.ceil(course.lessons / course.modules)} lessons</div>
                    </div>
                    <Icon name={activeModule === i ? 'chevDown' : 'chevRight'} size={15} color={BRAND.gray400} />
                  </div>
                  {activeModule === i && (
                    <div style={{ padding: '0 16px 16px', background: BRAND.gray50 }}>
                      {Array.from({ length: Math.ceil(course.lessons / course.modules) }).map((_, li) => (
                        <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: li < Math.ceil(course.lessons / course.modules) - 1 ? `1px solid ${BRAND.gray200}` : 'none' }}>
                          <Icon name="play" size={12} color={BRAND.blue} />
                          <span style={{ fontSize: 12, flex: 1 }}>Lesson {li + 1}: {module} - Part {li + 1}</span>
                          <span style={{ fontSize: 11, color: BRAND.gray400 }}>12:30</span>
                        </div>
                      ))}
                      {!isDone && (
                        <button className="btn btn-primary btn-sm" style={{ marginTop: 10 }} onClick={handleLessonComplete}>
                          <Icon name="check" size={12} /> Mark Module Complete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Instructor</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={course.instructor} size={46} bg={BRAND.purple} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{course.instructor}</div>
                <div style={{ fontSize: 11, color: BRAND.gray400 }}>Course Instructor</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Course Resources</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {myResources.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: BRAND.gray50, borderRadius: 8 }}>
                  <Icon name={typeIcons[r.type]} size={15} color={typeColors[r.type]} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                    <div style={{ fontSize: 10, color: BRAND.gray400 }}>{r.size}</div>
                  </div>
                  <Icon name="download" size={13} color={BRAND.gray400} />
                </div>
              ))}
              {myResources.length === 0 && <p style={{ fontSize: 12, color: BRAND.gray400, textAlign: 'center' }}>No resources yet</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MY COURSES
// ============================================================
export function MyCourses({ selectedCourseId, onSelectCourse }) {
  const { currentUser, courses } = useStore();
  const enrolled = currentUser.enrolled || [];
  const myCourses = courses.filter(c => enrolled.includes(c.id));

  const selectedCourse = myCourses.find(c => c.id === selectedCourseId);
  if (selectedCourse) return <CourseDetail course={selectedCourse} onBack={() => onSelectCourse(null)} />;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 20 }}>My Courses</h2>
      {myCourses.length === 0 ? (
        <EmptyState icon="book" title="No courses yet" message="You haven't enrolled in any courses." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 18 }}>
          {myCourses.map(course => {
            const progress = currentUser.progress?.[course.id] || 0;
            return (
              <div key={course.id} className="card card-hover" style={{ overflow: 'hidden' }} onClick={() => onSelectCourse(course.id)}>
                <div style={{ height: 100, background: `linear-gradient(135deg, ${course.cover}, ${course.cover}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="grad" size={36} color="#fff" />
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <span className="badge badge-blue">{course.category}</span>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginTop: 8, marginBottom: 4 }}>{course.title}</h4>
                  <p style={{ fontSize: 11, color: BRAND.gray400, marginBottom: 12 }}>{course.instructor} • {course.duration}</p>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: BRAND.gray400 }}>Progress</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: BRAND.blue }}>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    <Icon name="play" size={12} /> {progress >= 100 ? 'Review Course' : 'Continue Learning'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// BROWSE COURSES & ENROLL/PAY
// ============================================================
export function BrowseCourses() {
  const { courses, currentUser, enrollCourse, showToast } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [enrollModal, setEnrollModal] = useState(null);
  const [payment, setPayment] = useState({ cardNum: '', expiry: '', cvv: '', name: '', method: 'Card' });
  const [processing, setProcessing] = useState(false);

  const categories = ['All', ...new Set(courses.map(c => c.category))];
  const filtered = courses.filter(c =>
    c.status === 'published' &&
    (category === 'All' || c.category === category) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase()))
  );

  const isEnrolled = (id) => (currentUser.enrolled || []).includes(id);

  const handleEnrollClick = (course) => {
    if (isEnrolled(course.id)) { showToast('You are already enrolled in this course!', 'error'); return; }
    setEnrollModal(course);
    setPayment({ cardNum: '', expiry: '', cvv: '', name: '', method: 'Card' });
  };

  const completePayment = () => {
    if (payment.method === 'Card') {
      if (payment.cardNum.replace(/\s/g, '').length < 16) { showToast('Please enter a valid 16-digit card number', 'error'); return; }
      if (!payment.expiry || !payment.cvv) { showToast('Please fill in all card details', 'error'); return; }
      if (!payment.name.trim()) { showToast('Please enter the cardholder name', 'error'); return; }
    }
    setProcessing(true);
    setTimeout(() => {
      enrollCourse(currentUser.id, enrollModal.id, payment);
      setEnrollModal(null);
      setProcessing(false);
    }, 1200);
  };

  const formatCard = (val) => val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
          <Icon name="search" size={15} color={BRAND.gray400} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
          <input className="input" style={{ paddingLeft: 38 }} placeholder="Search courses or instructors..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} className={`tab ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>{cat}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 18 }}>
        {filtered.map(course => (
          <div key={course.id} className="card card-hover" style={{ overflow: 'hidden' }}>
            <div style={{ height: 110, background: `linear-gradient(135deg, ${course.cover}, ${course.cover}99)`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="grad" size={36} color="#fff" />
              <div style={{ position: 'absolute', top: 10, right: 10 }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', backdropFilter: 'blur(4px)' }}>{course.category}</span>
              </div>
            </div>
            <div style={{ padding: '16px 18px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{course.title}</h3>
              <p style={{ fontSize: 11, color: BRAND.gray400, marginBottom: 10 }}>{course.instructor} • {course.duration}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: BRAND.blue }}>₦{course.price.toLocaleString()}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon name="star" size={12} color="#f59e0b" />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{course.rating || 'New'}</span>
                  <span style={{ fontSize: 11, color: BRAND.gray400 }}>({course.enrolled})</span>
                </div>
              </div>
              {isEnrolled(course.id) ? (
                <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} disabled>
                  <Icon name="check" size={13} /> Enrolled
                </button>
              ) : (
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleEnrollClick(course)}>
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ gridColumn: '1/-1' }}><EmptyState icon="search" title="No courses found" message="Try adjusting your search or filters" /></div>}
      </div>

      {/* Enrollment / Payment Modal */}
      <Modal open={!!enrollModal} onClose={() => !processing && setEnrollModal(null)} title="Enroll & Make Payment">
        {enrollModal && (
          <div>
            <div style={{ background: BRAND.blueBg, borderRadius: 12, padding: 16, marginBottom: 22, display: 'flex', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: enrollModal.cover, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="grad" size={22} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{enrollModal.title}</div>
                <div style={{ fontSize: 12, color: BRAND.gray500 }}>{enrollModal.instructor} • {enrollModal.duration}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: BRAND.blue, marginTop: 4 }}>₦{enrollModal.price.toLocaleString()}</div>
              </div>
            </div>

            <FormField label="Payment Method">
              <div style={{ display: 'flex', gap: 8 }}>
                {['Card', 'Transfer'].map(m => (
                  <button key={m} className={`tab ${payment.method === m ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setPayment({ ...payment, method: m })}>
                    {m === 'Card' ? '💳 Card' : '🏦 Bank Transfer'}
                  </button>
                ))}
              </div>
            </FormField>

            {payment.method === 'Card' ? (
              <>
                <FormField label="Card Number" required>
                  <input className="input" placeholder="1234 5678 9012 3456" value={payment.cardNum} onChange={e => setPayment({ ...payment, cardNum: formatCard(e.target.value) })} maxLength={19} />
                </FormField>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <FormField label="Expiry Date" required><input className="input" placeholder="MM/YY" value={payment.expiry} onChange={e => setPayment({ ...payment, expiry: e.target.value })} maxLength={5} /></FormField>
                  <FormField label="CVV" required><input className="input" placeholder="123" value={payment.cvv} onChange={e => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g,'') })} maxLength={3} /></FormField>
                </div>
                <FormField label="Cardholder Name" required><input className="input" placeholder="Full name" value={payment.name} onChange={e => setPayment({ ...payment, name: e.target.value })} /></FormField>
              </>
            ) : (
              <div style={{ background: BRAND.gray50, borderRadius: 10, padding: 16, marginBottom: 18, fontSize: 13 }}>
                <p style={{ marginBottom: 8 }}><strong>Bank Name:</strong> Reality Academy MFB</p>
                <p style={{ marginBottom: 8 }}><strong>Account Number:</strong> 0123456789</p>
                <p style={{ marginBottom: 8 }}><strong>Account Name:</strong> The Reality Academy Ltd</p>
                <p style={{ color: BRAND.gray400, fontSize: 12, marginTop: 10 }}>Click "Confirm Payment" once you've made the transfer. Your enrollment will be activated automatically.</p>
              </div>
            )}

            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={completePayment} disabled={processing}>
              {processing ? 'Processing...' : <><Icon name="pay" size={15} /> {payment.method === 'Card' ? `Pay ₦${enrollModal.price.toLocaleString()}` : 'Confirm Payment'} & Enroll</>}
            </button>
            <div style={{ marginTop: 12, textAlign: 'center', fontSize: 11, color: BRAND.gray400, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <Icon name="lock" size={11} /> Secured by Reality Academy Payment Gateway
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============================================================
// STUDENT ASSIGNMENTS & QUIZZES
// ============================================================
export function StudentAssignments() {
  const { currentUser, assignments, courses, submitAssignment } = useStore();
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [textAnswer, setTextAnswer] = useState('');
  const [filter, setFilter] = useState('all');

  const enrolled = currentUser.enrolled || [];
  const myAssignments = assignments.filter(a => enrolled.includes(a.courseId));

  const getStatus = (a) => {
    const sub = a.submissions?.find(s => s.studentId === currentUser.id);
    if (!sub) return 'pending';
    if (sub.score !== null && sub.score !== undefined) return 'graded';
    return 'submitted';
  };

  const filtered = myAssignments.filter(a => filter === 'all' || getStatus(a) === filter);

  const startAssignment = (a) => { setSelected(a); setAnswers({}); setTextAnswer(''); };

  const handleSubmit = () => {
    if (selected.type === 'quiz') {
      const unanswered = selected.questions.filter(q => answers[q.id] === undefined);
      if (unanswered.length > 0) return;
      submitAssignment(selected.id, currentUser.id, '', answers);
    } else {
      if (!textAnswer.trim()) return;
      submitAssignment(selected.id, currentUser.id, textAnswer, {});
    }
  };

  if (selected) {
    const sub = selected.submissions?.find(s => s.studentId === currentUser.id);
    if (sub) {
      let quizScore = null;
      if (selected.type === 'quiz' && sub.score === null) {
        // auto-grade quiz
        quizScore = selected.questions.reduce((acc, q) => acc + (sub.answers?.[q.id] === q.correct ? (selected.totalScore / selected.questions.length) : 0), 0);
      }
      return (
        <div style={{ padding: 24 }}>
          <button className="btn btn-ghost" style={{ marginBottom: 18 }} onClick={() => setSelected(null)}><Icon name="back" size={15} /> Back to Assignments</button>
          <div className="card" style={{ padding: 40, textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: BRAND.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon name="check" size={28} color={BRAND.green} />
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 800, marginBottom: 6 }}>Submitted Successfully!</h3>
            <p style={{ color: BRAND.gray400, fontSize: 13, marginBottom: 22 }}>Submitted on {sub.submittedAt}</p>
            {(sub.score !== null || quizScore !== null) && (
              <div style={{ background: BRAND.blueBg, borderRadius: 14, padding: 22, display: 'inline-block', minWidth: 200 }}>
                <div style={{ fontSize: 38, fontWeight: 900, color: BRAND.blue }}>{sub.score !== null ? sub.score : Math.round(quizScore)}/{selected.totalScore}</div>
                <div style={{ fontSize: 12, color: BRAND.gray400, marginTop: 4 }}>{sub.score !== null ? 'Your Score' : 'Auto-graded Score'}</div>
                {sub.feedback && <p style={{ marginTop: 12, fontSize: 12, color: BRAND.gray600, fontStyle: 'italic', borderTop: `1px solid ${BRAND.gray200}`, paddingTop: 10 }}>"{sub.feedback}"</p>}
              </div>
            )}
            {sub.score === null && quizScore === null && (
              <div className="badge badge-yellow" style={{ fontSize: 13, padding: '8px 16px' }}>⏳ Awaiting instructor review</div>
            )}
            <div style={{ marginTop: 24 }}><button className="btn btn-outline" onClick={() => setSelected(null)}>Back to Assignments</button></div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: 24 }}>
        <button className="btn btn-ghost" style={{ marginBottom: 18 }} onClick={() => setSelected(null)}><Icon name="back" size={15} /> Back</button>
        <div className="card" style={{ padding: 26, maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 style={{ fontSize: 19, fontWeight: 800 }}>{selected.title}</h2>
              <p style={{ color: BRAND.gray400, fontSize: 13, marginTop: 4 }}>{selected.description}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="badge badge-blue">{selected.totalScore} pts</span>
              <span className="badge badge-orange">Due {selected.dueDate}</span>
            </div>
          </div>

          {selected.type === 'quiz' ? (
            <div>
              {selected.questions.map((q, qi) => (
                <div key={q.id} style={{ marginBottom: 20, padding: 18, background: BRAND.gray50, borderRadius: 12 }}>
                  <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>{qi + 1}. {q.text}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {q.options.map((opt, oi) => (
                      <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', borderRadius: 8, border: `2px solid ${answers[q.id] === oi ? BRAND.blue : BRAND.gray200}`, background: answers[q.id] === oi ? BRAND.blueBg : '#fff', transition: 'all 0.15s' }}>
                        <input type="radio" name={q.id} checked={answers[q.id] === oi} onChange={() => setAnswers(prev => ({ ...prev, [q.id]: oi }))} />
                        <span style={{ fontSize: 13 }}>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <p style={{ fontSize: 12, color: BRAND.gray400, marginBottom: 12 }}>{Object.keys(answers).length} of {selected.questions.length} questions answered</p>
            </div>
          ) : (
            <FormField label="Your Submission" required hint="Paste a link (GitHub, Drive, etc.) or write your response directly">
              <textarea className="input" style={{ minHeight: 180 }} placeholder="Write your submission here..." value={textAnswer} onChange={e => setTextAnswer(e.target.value)} />
            </FormField>
          )}

          <button className="btn btn-primary btn-lg" style={{ marginTop: 8 }} onClick={handleSubmit}
            disabled={selected.type === 'quiz' ? Object.keys(answers).length < selected.questions.length : !textAnswer.trim()}>
            <Icon name="send" size={15} /> Submit {selected.type === 'quiz' ? 'Quiz' : 'Assignment'}
          </button>
        </div>
      </div>
    );
  }

  const counts = { all: myAssignments.length, pending: myAssignments.filter(a => getStatus(a) === 'pending').length, submitted: myAssignments.filter(a => getStatus(a) === 'submitted').length, graded: myAssignments.filter(a => getStatus(a) === 'graded').length };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'pending', 'submitted', 'graded'].map(f => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>
            {f} {counts[f] > 0 && `(${counts[f]})`}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {filtered.map(a => {
          const status = getStatus(a);
          const course = courses.find(c => c.id === a.courseId);
          const sub = a.submissions?.find(s => s.studentId === currentUser.id);
          return (
            <div key={a.id} className="card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', flex: 1, minWidth: 240 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: BRAND.blueBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={a.type === 'quiz' ? 'clipboard' : 'edit'} size={20} color={BRAND.blue} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: BRAND.gray400, marginTop: 2 }}>{course?.title} • Due {a.dueDate} • {a.totalScore} pts</div>
                  {status === 'graded' && sub?.score !== null && <div style={{ fontSize: 12, color: BRAND.green, fontWeight: 600, marginTop: 2 }}>Score: {sub.score}/{a.totalScore}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="badge" style={{ background: status === 'graded' ? BRAND.greenBg : status === 'submitted' ? BRAND.yellowBg : BRAND.orangeBg, color: status === 'graded' ? BRAND.green : status === 'submitted' ? BRAND.yellow : BRAND.orange }}>
                  {status === 'graded' ? '✓ Graded' : status === 'submitted' ? 'Submitted' : 'Pending'}
                </span>
                <button className={`btn ${status === 'pending' ? 'btn-primary' : 'btn-outline'} btn-sm`} onClick={() => startAssignment(a)}>
                  {status === 'pending' ? 'Start' : 'View'}
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <EmptyState icon="clipboard" title="Nothing here" message="No assignments match this filter" />}
      </div>
    </div>
  );
}

// ============================================================
// STUDENT PAYMENTS
// ============================================================
export function StudentPayments() {
  const { currentUser, payments, courses } = useStore();
  const myPayments = payments.filter(p => p.studentId === currentUser.id);
  const total = myPayments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard icon="dollar" label="Total Paid" value={`₦${total.toLocaleString()}`} color={BRAND.blue} />
        <StatCard icon="check" label="Completed" value={myPayments.filter(p => p.status === 'completed').length} color={BRAND.green} />
        <StatCard icon="clock" label="Pending" value={myPayments.filter(p => p.status === 'pending').length} color={BRAND.orange} />
      </div>
      <div className="card">
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BRAND.gray100}`, fontWeight: 700, fontSize: 14 }}>Payment History</div>
        {myPayments.length === 0 ? <EmptyState icon="pay" title="No payments yet" /> : (
          <table>
            <thead><tr><th>Course</th><th>Amount</th><th>Method</th><th>Date</th><th>Reference</th><th>Status</th></tr></thead>
            <tbody>
              {myPayments.map(p => {
                const course = courses.find(c => c.id === p.courseId);
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{course?.title}</td>
                    <td style={{ fontWeight: 700, color: BRAND.blue }}>₦{p.amount.toLocaleString()}</td>
                    <td style={{ color: BRAND.gray500 }}>{p.method}</td>
                    <td style={{ color: BRAND.gray400 }}>{p.date}</td>
                    <td><code style={{ fontSize: 11, background: BRAND.gray100, padding: '2px 6px', borderRadius: 4 }}>{p.ref}</code></td>
                    <td><span className={`badge ${p.status === 'completed' ? 'badge-green' : 'badge-orange'}`}>{p.status}</span></td>
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
// STUDENT CERTIFICATES
// ============================================================
export function StudentCertificates() {
  const { currentUser, courses } = useStore();
  const completed = (currentUser.enrolled || []).map(cid => courses.find(c => c.id === cid)).filter(c => c && (currentUser.progress?.[c.id] || 0) >= 80);
  const inProgress = (currentUser.enrolled || []).map(cid => courses.find(c => c.id === cid)).filter(c => c && (currentUser.progress?.[c.id] || 0) < 80);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 20 }}>My Certificates</h2>
      {completed.length === 0 ? (
        <EmptyState icon="award" title="No certificates yet" message="Complete at least 80% of a course to earn your certificate" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px,1fr))', gap: 22, marginBottom: 28 }}>
          {completed.map(c => (
            <div key={c.id} style={{ background: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.blueDark} 100%)`, borderRadius: 18, padding: 28, position: 'relative', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.15)' }}>
              <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.08 }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
                  <RealityLogo scale={0.55} white />
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>CERTIFIED</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>This is to certify that</p>
                <h3 style={{ color: '#fff', fontSize: 19, fontWeight: 800, marginBottom: 4 }}>{currentUser.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 18 }}>has successfully completed the course</p>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 16px', marginBottom: 18 }}>
                  <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{c.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 }}>{c.duration} • {c.modules} Modules</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>Issued by</p>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>The Reality Academy</p>
                  </div>
                  <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                    <Icon name="download" size={12} /> Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {inProgress.length > 0 && (
        <>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>In Progress</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 16 }}>
            {inProgress.map(c => {
              const progress = currentUser.progress?.[c.id] || 0;
              return (
                <div key={c.id} className="card" style={{ padding: 18 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{c.title}</h4>
                  <Progress value={progress} />
                  <p style={{ fontSize: 11, color: BRAND.gray400, marginTop: 8 }}>{progress}% complete • Need 80% to earn certificate</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
