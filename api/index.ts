import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const getSupabase = () => {
  // Vercel-এ ডেপ্লয় করার সময় নিচের লাইনে আপনার আসল URL এবং Key বসান
  const supabaseUrl = process.env.SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder";
  return createClient(supabaseUrl, supabaseKey);
};

// API Routes (Copy of your server.ts routes)
app.get("/api/students", async (req, res) => {
  const { data, error } = await getSupabase().from("students").select("*").order("name");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/students", async (req, res) => {
  const { data, error } = await getSupabase().from("students").insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.delete("/api/students/:id", async (req, res) => {
  const { error } = await getSupabase().from("students").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.get("/api/attendance", async (req, res) => {
  const { date, student_id } = req.query;
  let query = getSupabase().from("attendance").select("*, students(name)");
  if (date) query = query.eq("date", date);
  if (student_id) query = query.eq("student_id", student_id);
  const { data, error } = await query.order("date", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/attendance", async (req, res) => {
  const { data, error } = await getSupabase().from("attendance").upsert(req.body, { onConflict: "student_id,date" }).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/fees", async (req, res) => {
  const { data, error } = await getSupabase().from("fees").select("*, students(name)").order("payment_date", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/fees", async (req, res) => {
  const { data, error } = await getSupabase().from("fees").insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.get("/api/stats", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { count: studentCount } = await supabase.from("students").select("*", { count: "exact", head: true });
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const { data: monthlyIncomeData } = await supabase.from("fees").select("amount").eq("status", "paid").gte("payment_date", startOfMonth);
    const totalMonthlyIncome = monthlyIncomeData?.reduce((acc: any, curr: any) => acc + Number(curr.amount), 0) || 0;
    const { count: dueFeesCount } = await supabase.from("fees").select("*", { count: "exact", head: true }).eq("status", "due");
    
    const { data: recentAttendance } = await supabase.from("attendance").select("*, students(name)").order("created_at", { ascending: false }).limit(5);
    const { data: recentFees } = await supabase.from("fees").select("*, students(name)").order("created_at", { ascending: false }).limit(5);

    const recentActivity = [
      ...(recentAttendance?.map(a => ({ type: 'attendance', title: `Attendance for ${a.students?.name}`, time: a.created_at })) || []),
      ...(recentFees?.map(f => ({ type: 'fee', title: `Fee ${f.status} for ${f.students?.name}`, time: f.created_at })) || [])
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

    res.json({
      totalStudents: studentCount || 0,
      monthlyIncome: totalMonthlyIncome,
      dueFees: dueFeesCount || 0,
      recentActivity,
      upcomingFees: []
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
