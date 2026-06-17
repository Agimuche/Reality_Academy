require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Course = require('./models/Course');
const Assignment = require('./models/Assignment');
const Payment = require('./models/Payment');
const Message = require('./models/Message');

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany(),
      Course.deleteMany(),
      Assignment.deleteMany(),
      Payment.deleteMany(),
      Message.deleteMany(),
    ]);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@reality.edu',
      password: 'admin123',
      role: 'admin',
      phone: '08089012345',
      address: 'Lagos, Nigeria',
      joinDate: new Date('2023-11-01'),
    });

    const instructor1 = await User.create({
      name: 'Samuel Williams',
      email: 'samuel@reality.edu',
      password: 'instructor123',
      role: 'instructor',
      phone: '08056789012',
      bio: 'Senior Full-Stack Developer with 8 years experience in React, Node.js and cloud platforms.',
      joinDate: new Date('2023-12-10'),
    });

    const instructor2 = await User.create({
      name: 'Dr. Adaeze Okonkwo',
      email: 'adaeze.i@reality.edu',
      password: 'instructor123',
      role: 'instructor',
      phone: '08067890123',
      bio: 'Data Scientist & ML Engineer. PhD in Computer Science from UniLag.',
      joinDate: new Date('2023-12-12'),
    });

    const student1 = await User.create({
      name: 'Chidera Okafor',
      email: 'chidera@email.com',
      password: 'student123',
      role: 'student',
      phone: '08012345678',
      address: 'Lagos, Nigeria',
      joinDate: new Date('2024-01-05'),
    });

    const student2 = await User.create({
      name: 'Adaeze Nwosu',
      email: 'adaeze@email.com',
      password: 'student123',
      role: 'student',
      phone: '08023456789',
      address: 'Abuja, Nigeria',
      joinDate: new Date('2024-01-10'),
    });

    const student3 = await User.create({
      name: 'Emeka Eze',
      email: 'emeka@email.com',
      password: 'student123',
      role: 'student',
      phone: '08034567890',
      address: 'Enugu, Nigeria',
      joinDate: new Date('2024-01-15'),
    });

    const [course1, course2, course3] = await Course.create([
      {
        title: 'Full-Stack Web Development',
        description: 'Master React, Node.js, Express, MongoDB and deploy production apps.',
        category: 'Technology',
        price: 45000,
        duration: '12 weeks',
        modules: 8,
        lessons: 32,
        status: 'published',
        instructorId: instructor1._id,
        instructor: instructor1.name,
        cover: '#4169E1',
        rating: 4.8,
        syllabus: ['HTML/CSS Fundamentals', 'JavaScript ES6+', 'React & Redux', 'Node.js & Express', 'MongoDB & Mongoose', 'REST APIs', 'Authentication & Security', 'Deployment & CI/CD'],
      },
      {
        title: 'Data Science & Analytics',
        description: 'Python, Pandas, NumPy, Machine Learning and data visualization.',
        category: 'Technology',
        price: 38000,
        duration: '10 weeks',
        modules: 6,
        lessons: 24,
        status: 'published',
        instructorId: instructor2._id,
        instructor: instructor2.name,
        cover: '#7c3aed',
        rating: 4.9,
        syllabus: ['Python Basics', 'NumPy & Pandas', 'Data Visualization', 'Statistics & Probability', 'Machine Learning', 'Model Deployment'],
      },
      {
        title: 'Digital Marketing Mastery',
        description: 'SEO, social media marketing, Google Ads, email campaigns and analytics.',
        category: 'Business',
        price: 25000,
        duration: '8 weeks',
        modules: 5,
        lessons: 20,
        status: 'published',
        instructorId: instructor1._id,
        instructor: instructor1.name,
        cover: '#ea580c',
        rating: 4.7,
        syllabus: ['SEO Fundamentals', 'Social Media Strategy', 'Google Ads', 'Email Marketing', 'Analytics & Reporting'],
      },
    ]);

    // Additional courses requested by user
    await Course.create([
      { title: 'Data Science / Data Analysis', description: 'Comprehensive data analysis, visualization and reporting.', category: 'Technology', price: 36000, duration: '10 weeks', modules: 6, lessons: 24, status: 'published', instructorId: instructor2._id, instructor: instructor2.name, cover: '#0ea5e9', rating: 4.8, syllabus: ['Data Cleaning','Exploratory Data Analysis','Visualization','Statistics','Reporting'] },
      { title: 'Frontend Development', description: 'HTML, CSS, JS, React and modern frontend tooling.', category: 'Technology', price: 30000, duration: '8 weeks', modules: 6, lessons: 20, status: 'published', instructorId: instructor1._id, instructor: instructor1.name, cover: '#2563eb', rating: 4.7 },
      { title: 'Backend Development', description: 'Node.js, Express, Databases, APIs and system design.', category: 'Technology', price: 32000, duration: '9 weeks', modules: 6, lessons: 22, status: 'published', instructorId: instructor1._id, instructor: instructor1.name, cover: '#1e293b', rating: 4.7 },
      { title: 'UI/UX Design', description: 'Design thinking, wireframing, prototyping and usability testing.', category: 'Design', price: 22000, duration: '6 weeks', modules: 5, lessons: 18, status: 'published', instructorId: instructor1._id, instructor: instructor1.name, cover: '#f97316', rating: 4.6 },
      { title: 'Graphics Design', description: 'Visual design, branding, Illustrator and Photoshop workflows.', category: 'Design', price: 20000, duration: '6 weeks', modules: 5, lessons: 16, status: 'published', instructorId: instructor1._id, instructor: instructor1.name, cover: '#16a34a', rating: 4.6 },
      { title: 'Video Editing', description: 'Video production, editing, color grading and export workflows.', category: 'Media', price: 24000, duration: '6 weeks', modules: 5, lessons: 18, status: 'published', instructorId: instructor1._id, instructor: instructor1.name, cover: '#ef4444', rating: 4.5 },
      { title: 'AI & Automation', description: 'Introduction to AI models, automation pipelines, and tools.', category: 'Technology', price: 40000, duration: '8 weeks', modules: 6, lessons: 20, status: 'published', instructorId: instructor2._id, instructor: instructor2.name, cover: '#7c3aed', rating: 4.9 },
      { title: 'Cybersecurity', description: 'Security fundamentals, penetration testing and best practices.', category: 'Technology', price: 35000, duration: '8 weeks', modules: 6, lessons: 20, status: 'published', instructorId: instructor1._id, instructor: instructor1.name, cover: '#0f766e', rating: 4.6 },
      { title: 'Product Management', description: 'Product strategy, roadmaps, user research and metrics.', category: 'Business', price: 28000, duration: '6 weeks', modules: 5, lessons: 16, status: 'published', instructorId: admin._id, instructor: admin.name, cover: '#0369a1', rating: 4.5 },
      { title: 'Project Management', description: 'Agile, Scrum, planning, risk and stakeholder management.', category: 'Business', price: 26000, duration: '6 weeks', modules: 5, lessons: 16, status: 'published', instructorId: admin._id, instructor: admin.name, cover: '#334155', rating: 4.5 },
      { title: 'Social Media Management', description: 'Content strategy, scheduling and analytics for social platforms.', category: 'Business', price: 18000, duration: '4 weeks', modules: 4, lessons: 12, status: 'published', instructorId: admin._id, instructor: admin.name, cover: '#fb7185', rating: 4.4 },
      { title: 'Digital Marketing', description: 'SEO, PPC, email and performance marketing strategies.', category: 'Business', price: 24000, duration: '6 weeks', modules: 5, lessons: 18, status: 'published', instructorId: instructor1._id, instructor: instructor1.name, cover: '#f97316', rating: 4.6 },
      { title: 'Forex Trading', description: 'Basics of forex markets, technical analysis and risk management.', category: 'Finance', price: 30000, duration: '6 weeks', modules: 5, lessons: 16, status: 'published', instructorId: admin._id, instructor: admin.name, cover: '#065f46', rating: 4.3 },
      { title: 'Crypto Trading', description: 'Cryptocurrency markets, on-chain fundamentals and trading strategies.', category: 'Finance', price: 32000, duration: '6 weeks', modules: 6, lessons: 18, status: 'published', instructorId: admin._id, instructor: admin.name, cover: '#0ea5e9', rating: 4.3 },
    ]);

    await student1.updateOne({ enrolled: [course1._id, course3._id], progress: { [course1._id]: 65, [course3._id]: 30 } });
    await student2.updateOne({ enrolled: [course2._id], progress: { [course2._id]: 80 } });
    await student3.updateOne({ enrolled: [course1._id], progress: { [course1._id]: 45 } });

    await Assignment.create([
      {
        title: 'Build a REST API with Node.js',
        description: 'Create a fully functional REST API using Node.js and Express with CRUD operations, authentication and MongoDB integration.',
        courseId: course1._id,
        instructorId: instructor1._id,
        type: 'project',
        dueDate: new Date('2024-03-15'),
        totalScore: 100,
      },
      {
        title: 'HTML/CSS & JavaScript Quiz',
        description: 'Test your knowledge of core web fundamentals covered in Modules 1-3.',
        courseId: course1._id,
        instructorId: instructor1._id,
        type: 'quiz',
        dueDate: new Date('2024-03-10'),
        totalScore: 50,
        questions: [
          { id: 'q1', text: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Text Machine Language', 'HyperText Machine Language', 'HyperText Media Language'], correct: 0 },
          { id: 'q2', text: 'Which CSS property controls the text size?', options: ['font-style', 'text-size', 'font-size', 'text-weight'], correct: 2 },
          { id: 'q3', text: 'What is the correct HTML for a line break?', options: ['<lb>', '<br>', '<break>', '<newline>'], correct: 1 },
          { id: 'q4', text: 'Which JavaScript method adds an element to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correct: 0 },
          { id: 'q5', text: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], correct: 0 },
        ],
      },
    ]);

    await Payment.create([
      { studentId: student1._id, courseId: course1._id, amount: 45000, method: 'Card', status: 'completed', ref: 'TRA-24001', instructorId: instructor1._id },
      { studentId: student2._id, courseId: course2._id, amount: 38000, method: 'Card', status: 'completed', ref: 'TRA-24002', instructorId: instructor2._id },
      { studentId: student3._id, courseId: course1._id, amount: 45000, method: 'Card', status: 'completed', ref: 'TRA-24003', instructorId: instructor1._id },
    ]);

    await Message.create([
      { from: instructor1._id, to: student1._id, text: 'Welcome to the Full-Stack Web Development course! Ready to start coding?' },
      { from: student1._id, to: instructor1._id, text: 'Yes! I’m really excited. I’ve been learning JavaScript basics already.' },
      { from: instructor1._id, to: student1._id, text: 'That’s great preparation! We start with ES6+ features this week.' },
    ]);

    // Additional courses requested by user
    await Course.create([
      { title: 'Data Science / Data Analysis', description: 'Comprehensive data analysis, visualization and reporting.', category: 'Technology', price: 36000, duration: '10 weeks', modules: 6, lessons: 24, status: 'published', instructorId: instructor2._id, instructor: instructor2.name, cover: '#0ea5e9', rating: 4.8, syllabus: ['Data Cleaning','Exploratory Data Analysis','Visualization','Statistics','Reporting'] },
      { title: 'Frontend Development', description: 'HTML, CSS, JS, React and modern frontend tooling.', category: 'Technology', price: 30000, duration: '8 weeks', modules: 6, lessons: 20, status: 'published', instructorId: instructor1._id, instructor: instructor1.name, cover: '#2563eb', rating: 4.7 },
      { title: 'Backend Development', description: 'Node.js, Express, Databases, APIs and system design.', category: 'Technology', price: 32000, duration: '9 weeks', modules: 6, lessons: 22, status: 'published', instructorId: instructor1._id, instructor: instructor1.name, cover: '#1e293b', rating: 4.7 },
      { title: 'UI/UX Design', description: 'Design thinking, wireframing, prototyping and usability testing.', category: 'Design', price: 22000, duration: '6 weeks', modules: 5, lessons: 18, status: 'published', instructorId: instructor1._id, instructor: instructor1.name, cover: '#f97316', rating: 4.6 },
      { title: 'Graphics Design', description: 'Visual design, branding, Illustrator and Photoshop workflows.', category: 'Design', price: 20000, duration: '6 weeks', modules: 5, lessons: 16, status: 'published', instructorId: instructor1._id, instructor: instructor1.name, cover: '#16a34a', rating: 4.6 },
      { title: 'Video Editing', description: 'Video production, editing, color grading and export workflows.', category: 'Media', price: 24000, duration: '6 weeks', modules: 5, lessons: 18, status: 'published', instructorId: instructor1._id, instructor: instructor1.name, cover: '#ef4444', rating: 4.5 },
      { title: 'AI & Automation', description: 'Introduction to AI models, automation pipelines, and tools.', category: 'Technology', price: 40000, duration: '8 weeks', modules: 6, lessons: 20, status: 'published', instructorId: instructor2._id, instructor: instructor2.name, cover: '#7c3aed', rating: 4.9 },
      { title: 'Cybersecurity', description: 'Security fundamentals, penetration testing and best practices.', category: 'Technology', price: 35000, duration: '8 weeks', modules: 6, lessons: 20, status: 'published', instructorId: instructor1._id, instructor: instructor1.name, cover: '#0f766e', rating: 4.6 },
      { title: 'Product Management', description: 'Product strategy, roadmaps, user research and metrics.', category: 'Business', price: 28000, duration: '6 weeks', modules: 5, lessons: 16, status: 'published', instructorId: admin._id, instructor: admin.name, cover: '#0369a1', rating: 4.5 },
      { title: 'Project Management', description: 'Agile, Scrum, planning, risk and stakeholder management.', category: 'Business', price: 26000, duration: '6 weeks', modules: 5, lessons: 16, status: 'published', instructorId: admin._id, instructor: admin.name, cover: '#334155', rating: 4.5 },
      { title: 'Social Media Management', description: 'Content strategy, scheduling and analytics for social platforms.', category: 'Business', price: 18000, duration: '4 weeks', modules: 4, lessons: 12, status: 'published', instructorId: admin._id, instructor: admin.name, cover: '#fb7185', rating: 4.4 },
      { title: 'Digital Marketing', description: 'SEO, PPC, email and performance marketing strategies.', category: 'Business', price: 24000, duration: '6 weeks', modules: 5, lessons: 18, status: 'published', instructorId: instructor1._id, instructor: instructor1.name, cover: '#f97316', rating: 4.6 },
      { title: 'Forex Trading', description: 'Basics of forex markets, technical analysis and risk management.', category: 'Finance', price: 30000, duration: '6 weeks', modules: 5, lessons: 16, status: 'published', instructorId: admin._id, instructor: admin.name, cover: '#065f46', rating: 4.3 },
      { title: 'Crypto Trading', description: 'Cryptocurrency markets, on-chain fundamentals and trading strategies.', category: 'Finance', price: 32000, duration: '6 weeks', modules: 6, lessons: 18, status: 'published', instructorId: admin._id, instructor: admin.name, cover: '#0ea5e9', rating: 4.3 },
    ]);

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
require('dotenv').config();
const mongoose = require('mongoose');
const faker = require('faker');
const connectDB = require('./config/db');
const User = require('./models/User');
const Course = require('./models/Course');
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');
const Resource = require('./models/Resource');
const Attendance = require('./models/Attendance');
const Payment = require('./models/Payment');
const Message = require('./models/Message');
const Notification = require('./models/Notification');

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany(),
      Course.deleteMany(),
      Assignment.deleteMany(),
      Submission.deleteMany(),
      Resource.deleteMany(),
      Attendance.deleteMany(),
      Payment.deleteMany(),
      Message.deleteMany(),
      Notification.deleteMany(),
    ]);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@reality.edu',
      password: 'admin123',
      role: 'admin',
      phone: '08089012345',
      address: 'Lagos, Nigeria',
      joinDate: new Date('2023-11-01'),
    });

    const instructor1 = await User.create({
      name: 'Samuel Williams',
      email: 'samuel@reality.edu',
      password: 'instructor123',
      role: 'instructor',
      phone: '08056789012',
      bio: 'Senior Full-Stack Developer with 8 years experience in React, Node.js and cloud platforms.',
      joinDate: new Date('2023-12-10'),
    });

    const instructor2 = await User.create({
      name: 'Dr. Adaeze Okonkwo',
      email: 'adaeze.i@reality.edu',
      password: 'instructor123',
      role: 'instructor',
      phone: '08067890123',
      bio: 'Data Scientist & ML Engineer. PhD in Computer Science from UniLag.',
      joinDate: new Date('2023-12-12'),
    });

    const student1 = await User.create({
      name: 'Chidera Okafor',
      email: 'chidera@email.com',
      password: 'student123',
      role: 'student',
      phone: '08012345678',
      address: 'Lagos, Nigeria',
      joinDate: new Date('2024-01-05'),
    });

    const student2 = await User.create({
      name: 'Adaeze Nwosu',
      email: 'adaeze@email.com',
      password: 'student123',
      role: 'student',
      phone: '08023456789',
      address: 'Abuja, Nigeria',
      joinDate: new Date('2024-01-10'),
    });

    const student3 = await User.create({
      name: 'Emeka Eze',
      email: 'emeka@email.com',
      password: 'student123',
      role: 'student',
      phone: '08034567890',
      address: 'Enugu, Nigeria',
      joinDate: new Date('2024-01-15'),
    });

    const [course1, course2, course3] = await Course.create([
      {
        title: 'Full-Stack Web Development',
        description: 'Master React, Node.js, Express, MongoDB and deploy production apps.',
        category: 'Technology',
        price: 45000,
        duration: '12 weeks',
        modules: 8,
        lessons: 32,
        status: 'published',
        instructorId: instructor1._id,
        instructor: instructor1.name,
        cover: '#4169E1',
        rating: 4.8,
        syllabus: ['HTML/CSS Fundamentals', 'JavaScript ES6+', 'React & Redux', 'Node.js & Express', 'MongoDB & Mongoose', 'REST APIs', 'Authentication & Security', 'Deployment & CI/CD'],
      },
      {
        title: 'Data Science & Analytics',
        description: 'Python, Pandas, NumPy, Machine Learning and data visualization.',
        category: 'Technology',
        price: 38000,
        duration: '10 weeks',
        modules: 6,
        lessons: 24,
        status: 'published',
        instructorId: instructor2._id,
        instructor: instructor2.name,
        cover: '#7c3aed',
        rating: 4.9,
        syllabus: ['Python Basics', 'NumPy & Pandas', 'Data Visualization', 'Statistics & Probability', 'Machine Learning', 'Model Deployment'],
      },
      {
        title: 'Digital Marketing Mastery',
        description: 'SEO, social media marketing, Google Ads, email campaigns and analytics.',
        category: 'Business',
        price: 25000,
        duration: '8 weeks',
        modules: 5,
        lessons: 20,
        status: 'published',
        instructorId: instructor1._id,
        instructor: instructor1.name,
        cover: '#ea580c',
        rating: 4.7,
        syllabus: ['SEO Fundamentals', 'Social Media Strategy', 'Google Ads', 'Email Marketing', 'Analytics & Reporting'],
      },
    ]);

    await student1.updateOne({ $set: { enrolled: [course1._id, course3._id], progress: { [course1._id]: 65, [course3._id]: 30 } } });
    await student2.updateOne({ $set: { enrolled: [course2._id], progress: { [course2._id]: 80 } } });
    await student3.updateOne({ $set: { enrolled: [course1._id], progress: { [course1._id]: 45 } } });

    await Assignment.create([
      {
        title: 'Build a REST API with Node.js',
        description: 'Create a fully functional REST API using Node.js and Express with CRUD operations, authentication and MongoDB integration.',
        courseId: course1._id,
        instructorId: instructor1._id,
        type: 'project',
        dueDate: new Date('2024-03-15'),
        totalScore: 100,
      },
      {
        title: 'HTML/CSS & JavaScript Quiz',
        description: 'Test your knowledge of core web fundamentals covered in Modules 1-3.',
        courseId: course1._id,
        instructorId: instructor1._id,
        type: 'quiz',
        dueDate: new Date('2024-03-10'),
        totalScore: 50,
        questions: [
          { id: 'q1', text: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Text Machine Language', 'HyperText Machine Language', 'HyperText Media Language'], correct: 0 },
          { id: 'q2', text: 'Which CSS property controls the text size?', options: ['font-style', 'text-size', 'font-size', 'text-weight'], correct: 2 },
          { id: 'q3', text: 'What is the correct HTML for a line break?', options: ['<lb>', '<br>', '<break>', '<newline>'], correct: 1 },
          { id: 'q4', text: 'Which JavaScript method adds an element to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correct: 0 },
          { id: 'q5', text: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], correct: 0 },
        ],
      },
    ]);

    await Payment.create([
      { studentId: student1._id, courseId: course1._id, amount: 45000, method: 'Card', status: 'completed', ref: 'TRA-24001', instructorId: instructor1._id },
      { studentId: student2._id, courseId: course2._id, amount: 38000, method: 'Card', status: 'completed', ref: 'TRA-24002', instructorId: instructor2._id },
      { studentId: student3._id, courseId: course1._id, amount: 45000, method: 'Card', status: 'completed', ref: 'TRA-24003', instructorId: instructor1._id },
    ]);

    await Message.create([
      { from: instructor1._id, to: student1._id, text: 'Welcome to the Full-Stack Web Development course! Ready to start coding?' },
      { from: student1._id, to: instructor1._id, text: 'Yes! I’m really excited. I’ve been learning JavaScript basics already.' },
      { from: instructor1._id, to: student1._id, text: 'That’s great preparation! We start with ES6+ features this week.' },
    ]);

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
