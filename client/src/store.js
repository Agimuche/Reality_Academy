import React, { createContext, useContext, useCallback, useReducer, useRef } from 'react';

// ============================================================
// INITIAL DATA
// ============================================================
const INITIAL_USERS = {
  s1: { id:'s1', name:'Chidera Okafor', email:'chidera@email.com', role:'student', password:'student123', phone:'08012345678', address:'Lagos, Nigeria', enrolled:['c1','c3'], progress:{c1:65,c3:30}, joinDate:'Jan 2024', status:'active' },
  s2: { id:'s2', name:'Adaeze Nwosu', email:'adaeze@email.com', role:'student', password:'student123', phone:'08023456789', address:'Abuja, Nigeria', enrolled:['c2'], progress:{c2:80}, joinDate:'Jan 2024', status:'active' },
  s3: { id:'s3', name:'Emeka Eze', email:'emeka@email.com', role:'student', password:'student123', phone:'08034567890', address:'Enugu, Nigeria', enrolled:['c1'], progress:{c1:45}, joinDate:'Feb 2024', status:'active' },
  s4: { id:'s4', name:'Ngozi Obi', email:'ngozi@email.com', role:'student', password:'student123', phone:'08045678901', address:'Port Harcourt, Nigeria', enrolled:['c1','c2'], progress:{c1:90,c2:55}, joinDate:'Feb 2024', status:'active' },
  i1: { id:'i1', name:'Samuel Williams', email:'samuel@reality.edu', role:'instructor', password:'instructor123', phone:'08056789012', bio:'Senior Full-Stack Developer with 8 years experience in React, Node.js and cloud platforms.', courses:['c1','c3'], joinDate:'Dec 2023', status:'active' },
  i2: { id:'i2', name:'Dr. Adaeze Okonkwo', email:'adaeze.i@reality.edu', role:'instructor', password:'instructor123', phone:'08067890123', bio:'Data Scientist & ML Engineer. PhD in Computer Science from UniLag.', courses:['c2'], joinDate:'Dec 2023', status:'active' },
  i3: { id:'i3', name:'Mrs. Blessing Eze', email:'blessing@reality.edu', role:'instructor', password:'instructor123', phone:'08078901234', bio:'Creative Director & Graphic Designer with 10+ years experience.', courses:['c4'], joinDate:'Jan 2024', status:'active' },
  admin: { id:'admin', name:'Admin User', email:'admin@reality.edu', role:'admin', password:'admin123', phone:'08089012345', joinDate:'Nov 2023', status:'active' },
};

