import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } else {
    console.warn('GEMINI_API_KEY not found in environment variables. Chatbot will run in mock mode.');
  }
} catch (err) {
  console.error('Failed to initialize Google GenAI SDK:', err);
}

// REST API endpoint for the AI Chatbot helper
app.post('/api/chatbot', async (req: Request, res: Response) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'Invalid requests format. messages must be an array.' });
    return;
  }

  // Fallback if SDK is not initialized
  if (!ai) {
    // Generate a helpful simulated response
    const lastUserMessage = messages[messages.length - 1]?.text || 'Hello';
    const mockReply = generateSimulatedReply(lastUserMessage);
    res.json({ text: mockReply + " *(Simulated Mode)*" });
    return;
  }

  try {
    // Collect last few messages to build context
    // Prepare contents array for the SDK
    const history = messages.slice(-5).map((msg: any) => {
      return {
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      };
    });

    const systemInstruction = `You are "EduBot", a premium, friendly, and professional AI Assistant of Greenfield International School.
Your duty is to assist administrators, teachers, parents, and students with their administrative queries, timetable rules, library due dates, grades calculation, and school announcements.
Keep your answers highly structured, helpful, objective, and clear.
Use clean markdown like lists, bullet points, and italic notes to format your replies.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: history,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text || 'I sorry, I could not process that request.' });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Server encountered an error reaching the AI component.' });
  }
});

// Mock reply function for fallback if API key is not yet set up
function generateSimulatedReply(input: string): string {
  const text = input.toLowerCase();
  if (text.includes('fee') || text.includes('unpaid') || text.includes('invoice')) {
    return `Greenfield school fees are typically due by the 10th of each month. You can view all outstanding balances in the **Fees Module** of your portal, generate invoices in PDF, and clear payments. For assistance, please coordinate with the Accounts Office.`;
  }
  if (text.includes('exam') || text.includes('result') || text.includes('marks') || text.includes('gpa')) {
    return `Examination schedules and results cards are managed inside the **Exams & Results** tab. You can record grading metrics, generate individual printable report sheets, and review GPA curves there. Let me know if you need help with grading calculations!`;
  }
  if (text.includes('library') || text.includes('book') || text.includes('issue')) {
    return `Our Library maintains a digital checkout log within the **Library module**. Standard book checkouts are allowed for 14 days. Ensure you return issued books timely to avoid a $1/day overdue fee.`;
  }
  if (text.includes('attendance') || text.includes('present')) {
    return `Daily student attendance is logged via the **Attendance System** panel. Faculty members can quickly switch dates, toggle presentation status (Present/Absent/Leave), and render reports immediately.`;
  }
  if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
    return `Hello! Welcome to the Greenfield International School helper chatbot. I can assist you with portal navigations, fee information, examinations reports, timetable details, and library checks. How can I guide you today?`;
  }
  return `Thank you for your inquiry about Greenfield International School. I'm currently running in simulated offline mode, but I can assist with general directory guidelines. Please check our **Dashboard** announcements panel for the latest summer vacations schedule and weather alerts!`;
}

// Vite integration for rich asset compilation
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
