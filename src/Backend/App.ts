// src/Backend/App.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer'
import path from 'path';
import { ObjectId } from 'mongodb';
import { DrawLib, DrawLibConfig } from '../DrawLib/DrawLib';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static HTML pages from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));


const drawLibConfig: DrawLibConfig = {
  type: 'memory-mongo',
  host: '',       // not used for SQLite memory
  port: 0,        // not used
  username: '',   // not used
  password: '',   // not used
  database: ':memory:',
  synchronize: true,
};

const drawLib = new DrawLib(drawLibConfig);

// Initialize DB and services before starting server
drawLib.initialize().then(() => {
  console.log('DrawLib initialized');
}).catch((err: any) => {
  console.error('Error initializing DrawLib:', err);
  process.exit(1);
});

// --- API Routes ---

// Get all draws
app.get('/api/designs', async (_req: Request, res: Response) => {
  const draws = await drawLib.drawService.listDraws();
  res.json(draws);
});

/**
 * POST /api/designs
 * Accepts multipart/form-data with fields:
 * - name: string
 * - svg: file
 */
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/designs', upload.single('svg'), async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const file = req.file;

    if (!name || !file) {
      return res.status(400).json({ message: 'Missing name or svg file' });
    }

    const svgStr = file.buffer.toString('utf-8');
    const draw = await drawLib.drawService.create(name, svgStr);
    
    res.status(201).json(draw);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Update a draw
app.get('/api/draws/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, svg } = req.body;
  const updated = await drawLib.drawService.get(new ObjectId(id));
  res.json(updated);
});

// Example HTML page route
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});