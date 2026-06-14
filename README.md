# The Reality Academy LMS

A full-featured Learning Management System built with React, branded for **The Reality Academy**.

## Features

### 🎓 Student Portal
- Dashboard with progress overview
- Course browsing and enrollment with payment (Card / Bank Transfer)
- Learning interface with progress tracking
- Assignments & quiz submission
- Payment history
- Certificates for completed courses
- Messaging (chat with instructors & admin)

### 👨‍🏫 Instructor Portal
- Dashboard with stats and pending reviews
- Course creation & management (CRUD)
- Student enrollment tracking
- Assignment creation (text submission & multiple-choice quiz builder)
- Submission grading with feedback
- Attendance tracking
- Resource upload management
- Earnings & revenue breakdown (70% share)
- Student performance reports

### 🛡️ Admin Portal
- Platform analytics dashboard
- Student management (search, edit)
- Instructor management + payout processing
- Course management (publish/unpublish, add/delete)
- Full payment ledger (enrollments + instructor payouts)
- Platform-wide reports
- General & payment gateway settings

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | chidera@email.com | student123 |
| Instructor | samuel@reality.edu | instructor123 |
| Admin | admin@reality.edu | admin123 |

## Tech Stack
- **React** (Create React App)
- **CSS-in-JS** via inline styles + global class system
- **State Management** via React Context + useReducer
- **Font**: Poppins (Google Fonts)

## Brand
- Primary Blue: `#4169E1`
- Accent Red: `#FF0000`
- Font: Poppins

## Getting Started

```bash
npm install
npm start       # Development server
npm run build   # Production build
```

## Deployment
The build folder can be deployed to any static host: Netlify, Vercel, GitHub Pages, etc.
