import React, { useState } from 'react';
import { StoreProvider, useStore } from './store';
import { globalCSS } from './styles';
import { AppLayout } from './Layout';
import LoginPage from './LoginPage';
import ChatView from './ChatView';

// Student pages
import { StudentDashboard, MyCourses, BrowseCourses, StudentAssignments, StudentPayments, StudentCertificates } from './StudentPages';

// Instructor pages
import { InstructorDashboard, InstructorCourses, InstructorStudents, InstructorAssignments, InstructorAttendance, InstructorResources, InstructorEarnings, InstructorReports } from './InstructorPages';

// Admin pages
import { AdminDashboard, AdminStudents, AdminInstructors, AdminCourses, AdminPayments, AdminReports, AdminSettings } from './AdminPages';

const PAGE_TITLES = {
  student: {
    dashboard: { title: 'Dashboard', subtitle: 'Your learning overview' },
    'my-courses': { title: 'My Courses', subtitle: 'Continue where you left off' },
    browse: { title: 'Browse Courses', subtitle: 'Explore our course catalog' },
    assignments: { title: 'Assignments', subtitle: 'Submit and track your work' },
    chat: { title: 'Messages', subtitle: 'Connect with instructors and peers' },
    payments: { title: 'Payments', subtitle: 'Your payment history' },
    certificates: { title: 'Certificates', subtitle: 'Your earned achievements' },
  },
  instructor: {
    dashboard: { title: 'Instructor Dashboard', subtitle: 'Manage your teaching' },
    courses: { title: 'My Courses', subtitle: 'Create and manage your courses' },
    students: { title: 'Students', subtitle: 'View enrolled students' },
    assignments: { title: 'Assignments', subtitle: 'Create assignments and grade submissions' },
    attendance: { title: 'Attendance', subtitle: 'Track student attendance' },
    resources: { title: 'Resources', subtitle: 'Upload course materials' },
    chat: { title: 'Messages', subtitle: 'Communicate with students and colleagues' },
    earnings: { title: 'Earnings', subtitle: 'Your revenue and payouts' },
    reports: { title: 'Reports', subtitle: 'Student performance reports' },
  },
  admin: {
    dashboard: { title: 'Admin Dashboard', subtitle: 'Platform overview' },
    students: { title: 'Students', subtitle: 'Manage all students' },
    instructors: { title: 'Instructors', subtitle: 'Manage instructors and payouts' },
    courses: { title: 'Courses', subtitle: 'Manage all courses' },
    payments: { title: 'Payments', subtitle: 'Revenue and transaction history' },
    reports: { title: 'Reports', subtitle: 'Platform analytics' },
    settings: { title: 'Settings', subtitle: 'Configure the platform' },
  },
};

function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  const colors = { success: '#10b981', error: '#ef4444', info: '#4169E1', warning: '#f59e0b' };
  const type = toast.type || 'success';
  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, background: '#fff', borderRadius: 14, padding: '14px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 260, maxWidth: 380, borderLeft: `4px solid ${colors[type]}`, animation: 'fadeIn 0.2s ease' }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${colors[type]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: colors[type], fontWeight: 800, fontSize: 14 }}>
        {type === 'error' ? '✕' : type === 'warning' ? '!' : '✓'}
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.4 }}>{toast.message}</span>
    </div>
  );
}

function MainApp() {
  const { currentUser } = useStore();
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const handleNavigate = (page, courseId = null) => {
    setActivePage(page);
    if (courseId) setSelectedCourseId(courseId);
    else if (page !== 'my-courses') setSelectedCourseId(null);
  };

  if (!currentUser) return <LoginPage />;

  const role = currentUser.role;
  const pageMeta = PAGE_TITLES[role]?.[activePage] || { title: activePage, subtitle: '' };

  const renderPage = () => {
    if (role === 'student') {
      switch (activePage) {
        case 'dashboard': return <StudentDashboard onNavigate={handleNavigate} />;
        case 'my-courses': return <MyCourses selectedCourseId={selectedCourseId} onSelectCourse={(id) => setSelectedCourseId(id)} />;
        case 'browse': return <BrowseCourses />;
        case 'assignments': return <StudentAssignments />;
        case 'chat': return <ChatView />;
        case 'payments': return <StudentPayments />;
        case 'certificates': return <StudentCertificates />;
        default: return <StudentDashboard onNavigate={handleNavigate} />;
      }
    }
    if (role === 'instructor') {
      switch (activePage) {
        case 'dashboard': return <InstructorDashboard />;
        case 'courses': return <InstructorCourses />;
        case 'students': return <InstructorStudents />;
        case 'assignments': return <InstructorAssignments />;
        case 'attendance': return <InstructorAttendance />;
        case 'resources': return <InstructorResources />;
        case 'chat': return <ChatView />;
        case 'earnings': return <InstructorEarnings />;
        case 'reports': return <InstructorReports />;
        default: return <InstructorDashboard />;
      }
    }
    if (role === 'admin') {
      switch (activePage) {
        case 'dashboard': return <AdminDashboard />;
        case 'students': return <AdminStudents />;
        case 'instructors': return <AdminInstructors />;
        case 'courses': return <AdminCourses />;
        case 'payments': return <AdminPayments />;
        case 'reports': return <AdminReports />;
        case 'settings': return <AdminSettings />;
        default: return <AdminDashboard />;
      }
    }
    return null;
  };

  return (
    <AppLayout active={activePage} onNavigate={handleNavigate} title={pageMeta.title} subtitle={pageMeta.subtitle}>
      {renderPage()}
    </AppLayout>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <style>{globalCSS}</style>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; background: #f8f9fa; color: #1a1a2e; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 100px; }
      `}</style>
      <MainApp />
      <Toast />
    </StoreProvider>
  );
}
