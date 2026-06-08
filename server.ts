import express from "express";
import { Resend } from "resend";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { defaultArticles } from "./src/data/defaultArticles";
import { Article, Comment, WriterRequest, InviteCode, ContactMessage } from "./src/types";
import { createClient } from "@supabase/supabase-js";

// ===== Supabase Config =====
const SUPABASE_URL = 'https://tpdmumgyxatarkmwjjpu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZG11bWd5eGF0YXJrbXdqanB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NTA2OTMsImV4cCI6MjA5NDQyNjY5M30.pVSCeGXm8D6F4oaPnfXo_i1211GO3-SOsbWESMHx_xw';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'sb_secret_-r1f9UwnhJMOdgkxCWrRPg_vDy4yeid';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
// ===========================

// ===== Resend Config =====
const resend = new Resend(process.env.RESEND_API_KEY || "re_Up6s5MAA_PKMFte2nFr1sqkA5ytxZj6fW");
// ===========================

// Initialize Gemini
let ai: GoogleGenAI | null = null;
const key = process.env.GEMINI_API_KEY;
if (key) {
  ai = new GoogleGenAI({
    apiKey: key,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } },
  });
}

const app = express();
const PORT = 3000;
app.use(express.json());

// ===== Articles =====
app.get("/api/articles", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;
    const all = [...defaultArticles, ...(data || []).map((a: any) => ({ ...a, source: "custom" }))];
    res.json(all);
  } catch (err) {
    res.json(defaultArticles);
  }
});

app.post("/api/articles", async (req, res) => {
  const { title, description, image, content, author_name } = req.body;
  if (!title || !content) return res.status(400).json({ error: "Title and content required" });

  const { data, error } = await supabase
    .from("articles")
    .insert({ title, description: description || "", image: image || "", content, author_name: author_name || "anonymous" })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ ...data, source: "custom" });
});

app.delete("/api/articles/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Article deleted" });
});

// ===== Comments =====
app.get("/api/comments/:article_id", async (req, res) => {
  const { article_id } = req.params;
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("article_id", article_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.post("/api/comments", async (req, res) => {
  const { article_id, user_email, user_name, content } = req.body;
  if (!article_id || !user_email || !content) return res.status(400).json({ error: "Missing fields" });

  const { data, error } = await supabase
    .from("comments")
    .insert({ article_id, user_email, user_name: user_name || user_email.split("@")[0], content })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// ===== Writer Requests =====
app.get("/api/writer-requests", async (req, res) => {
  const { data, error } = await supabase
    .from("writer_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.post("/api/writer-requests", async (req, res) => {
  const { full_name, age, message, is_creator, channel_url, email } = req.body;
  if (!full_name || !age || !message) return res.status(400).json({ error: "Missing required fields" });

  const { data, error } = await supabase
    .from("writer_requests")
    .insert({ full_name, age: Number(age), message, is_creator: !!is_creator, channel_url: channel_url || null, email: email || null, status: "pending" })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.patch("/api/writer-requests/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) return res.status(400).json({ error: "Invalid status" });

  const { data: reqData, error: fetchError } = await supabase
    .from("writer_requests")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (fetchError) return res.status(500).json({ error: fetchError.message });

  let invite = null;
  if (status === "approved" && reqData?.email) {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const { data: inviteData } = await supabase
      .from("invite_codes")
      .insert({ email: reqData.email, code, used: false })
      .select()
      .single();
    invite = inviteData;

    // Send email with code
    try {
      await resend.emails.send({
        from: "TechThread <onboarding@resend.dev>",
        to: reqData.email,
        subject: "Your TechThread Writer Access Code",
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 24px; color: #1d1d1f; margin-bottom: 10px;">Welcome to TechThread ✍️</h1>
            <p style="color: #6e6e73; font-size: 16px; line-height: 1.6;">
              Your writer access request has been approved! Use the code below to sign in.
            </p>
            <div style="background: #f5f5f7; border-radius: 14px; padding: 30px; text-align: center; margin: 30px 0;">
              <p style="color: #6e6e73; font-size: 14px; margin: 0 0 10px;">Your Access Code</p>
              <p style="font-size: 42px; font-weight: 700; letter-spacing: 8px; color: #1d1d1f; margin: 0;">${code}</p>
            </div>
            <p style="color: #6e6e73; font-size: 14px; line-height: 1.6;">
              Go to <a href="https://techthreadfinal-production-afbc.up.railway.app" style="color: #1d1d1f;">TechThread</a>, 
              click <strong>"have an access code?"</strong>, enter your email and this code.
            </p>
            <p style="color: #9e9ea3; font-size: 12px; margin-top: 30px;">
              This code can only be used once. If you didn't request this, ignore this email.
            </p>
          </div>
        `
      });
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }
  }

  res.json({ message: `Request ${status}`, invite });
});

// ===== Invite Codes =====
app.post("/api/invite-codes", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const { data, error } = await supabase
    .from("invite_codes")
    .insert({ email: email.toLowerCase(), code, used: false })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// ===== Writer Login =====
app.post("/api/writer-login", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Email and code required" });

  const { data, error } = await supabase
    .from("invite_codes")
    .select("*")
    .eq("email", email.toLowerCase())
    .eq("code", code)
    .eq("used", false)
    .single();

  if (error || !data) return res.status(401).json({ error: "Invalid email or code" });

  await supabase.from("invite_codes").update({ used: true }).eq("id", data.id);

  res.json({
    token: `token_writer_${Date.now()}`,
    email: email.toLowerCase(),
    name: email.split("@")[0],
    role: data.role || "author"
  });
});

// ===== Contact Messages =====
app.post("/api/messages", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "All fields required" });

  const { error } = await supabase.from("messages").insert({ name, email, message });
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ success: true });
});

// ===== AI Chat =====
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Empty message" });

  // Search local knowledge first
  const { data: knowledge } = await supabase
    .from("ai_knowledge")
    .select("*")
    .ilike("question", `%${message.split(" ").slice(0, 3).join("%")}%`)
    .order("usage_count", { ascending: false })
    .limit(3);

  if (knowledge && knowledge.length > 0) {
    const best = knowledge[0];
    await supabase.from("ai_knowledge").update({ usage_count: (best.usage_count || 0) + 1 }).eq("id", best.id);
    return res.json({ response: best.answer, source: "knowledge_base" });
  }

  // Fallback to Gemini
  try {
    if (ai) {
      const gResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: message,
        config: {
          systemInstruction: "You are a friendly expert technical support assistant for TechThread. Provide clear step-by-step instructions. Keep responses under 220 words. Focus on computers, networks, and software issues."
        }
      });
      const answer = gResponse.text || "Sorry, I could not generate a response.";

      // Save to knowledge base if answer is good
      if (answer.length > 100) {
        await supabase.from("ai_knowledge").insert({
          question: message,
          answer,
          confidence_score: 0.7,
          source_type: "gemini",
          usage_count: 1,
          verified: false
        });
      }

      return res.json({ response: answer, source: "gemini" });
    }
  } catch (err) {
    console.error("Gemini error:", err);
  }

  res.json({ response: "Sorry, AI assistant is temporarily unavailable. Please try again later." });
});

// Vite / Static
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`[TechThread Server] Ready on http://localhost:${PORT}`);
  });
}

setupServer();
