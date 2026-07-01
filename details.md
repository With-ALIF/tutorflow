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
  user_id uuid not null,
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

---

### Migration: User ID to UUID (with RLS support)

If you have existing data and policies, run this complete script to safely convert `user_id`:

```sql
-- 1. Temporarily drop policies using the column
DROP POLICY IF EXISTS "Users can manage their own attendance" ON public.attendance;
DROP POLICY IF EXISTS "Users can manage their own students" ON public.students;
DROP POLICY IF EXISTS "Users can manage their own fees" ON public.tuition_fees;

-- 2. Convert column type (Data stays safe)
ALTER TABLE public.attendance ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.students ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.tuition_fees ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- 3. Restore policies
CREATE POLICY "Users can manage their own attendance" ON public.attendance FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own students" ON public.students FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own fees" ON public.tuition_fees FOR ALL USING (auth.uid() = user_id);
```

### Students Table
```sql
create table public.students (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
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
  user_id uuid not null,
  student_id uuid references students(id) on delete cascade,
  amount numeric not null,
  month text not null,
  payment_date date not null,
  status text default 'Paid',
  created_at timestamp with time zone default now(),
  constraint tuition_fees_pkey primary key (id)
);
```

### Users Table (User Metadata)
```sql
-- 1. Create Users table
create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text,
  phone_number text,
  telegram_chat_id text,
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- 2. Enable RLS
alter table public.users enable row level security;

-- 3. Setup Policies
drop policy if exists "Users can view own data" on public.users;
create policy "Users can view own data" on public.users for select using (auth.uid() = id);

drop policy if exists "Users can update own data" on public.users;
create policy "Users can update own data" on public.users for update using (auth.uid() = id);

-- 4. Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- 5. Trigger to call function on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Routines Table
```sql
create table public.routines (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  class text not null,
  day text not null,
  starttime text not null,
  endtime text not null,
  subject text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint routines_pkey primary key (id)
);

-- Enable RLS
alter table public.routines enable row level security;

-- Policy
create policy "Users can manage their own routines" on public.routines
for all using (auth.uid() = user_id);
```

---