const INITIAL_COURSES = [
  { id:'c1', title:'Full-Stack Web Development', category:'Technology', instructorId:'i1', instructor:'Samuel Williams', duration:'12 weeks', price:45000, enrolled:234, rating:4.8, cover:'#4169E1', status:'published', modules:8, lessons:32, description:'Master React, Node.js, Express, MongoDB and deploy production apps.', syllabus:['HTML/CSS Fundamentals','JavaScript ES6+','React & Redux','Node.js & Express','MongoDB & Mongoose','REST APIs','Authentication & Security','Deployment & CI/CD'] },
  { id:'c2', title:'Data Science & Analytics', category:'Technology', instructorId:'i2', instructor:'Dr. Adaeze Okonkwo', duration:'10 weeks', price:38000, enrolled:189, rating:4.9, cover:'#7c3aed', status:'published', modules:6, lessons:24, description:'Python, Pandas, NumPy, Machine Learning and data visualization.', syllabus:['Python Basics','NumPy & Pandas','Data Visualization','Statistics & Probability','Machine Learning','Model Deployment'] },
  { id:'c3', title:'Digital Marketing Mastery', category:'Business', instructorId:'i1', instructor:'Samuel Williams', duration:'8 weeks', price:25000, enrolled:312, rating:4.7, cover:'#ea580c', status:'published', modules:5, lessons:20, description:'SEO, social media marketing, Google Ads, email campaigns and analytics.', syllabus:['SEO Fundamentals','Social Media Strategy','Google Ads','Email Marketing','Analytics & Reporting'] },
  { id:'c4', title:'Graphic Design Fundamentals', category:'Design', instructorId:'i3', instructor:'Mrs. Blessing Eze', duration:'6 weeks', price:20000, enrolled:156, rating:4.6, cover:'#16a34a', status:'draft', modules:4, lessons:16, description:'Adobe Photoshop, Illustrator, brand identity and design principles.', syllabus:['Design Principles','Typography','Color Theory','Photoshop','Illustrator','Brand Identity'] },
  { id:'c5', title:'Data Science / Data Analysis', category:'Technology', instructorId:'i2', instructor:'Dr. Adaeze Okonkwo', duration:'10 weeks', price:36000, enrolled:0, rating:4.8, cover:'#0ea5e9', status:'published', modules:6, lessons:24, description:'Comprehensive data analysis, visualization and reporting.' },
  { id:'c6', title:'Frontend Development', category:'Technology', instructorId:'i1', instructor:'Samuel Williams', duration:'8 weeks', price:30000, enrolled:0, rating:4.7, cover:'#2563eb', status:'published', modules:6, lessons:20, description:'HTML, CSS, JS, React and modern frontend tooling.' },
  { id:'c7', title:'Backend Development', category:'Technology', instructorId:'i1', instructor:'Samuel Williams', duration:'9 weeks', price:32000, enrolled:0, rating:4.7, cover:'#1e293b', status:'published', modules:6, lessons:22, description:'Node.js, Express, Databases, APIs and system design.' },
  { id:'c8', title:'UI/UX Design', category:'Design', instructorId:'i1', instructor:'Samuel Williams', duration:'6 weeks', price:22000, enrolled:0, rating:4.6, cover:'#f97316', status:'published', modules:5, lessons:18, description:'Design thinking, wireframing, prototyping and usability testing.' },
  { id:'c9', title:'Graphics Design', category:'Design', instructorId:'i1', instructor:'Samuel Williams', duration:'6 weeks', price:20000, enrolled:0, rating:4.6, cover:'#16a34a', status:'published', modules:5, lessons:16, description:'Visual design, branding, Illustrator and Photoshop workflows.' },
  { id:'c10', title:'Video Editing', category:'Media', instructorId:'i1', instructor:'Samuel Williams', duration:'6 weeks', price:24000, enrolled:0, rating:4.5, cover:'#ef4444', status:'published', modules:5, lessons:18, description:'Video production, editing, color grading and export workflows.' },
  { id:'c11', title:'AI & Automation', category:'Technology', instructorId:'i2', instructor:'Dr. Adaeze Okonkwo', duration:'8 weeks', price:40000, enrolled:0, rating:4.9, cover:'#7c3aed', status:'published', modules:6, lessons:20, description:'Introduction to AI models, automation pipelines, and tools.' },
  { id:'c12', title:'Cybersecurity', category:'Technology', instructorId:'i1', instructor:'Samuel Williams', duration:'8 weeks', price:35000, enrolled:0, rating:4.6, cover:'#0f766e', status:'published', modules:6, lessons:20, description:'Security fundamentals, penetration testing and best practices.' },
  { id:'c13', title:'Product Management', category:'Business', instructorId:'admin', instructor:'Admin User', duration:'6 weeks', price:28000, enrolled:0, rating:4.5, cover:'#0369a1', status:'published', modules:5, lessons:16, description:'Product strategy, roadmaps, user research and metrics.' },
  { id:'c14', title:'Project Management', category:'Business', instructorId:'admin', instructor:'Admin User', duration:'6 weeks', price:26000, enrolled:0, rating:4.5, cover:'#334155', status:'published', modules:5, lessons:16, description:'Agile, Scrum, planning, risk and stakeholder management.' },
  { id:'c15', title:'Social Media Management', category:'Business', instructorId:'admin', instructor:'Admin User', duration:'4 weeks', price:18000, enrolled:0, rating:4.4, cover:'#fb7185', status:'published', modules:4, lessons:12, description:'Content strategy, scheduling and analytics for social platforms.' },
  { id:'c16', title:'Digital Marketing', category:'Business', instructorId:'i1', instructor:'Samuel Williams', duration:'6 weeks', price:24000, enrolled:0, rating:4.6, cover:'#f97316', status:'published', modules:5, lessons:18, description:'SEO, PPC, email and performance marketing strategies.' },
  { id:'c17', title:'Forex Trading', category:'Finance', instructorId:'admin', instructor:'Admin User', duration:'6 weeks', price:30000, enrolled:0, rating:4.3, cover:'#065f46', status:'published', modules:5, lessons:16, description:'Basics of forex markets, technical analysis and risk management.' },
  { id:'c18', title:'Crypto Trading', category:'Finance', instructorId:'admin', instructor:'Admin User', duration:'6 weeks', price:32000, enrolled:0, rating:4.3, cover:'#0ea5e9', status:'published', modules:6, lessons:18, description:'Cryptocurrency markets, on-chain fundamentals and trading strategies.' },
];

