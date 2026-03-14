import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

let supabaseInstance: any = null;

const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  // Vercel-এ ডেপ্লয় করার সময় নিচের লাইনে আপনার আসল URL এবং Key বসান
  const supabaseUrl = process.env.SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder";

  supabaseInstance = createClient(supabaseUrl, supabaseKey);
  return supabaseInstance;
};

const checkConfig = (req: any, res: any, next: any) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("placeholder")) {
    return res.status(503).json({ 
      error: "Supabase is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the Settings menu." 
    });
  }
  next();
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.use("/api", checkConfig);
  app.get("/api/students", async (req, res) => {
    try {
      const { data, error } = await getSupabase()
        .from("students")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching students:", error);
        return res.status(500).json({ error: error.message });
      }
      res.json(data);
    } catch (err) {
      console.error("Unexpected error in GET /api/students:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const { data, error } = await getSupabase()
        .from("students")
        .insert([req.body])
        .select();
      
      if (error) {
        console.error("Error creating student:", error);
        return res.status(500).json({ error: error.message });
      }
      res.json(data[0]);
    } catch (err) {
      console.error("Unexpected error in POST /api/students:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/students/:id", async (req, res) => {
    try {
      const { data, error } = await getSupabase()
        .from("students")
        .update(req.body)
        .eq("id", req.params.id)
        .select();
      
      if (error) {
        console.error("Error updating student:", error);
        return res.status(500).json({ error: error.message });
      }
      res.json(data[0]);
    } catch (err) {
      console.error("Unexpected error in PUT /api/students/:id:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    try {
      const { error } = await getSupabase()
        .from("students")
        .delete()
        .eq("id", req.params.id);
      
      if (error) {
        console.error("Error deleting student:", error);
        return res.status(500).json({ error: error.message });
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Unexpected error in DELETE /api/students/:id:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Attendance
  app.get("/api/attendance", async (req, res) => {
    try {
      const { date, student_id } = req.query;
      let query = getSupabase().from("attendance").select("*, students(name)");
      if (date) query = query.eq("date", date);
      if (student_id) query = query.eq("student_id", student_id);
      
      const { data, error } = await query.order("date", { ascending: false });
      if (error) {
        console.error("Error fetching attendance:", error);
        return res.status(500).json({ error: error.message });
      }
      res.json(data);
    } catch (err) {
      console.error("Unexpected error in GET /api/attendance:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/attendance", async (req, res) => {
    try {
      if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
        return res.json([]);
      }
      const { data, error } = await getSupabase()
        .from("attendance")
        .upsert(req.body, { onConflict: "student_id,date" })
        .select();
      
      if (error) {
        console.error("Error upserting attendance:", error);
        return res.status(500).json({ error: error.message });
      }
      res.json(data);
    } catch (err) {
      console.error("Unexpected error in POST /api/attendance:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Fees
  app.get("/api/fees", async (req, res) => {
    try {
      const { data, error } = await getSupabase()
        .from("fees")
        .select("*, students(name)")
        .order("payment_date", { ascending: false });
      
      if (error) {
        console.error("Error fetching fees:", error);
        return res.status(500).json({ error: error.message });
      }
      res.json(data);
    } catch (err) {
      console.error("Unexpected error in GET /api/fees:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/fees", async (req, res) => {
    try {
      const { data, error } = await getSupabase()
        .from("fees")
        .insert([req.body])
        .select();
      
      if (error) {
        console.error("Error creating fee record:", error);
        return res.status(500).json({ error: error.message });
      }
      res.json(data[0]);
    } catch (err) {
      console.error("Unexpected error in POST /api/fees:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Dashboard Stats
  app.get("/api/stats", async (req, res) => {
    try {
      const supabase = getSupabase();
      
      const { count: studentCount, error: studentError } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true });

      if (studentError) throw studentError;

      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data: monthlyIncomeData, error: incomeError } = await supabase
        .from("fees")
        .select("amount")
        .eq("status", "paid")
        .gte("payment_date", startOfMonth);

      if (incomeError) throw incomeError;

      const totalMonthlyIncome = monthlyIncomeData?.reduce((acc: any, curr: any) => acc + Number(curr.amount), 0) || 0;

      const { count: dueFeesCount, error: dueError } = await supabase
        .from("fees")
        .select("*", { count: "exact", head: true })
        .eq("status", "due");

      if (dueError) throw dueError;

      // Fetch Recent Activity (Attendance and Fees)
      const { data: recentAttendance, error: recentAttError } = await supabase
        .from("attendance")
        .select("*, students(name)")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentAttError) throw recentAttError;

      const { data: recentFees, error: recentFeesError } = await supabase
        .from("fees")
        .select("*, students(name)")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentFeesError) throw recentFeesError;

      const recentActivity = [
        ...(recentAttendance?.map(a => ({
          type: 'attendance',
          title: `Attendance marked for ${a.students?.name}`,
          time: a.created_at,
          status: a.status
        })) || []),
        ...(recentFees?.map(f => ({
          type: 'fee',
          title: `Fee ${f.status} for ${f.students?.name}`,
          time: f.created_at,
          amount: f.amount
        })) || [])
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

      // Fetch Upcoming/Due Fees
      const { data: upcomingFees, error: upcomingFeesError } = await supabase
        .from("fees")
        .select("*, students(name)")
        .eq("status", "due")
        .order("payment_date", { ascending: true })
        .limit(5);

      if (upcomingFeesError) throw upcomingFeesError;

      res.json({
        totalStudents: studentCount || 0,
        monthlyIncome: totalMonthlyIncome,
        dueFees: dueFeesCount || 0,
        recentActivity,
        upcomingFees: upcomingFees || []
      });
    } catch (err: any) {
      console.error("Error in GET /api/stats:", err);
      res.status(500).json({ error: err.message || "Failed to fetch stats" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
