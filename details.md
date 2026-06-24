# Tutor Management System - Project Details

## 1. Project Purpose
The **Tutor Management System** is a professional-grade full-stack web application designed for private tutors and educators. It streamlines administrative tasks such as student enrollment, daily attendance tracking, payment management, and financial reporting, allowing teachers to focus on their primary goal: teaching.

---

## 2. Core Features & Functionalities

### 👤 Student Management
- **Smart Enrollment**: Capture student details including name, class, batch, and contact information.
- **Photo Support**: Supports both local file uploads and web URLs for student avatars.
- **Student Profiles**: Dedicated pages for every student featuring:
  - Attendance statistics and percentages.
  - Payment history and status (Paid/Unpaid).
  - Performance tracking and personal details.

### 📅 Attendance System
- **Daily Marking**: A streamlined interface to mark students as Present, Absent, Late, or On Leave.
- **Caught Up (Extra/Catch-up Class)**: A specialized feature to mark attendance for classes taken outside the regular schedule, ensuring students get credit for extra sessions.
- **Attendance History**: Monthly and yearly calendar views to track consistency over time.

### 💰 Financial Management (Tuition & Expenses)
- **Fee Tracking**: Record monthly tuition fees, payment dates, and pending amounts.
- **Expense Tracker**: Log teaching-related costs (books, commute, materials). Expenses can be categorized or linked to specific students.
- **Payment Reminders**: Visual indicators for students with overdue payments.

### 📊 Smart Dashboard
- **Financial Analytics**: Interactive charts (via Recharts) showing Income vs. Expense trends.
- **Quick Stats**: At-a-glance cards showing Total Students, Monthly Revenue, and Attendance Rates.
- **Today's Schedule**: Integrated routine view showing upcoming classes for the current day.

### 🤖 Telegram Notifier
- **Bot Integration**: Users can connect their Telegram accounts via Chat ID.
- **Automated Alerts**: (System-ready) For sending class reminders and payment confirmations directly to the tutor.

### 🌍 UI/UX & Localization
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop usage.
- **Modern Aesthetic**: Built with a clean, high-contrast interface supporting both Light and Dark modes.
- **Multi-language Support**: Full support for English and Bengali (BN).

---

## 3. Technical Stack

- **Frontend**: React 18 (Vite), TypeScript.
- **Styling**: Tailwind CSS (Utility-first styling).
- **Animations**: Framer Motion (`motion/react`) for fluid transitions.
- **Database/Auth**: Supabase (PostgreSQL) for secure, real-time data persistence.
- **Charts**: Recharts for data visualization.
- **Icons**: Lucide React.
- **Date Handling**: `date-fns` for precise scheduling logic.

---

## 4. Database Schema (Supabase / PostgreSQL)

### Attendance Table
```sql
create table public.attendance (
  id uuid not null default gen_random_uuid (),
  user_id text not null,
  student_id uuid null,
  date date not null,
  status text not null, -- 'Present', 'Absent', 'Late', 'Leave'
  shift text null default 'Morning'::text,
  created_at timestamp with time zone null default now(),
  constraint attendance_pkey primary key (id),
  constraint attendance_student_id_date_shift_key unique (student_id, date, shift),
  constraint attendance_student_id_fkey foreign KEY (student_id) references students (id) on delete CASCADE
);

create unique INDEX IF not exists attendance_unique_identity 
on public.attendance using btree (student_id, date, shift);
```

### Students Table
```sql
create table public.students (
  id uuid not null default gen_random_uuid (),
  user_id text not null,
  name text not null,
  student_class text not null,
  batch_name text not null,
  photo_url text,
  joined_date date default current_date,
  status text default 'Active',
  created_at timestamp with time zone default now(),
  constraint students_pkey primary key (id)
);
```

### Tuition Fees Table
```sql
create table public.tuition_fees (
  id uuid not null default gen_random_uuid (),
  user_id text not null,
  student_id uuid references students(id) on delete cascade,
  amount numeric not null,
  month text not null,
  payment_date date not null,
  status text default 'Paid',
  created_at timestamp with time zone default now(),
  constraint tuition_fees_pkey primary key (id)
);
```

---

## 5. Development Setup

1. **Environment**:
   - Copy `.env.example` to `.env`.
   - Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

2. **Installation**:
   ```bash
   npm install
   npm run dev
   ```

3. **Production Build**:
   ```bash
   npm run build
   ```