const INITIAL_ASSIGNMENTS = [
  { id:'a1', courseId:'c1', title:'Build a REST API with Node.js', description:'Create a fully functional REST API using Node.js and Express with CRUD operations, authentication and MongoDB integration.', type:'project', dueDate:'2024-03-15', totalScore:100, createdBy:'i1', submissions:[ { studentId:'s4', content:'https://github.com/ngozi/rest-api-project', submittedAt:'2024-03-10 09:30', score:null, feedback:'' }, { studentId:'s3', content:'https://github.com/emeka/node-api', submittedAt:'2024-03-12 14:20', score:85, feedback:'Great work! Clean code and proper error handling. Minor improvements needed in authentication flow.' } ] },
  { id:'a2', courseId:'c1', title:'HTML/CSS & JavaScript Quiz', description:'Test your knowledge of core web fundamentals covered in Modules 1-3.', type:'quiz', dueDate:'2024-03-10', totalScore:50, createdBy:'i1', questions:[ { id:'q1', text:'What does HTML stand for?', options:['HyperText Markup Language','High Text Machine Language','HyperText Machine Language','HyperText Media Language'], correct:0 }, { id:'q2', text:'Which CSS property controls the text size?', options:['font-style','text-size','font-size','text-weight'], correct:2 }, { id:'q3', text:'What is the correct HTML for a line break?', options:['<lb>','<br>','<break>','<newline>'], correct:1 }, { id:'q4', text:'Which JavaScript method adds an element to the end of an array?', options:['push()','pop()','shift()','unshift()'], correct:0 }, { id:'q5', text:'What does CSS stand for?', options:['Cascading Style Sheets','Computer Style Sheets','Creative Style Sheets','Colorful Style Sheets'], correct:0 } ], submissions:[ { studentId:'s1', content:'', answers:{q1:0,q2:2,q3:1,q4:0,q5:0}, submittedAt:'2024-03-08 11:00', score:50, feedback:'Perfect score! Excellent work.' }, { studentId:'s3', content:'', answers:{q1:0,q2:2,q3:1,q4:3,q5:0}, submittedAt:'2024-03-09 16:30', score:40, feedback:'Good effort. Review array methods.' } ] },
  { id:'a3', courseId:'c2', title:'Python Data Analysis Project', description:'Analyze a provided dataset using Pandas. Create at least 5 visualizations and write a summary report.', type:'project', dueDate:'2024-03-20', totalScore:100, createdBy:'i2', submissions:[ { studentId:'s2', content:'Attached: sales_analysis.ipynb + report.pdf', submittedAt:'2024-03-18 10:00', score:92, feedback:'Excellent analysis! Very insightful visualizations. Outstanding work.' } ] },
  { id:'a4', courseId:'c1', title:'React Components Assignment', description:'Build a reusable component library with at least 10 custom React components.', type:'assignment', dueDate:'2024-03-25', totalScore:80, createdBy:'i1', submissions:[] },
];

