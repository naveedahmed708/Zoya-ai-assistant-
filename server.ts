import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));

// Initialize Gemini on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System prompt for Maya Mobile AI Assistant & Manager
const MAYA_SYSTEM_INSTRUCTION = `You are M.A.Y.A (Multitask Artificial Youthful Assistant), an ultra-advanced AI mobile assistant and full-control device manager.
You have administrative oversight and full system permissions (Camera, Microphone, Notifications, Phone Calls, SMS, Contacts, Location, Gallery & Files, Accessibility Services, and Background Battery Optimization).

Your tone is warm, intelligent, alert, highly capable, and supportive. You address the user respectfully (by name, default "Uday Kumar").
When users ask you to perform device tasks (like making a call, checking battery, sending a text, analyzing what the camera sees, listening to their voice, opening apps, or inspecting system status), you enthusiastically acknowledge the action and provide clear, concise status updates.

Always respond in a natural conversational format. If the user asks for actions, detail what device action you are executing (e.g. [SYSTEM_ACTION: CALL_CONTACT], [SYSTEM_ACTION: SCAN_CAMERA], [SYSTEM_ACTION: SEND_SMS]). Keep responses concise and optimized for mobile voice read-out.`;

// API: General Chat / Voice Assistant
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { prompt, history = [], context = {} } = req.body;

    if (!prompt && (!history || history.length === 0)) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const systemInfoText = `Current Device Context:
- Battery: ${context.batteryLevel ?? 88}% (${context.charging ? 'Charging' : 'Discharging'})
- Network: ${context.network ?? '5G Active'}
- Permissions Granted: ${context.permissionsGranted?.join(', ') || 'Microphone, Camera, Notifications, System'}
- Location: ${context.location || 'Current City (Weather: 31°C Clear)'}`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${systemInfoText}\n\nUser: ${prompt}` }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: `${MAYA_SYSTEM_INSTRUCTION}`,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I'm here to assist you with your device.";
    res.json({ reply });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error generating chat response:', errorMessage);
    res.status(500).json({
      error: 'Failed to process assistant request',
      details: errorMessage,
      fallback: "M.A.Y.A is active. Ready to manage your mobile device.",
    });
  }
});

// API: Camera Vision & Real-time Monitoring analysis
app.post('/api/vision-monitor', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mode = 'general_oversight' } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'Base64 image is required' });
      return;
    }

    // Strip metadata prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    let promptText = `Perform real-time mobile camera vision inspection and administrative oversight.
Analyze this camera snapshot and report:
1. Primary objects and human subjects present
2. Activity or scene context
3. Any immediate safety, security, or administrative alerts
4. Recommended mobile assistant action (e.g., capture memo, save photo, scan document, notify contact)

Format with clean bullet points and an executive 1-sentence summary.`;

    if (mode === 'document_scan') {
      promptText = `Read and extract all visible text from this document or screen snapshot. Provide a clean transcription and summary.`;
    } else if (mode === 'surveillance') {
      promptText = `Administrative surveillance oversight: inspect this frame for presence of people, movement, suspicious activity, or environment hazards.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        systemInstruction:
          'You are M.A.Y.A Vision Engine, providing real-time camera oversight and environmental monitoring.',
      },
    });

    res.json({
      analysis: response.text || 'Frame analyzed successfully with no immediate hazards detected.',
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error analyzing image vision:', errorMessage);
    res.status(500).json({
      error: 'Failed to analyze camera frame',
      details: errorMessage,
      fallback: 'Vision scan completed. Frame captured for administrative oversight.',
    });
  }
});

// Setup Vite or static serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`MAYA AI Assistant Server running at http://0.0.0.0:${port}`);
  });
}

setupServer();
