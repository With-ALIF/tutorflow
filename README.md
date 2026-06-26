# TutorFlow - Tuition Hub BD

TutorFlow is a comprehensive platform designed to manage tuition hubs efficiently. It streamlines the process of tracking students, attendance, fees, and overall hub management.

## Why TutorFlow?

Managing a tuition hub involves keeping track of many students, their attendance records, and fee payments. Manual tracking is often prone to errors and time-consuming. TutorFlow provides a centralized, digital solution to automate these tasks, allowing tutors to focus more on teaching and less on administrative work.

## Target Audience

- **Tuition Center Owners:** To manage multiple batches, teachers, and students.
- **Individual Tutors:** To keep track of their students' progress and payments.
- **Educational Institutions:** As a lightweight management system.

## Features

- **Student Management:** Keep track of student profiles, classes, and contact information.
- **Attendance Tracking:** Easily mark daily attendance and view historical data.
- **Fee Management:** Monitor pending fees and payment history.
- **Dashboard:** Get an overview of hub statistics and recent activities.

## Future Roadmap

- **Parent Portal:** Allow parents to view their child's attendance and fee status.
- **Automated Notifications:** Send SMS/Email alerts for pending fees or attendance updates.
- **Performance Reports:** Generate detailed progress reports for students.
- **Teacher Management:** Assign teachers to specific batches and track their schedules.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend/Database:** Supabase (PostgreSQL, Authentication)
- **State Management:** React Hooks
- **Animations:** Motion (framer-motion)
- **Utilities:** date-fns, lucide-react

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/With-ALIF/tutorflow.git
   cd tutorflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file based on `.env.example` and add your Supabase configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Database Schema

To set up your Supabase database, run the following SQL in the Supabase SQL Editor:

```sql
create table public.attendance (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  student_id uuid null,
  date date not null,
  status text not null,
  shift text null default 'Morning'::text,
  created_at timestamp with time zone null default now(),
  constraint attendance_pkey primary key (id),
  constraint attendance_student_id_date_shift_key unique (student_id, date, shift),
  constraint attendance_student_id_fkey foreign KEY (student_id) references students (id) on delete CASCADE
);

create unique INDEX IF not exists attendance_unique_identity on public.attendance using btree (student_id, date, shift);

---

### Database Migration: Changing `user_id` to UUID (Safe Method)

If you encounter an error about "policy definition" while changing the `user_id` type, use this script:

```sql
-- 1. Drop existing policies (Change names if yours are different)
DROP POLICY IF EXISTS "Users can manage their own attendance" ON public.attendance;
DROP POLICY IF EXISTS "Users can manage their own students" ON public.students;
DROP POLICY IF EXISTS "Users can manage their own fees" ON public.tuition_fees;

-- 2. Alter column types (Safe: No data loss)
ALTER TABLE public.attendance ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.students ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
ALTER TABLE public.tuition_fees ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- 3. Re-create policies
CREATE POLICY "Users can manage their own attendance" ON public.attendance 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own students" ON public.students 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own fees" ON public.tuition_fees 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own routines" ON public.routines
FOR ALL USING (auth.uid() = user_id);
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

alter table public.routines enable row level security;
```
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