const INITIAL_RESOURCES = [
  { id:'r1', courseId:'c1', title:'JavaScript ES6+ Complete Guide', type:'pdf', size:'3.2 MB', uploadedBy:'i1', date:'2024-01-15', url:'#' },
  { id:'r2', courseId:'c1', title:'Node.js Setup & Configuration Guide', type:'pdf', size:'1.4 MB', uploadedBy:'i1', date:'2024-01-18', url:'#' },
  { id:'r3', courseId:'c1', title:'React Fundamentals - Lecture 1', type:'video', size:'245 MB', uploadedBy:'i1', date:'2024-01-20', url:'#' },
  { id:'r4', courseId:'c2', title:'Python for Data Science Slides', type:'pdf', size:'4.1 MB', uploadedBy:'i2', date:'2024-01-22', url:'#' },
  { id:'r5', courseId:'c2', title:'Pandas & NumPy Cheatsheet', type:'pdf', size:'0.8 MB', uploadedBy:'i2', date:'2024-01-25', url:'#' },
  { id:'r6', courseId:'c3', title:'SEO Masterclass Materials', type:'zip', size:'12.5 MB', uploadedBy:'i1', date:'2024-02-01', url:'#' },
];

const INITIAL_ATTENDANCE = [
  { id:'att1', courseId:'c1', date:'2024-02-05', topic:'JavaScript Intro', students:{s1:true,s3:true,s4:true} },
  { id:'att2', courseId:'c1', date:'2024-02-12', topic:'React Hooks', students:{s1:true,s3:false,s4:true} },
  { id:'att3', courseId:'c1', date:'2024-02-19', topic:'Node.js Basics', students:{s1:false,s3:true,s4:true} },
  { id:'att4', courseId:'c2', date:'2024-02-06', topic:'Python Intro', students:{s2:true,s4:true} },
  { id:'att5', courseId:'c2', date:'2024-02-13', topic:'Pandas', students:{s2:true,s4:false} },
];

const INITIAL_PAYMENTS = [
  { id:'p1', studentId:'s1', courseId:'c1', amount:45000, date:'2024-01-10', status:'completed', ref:'TRA-24001', instructorId:'i1', method:'Card' },
  { id:'p2', studentId:'s2', courseId:'c2', amount:38000, date:'2024-01-12', status:'completed', ref:'TRA-24002', instructorId:'i2', method:'Transfer' },
  { id:'p3', studentId:'s3', courseId:'c1', amount:45000, date:'2024-01-14', status:'completed', ref:'TRA-24003', instructorId:'i1', method:'Card' },
  { id:'p4', studentId:'s1', courseId:'c3', amount:25000, date:'2024-01-16', status:'completed', ref:'TRA-24004', instructorId:'i1', method:'Card' },
  { id:'p5', studentId:'s4', courseId:'c1', amount:45000, date:'2024-01-18', status:'completed', ref:'TRA-24005', instructorId:'i1', method:'Transfer' },
  { id:'p6', studentId:'s4', courseId:'c2', amount:38000, date:'2024-01-20', status:'pending', ref:'TRA-24006', instructorId:'i2', method:'Card' },
];

const INITIAL_MESSAGES = [
  { id:'m1', from:'i1', to:'s1', text:'Welcome to the Full-Stack Web Development course! Ready to start coding?', time:'09:00 AM', date:'Mon' },
  { id:'m2', from:'s1', to:'i1', text:'Yes! I\'m really excited. I\'ve been learning JavaScript basics already.', time:'09:15 AM', date:'Mon' },
  { id:'m3', from:'i1', to:'s1', text:'That\'s great preparation! We start with ES6+ features this week.', time:'09:20 AM', date:'Mon' },
  { id:'m4', from:'s1', to:'i1', text:'Quick question - do I need to install anything before the first class?', time:'02:30 PM', date:'Mon' },
  { id:'m5', from:'i1', to:'s1', text:'Yes! Please install Node.js v18+, VS Code, and Git. I\'ve uploaded a setup guide in Resources.', time:'02:45 PM', date:'Mon' },
  { id:'m6', from:'i2', to:'s2', text:'Hi Adaeze! How are you finding the Python exercises so far?', time:'10:00 AM', date:'Tue' },
  { id:'m7', from:'s2', to:'i2', text:'They are challenging but very interesting! The Pandas exercises are my favourite.', time:'10:30 AM', date:'Tue' },
];

const INITIAL_NOTIFICATIONS = [
  { id:'n1', text:'Chidera Okafor submitted the REST API assignment', time:'5m ago', read:false, type:'assignment' },
  { id:'n2', text:'New enrollment: Ngozi Obi joined Full-Stack Web Dev', time:'1h ago', read:false, type:'enrollment' },
  { id:'n3', text:'Payment received: ₦45,000 from Emeka Eze', time:'2h ago', read:false, type:'payment' },
  { id:'n4', text:'Dr. Adaeze Okonkwo uploaded new course materials', time:'3h ago', read:true, type:'resource' },
  { id:'n5', text:'Attendance reminder: Full-Stack class at 10 AM tomorrow', time:'5h ago', read:true, type:'attendance' },
];

const INSTRUCTOR_PAYOUTS = [];

// ============================================================
// STORE CONTEXT
// ============================================================
const StoreContext = createContext(null);

const initialState = {
  users: INITIAL_USERS,
  courses: INITIAL_COURSES,
  assignments: INITIAL_ASSIGNMENTS,
  resources: INITIAL_RESOURCES,
  attendance: INITIAL_ATTENDANCE,
  payments: INITIAL_PAYMENTS,
  messages: INITIAL_MESSAGES,
  notifications: INITIAL_NOTIFICATIONS,
  instructorPayouts: INSTRUCTOR_PAYOUTS,
  currentUserId: null,
  toast: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN': return { ...state, currentUserId: action.userId };
    case 'LOGOUT': return { ...state, currentUserId: null };
    case 'SET_TOAST': return { ...state, toast: action.toast };
    case 'CLEAR_TOAST': return { ...state, toast: null };
    case 'UPDATE_USER': return { ...state, users: { ...state.users, [action.id]: { ...state.users[action.id], ...action.updates } } };
    case 'ADD_USER': return { ...state, users: { ...state.users, [action.user.id]: action.user } };
    case 'ADD_COURSE': return { ...state, courses: [...state.courses, action.course] };
    case 'UPDATE_COURSE': return { ...state, courses: state.courses.map(c => c.id === action.id ? { ...c, ...action.updates } : c) };
    case 'DELETE_COURSE': return { ...state, courses: state.courses.filter(c => c.id !== action.id) };
    case 'ENROLL': {
      const user = state.users[action.studentId];
      const enrolled = [...(user.enrolled || [])];
      if (!enrolled.includes(action.courseId)) enrolled.push(action.courseId);
      return {
        ...state,
        users: { ...state.users, [action.studentId]: { ...user, enrolled, progress: { ...(user.progress || {}), [action.courseId]: 0 } } },
        payments: [...state.payments, action.payment],
        courses: state.courses.map(c => c.id === action.courseId ? { ...c, enrolled: (c.enrolled || 0) + 1 } : c),
      };
    }
    case 'UPDATE_PROGRESS': {
      const user = state.users[action.studentId];
      return { ...state, users: { ...state.users, [action.studentId]: { ...user, progress: { ...(user.progress || {}), [action.courseId]: action.progress } } } };
    }
    case 'ADD_MESSAGE': return { ...state, messages: [...state.messages, action.message] };
    case 'ADD_ASSIGNMENT': return { ...state, assignments: [...state.assignments, action.assignment] };
    case 'UPDATE_ASSIGNMENT': return { ...state, assignments: state.assignments.map(a => a.id === action.id ? { ...a, ...action.updates } : a) };
    case 'SUBMIT_ASSIGNMENT': {
      return {
        ...state,
        assignments: state.assignments.map(a => {
          if (a.id !== action.assignmentId) return a;
          const subs = (a.submissions || []).filter(s => s.studentId !== action.studentId);
          return { ...a, submissions: [...subs, action.submission] };
        })
      };
    }
    case 'GRADE_SUBMISSION': {
      return {
        ...state,
        assignments: state.assignments.map(a => {
          if (a.id !== action.assignmentId) return a;
          return { ...a, submissions: a.submissions.map(s => s.studentId === action.studentId ? { ...s, score: action.score, feedback: action.feedback } : s) };
        })
      };
    }
    case 'ADD_RESOURCE': return { ...state, resources: [...state.resources, action.resource] };
    case 'DELETE_RESOURCE': return { ...state, resources: state.resources.filter(r => r.id !== action.id) };
    case 'SAVE_ATTENDANCE': {
      const existing = state.attendance.find(a => a.courseId === action.courseId && a.date === action.date);
      if (existing) {
        return { ...state, attendance: state.attendance.map(a => a.courseId === action.courseId && a.date === action.date ? { ...a, students: action.students, topic: action.topic } : a) };
      }
      return { ...state, attendance: [...state.attendance, { id: `att${Date.now()}`, courseId: action.courseId, date: action.date, topic: action.topic || '', students: action.students }] };
    }
    case 'ADD_PAYOUT': return { ...state, instructorPayouts: [...state.instructorPayouts, action.payout] };
    case 'READ_NOTIFICATIONS': return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
    case 'ADD_NOTIFICATION': return { ...state, notifications: [action.notification, ...state.notifications] };
    default: return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const toastTimer = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    dispatch({ type: 'SET_TOAST', toast: { message, type } });
    toastTimer.current = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 3200);
  }, []);

  const login = useCallback((email, password) => {
    const user = Object.values(state.users).find(u => u.email === email && u.password === password);
    if (user) { dispatch({ type: 'LOGIN', userId: user.id }); return user; }
    return null;
  }, [state.users]);

  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);

  const enrollCourse = useCallback((studentId, courseId, paymentData) => {
    const course = state.courses.find(c => c.id === courseId);
    const payment = { id: `p${Date.now()}`, studentId, courseId, amount: course?.price || 0, date: new Date().toLocaleDateString('en-NG'), status: 'completed', ref: `TRA-${Date.now().toString().slice(-5)}`, instructorId: course?.instructorId, method: paymentData?.method || 'Card' };
    dispatch({ type: 'ENROLL', studentId, courseId, payment });
    dispatch({ type: 'ADD_NOTIFICATION', notification: { id: `n${Date.now()}`, text: `${state.users[studentId]?.name} enrolled in ${course?.title}`, time: 'just now', read: false, type: 'enrollment' } });
    showToast('Enrolled successfully! Welcome to the course. 🎉');
  }, [state.courses, state.users, showToast]);

  const sendMessage = useCallback((from, to, text) => {
    dispatch({ type: 'ADD_MESSAGE', message: { id: `m${Date.now()}`, from, to, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: 'Today' } });
  }, []);

  const submitAssignment = useCallback((assignmentId, studentId, content, answers) => {
    dispatch({ type: 'SUBMIT_ASSIGNMENT', assignmentId, studentId, submission: { studentId, content, answers: answers || {}, submittedAt: new Date().toLocaleString(), score: null, feedback: '' } });
    showToast('Assignment submitted successfully!');
  }, [showToast]);

  const gradeSubmission = useCallback((assignmentId, studentId, score, feedback) => {
    dispatch({ type: 'GRADE_SUBMISSION', assignmentId, studentId, score, feedback });
    showToast('Submission graded and feedback sent!');
  }, [showToast]);

  const uploadResource = useCallback(async (resource) => {
    // If resource.file is a File, attempt to upload to backend via FormData
    if (resource && resource.file instanceof File) {
      try {
        const formData = new FormData();
        formData.append('title', resource.title || resource.file.name);
        formData.append('courseId', resource.courseId || '');
        formData.append('type', resource.type || 'file');
        formData.append('file', resource.file);

        const res = await fetch('/api/v1/resources', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');

        const json = await res.json();
        const created = json.data;
        // Normalize created resource into client store shape
        const shaped = {
          id: created._id || `r${Date.now()}`,
          title: created.title || resource.title || resource.file.name,
          courseId: created.courseId || resource.courseId,
          instructorId: created.instructorId || resource.instructorId,
          type: created.type || resource.type || resource.file.type.split('/')[0] || 'file',
          mimeType: created.mimeType || resource.file.type,
          originalName: created.originalName || resource.file.name,
          url: created.url || created.path || '',
          size: created.size || `${(resource.file.size / 1024 / 1024).toFixed(2)} MB`,
          publicId: created.publicId || null,
          createdAt: created.createdAt || new Date().toISOString(),
        };
        dispatch({ type: 'ADD_RESOURCE', resource: shaped });
        showToast('Resource uploaded successfully!');
        return shaped;
      } catch (error) {
        // fallback to client-only behavior
        console.warn('Upload failed, using offline fallback:', error.message);
      }
    }

    // Fallback: add resource locally (mock)
    dispatch({ type: 'ADD_RESOURCE', resource: { ...resource, id: `r${Date.now()}`, date: new Date().toLocaleDateString('en-NG') } });
    showToast('Resource uploaded (local fallback).');
    return null;
  }, [showToast]);

  const deleteResource = useCallback((id) => {
    dispatch({ type: 'DELETE_RESOURCE', id });
    showToast('Resource deleted.');
  }, [showToast]);

  const saveAttendance = useCallback((courseId, date, topic, students) => {
    dispatch({ type: 'SAVE_ATTENDANCE', courseId, date, topic, students });
    showToast('Attendance saved successfully!');
  }, [showToast]);

  const updateProgress = useCallback((studentId, courseId, progress) => {
    dispatch({ type: 'UPDATE_PROGRESS', studentId, courseId, progress });
  }, []);

  const payInstructor = useCallback((instructorId, amount, note, method) => {
    const instructor = state.users[instructorId];
    dispatch({ type: 'ADD_PAYOUT', payout: { id: `pay${Date.now()}`, instructorId, amount, note, method, date: new Date().toLocaleDateString('en-NG'), status: 'completed', ref: `PAY-${Date.now().toString().slice(-5)}` } });
    showToast(`₦${Number(amount).toLocaleString()} sent to ${instructor?.name}!`);
  }, [state.users, showToast]);

  const updateUser = useCallback((userId, updates) => {
    dispatch({ type: 'UPDATE_USER', id: userId, updates });
    showToast('Profile updated successfully!');
  }, [showToast]);

  const addCourse = useCallback((courseData) => {
    const course = { ...courseData, id: `c${Date.now()}`, enrolled: 0, rating: 0, status: 'draft', modules: 0, lessons: 0 };
    dispatch({ type: 'ADD_COURSE', course });
    showToast('Course created!');
    return course;
  }, [showToast]);

  const updateCourse = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_COURSE', id, updates });
    showToast('Course updated!');
  }, [showToast]);

  const deleteCourse = useCallback((id) => {
    dispatch({ type: 'DELETE_COURSE', id });
    showToast('Course deleted.');
  }, [showToast]);

  const addAssignment = useCallback((assignment) => {
    dispatch({ type: 'ADD_ASSIGNMENT', assignment: { ...assignment, id: `a${Date.now()}`, submissions: [] } });
    showToast('Assignment created!');
  }, [showToast]);

  const readNotifications = useCallback(() => dispatch({ type: 'READ_NOTIFICATIONS' }), []);

  const value = {
    ...state,
    currentUser: state.users[state.currentUserId] || null,
    login, logout, enrollCourse, sendMessage, submitAssignment, gradeSubmission,
    uploadResource, deleteResource, saveAttendance, updateProgress, payInstructor,
    updateUser, addCourse, updateCourse, deleteCourse, addAssignment, readNotifications, showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
