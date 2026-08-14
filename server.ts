import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import { createExamAttempt, getExamAttempts, deleteExamAttempt } from './src/db/attempts.ts';
import { getOrCreateUser } from './src/db/users.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', engine: 'Cloud SQL PostgreSQL', timestamp: new Date().toISOString() });
  });

  // User synchronization endpoint
  app.post('/api/sync-user', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email, name } = req.body;
      const effectiveUid = req.user?.uid || uid || 'guest_user';
      const effectiveEmail = req.user?.email || email || 'guest@miningcbt.internal';
      
      const user = await getOrCreateUser(effectiveUid, effectiveEmail, name);
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Error syncing user:', error);
      res.status(500).json({ error: error.message || 'Failed to sync user' });
    }
  });

  // Get exam attempts (supports ?track=... query)
  app.get('/api/attempts', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const track = req.query.track as string | undefined;
      const userUid = req.user?.uid;
      const attempts = await getExamAttempts(userUid, track);
      res.json(attempts);
    } catch (error: any) {
      console.error('Error fetching attempts:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch attempts' });
    }
  });

  // Record a new exam attempt
  app.post('/api/attempts', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const data = req.body;
      const userUid = req.user?.uid || data.userUid || 'local_user';
      
      const savedAttempt = await createExamAttempt({
        ...data,
        userUid,
      });

      res.status(201).json({ success: true, attempt: savedAttempt });
    } catch (error: any) {
      console.error('Error creating attempt:', error);
      res.status(500).json({ error: error.message || 'Failed to save exam attempt' });
    }
  });

  // Delete an attempt
  app.delete('/api/attempts/:id', optionalAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid attempt ID' });
      }
      await deleteExamAttempt(id);
      res.json({ success: true, message: `Attempt ${id} deleted` });
    } catch (error: any) {
      console.error('Error deleting attempt:', error);
      res.status(500).json({ error: error.message || 'Failed to delete attempt' });
    }
  });

  // Aggregate stats across tracks
  app.get('/api/stats', optionalAuth, async (_req, res) => {
    try {
      const allAttempts = await getExamAttempts();
      const count = allAttempts.length;
      const avgAccuracy = count > 0 
        ? Math.round(allAttempts.reduce((sum, a) => sum + (a.accuracy || 0), 0) / count)
        : 0;
      const peakScore = count > 0 
        ? Math.max(...allAttempts.map(a => a.totalScore))
        : 0;

      // Group by track
      const trackCounts: Record<string, { count: number; avgScorePct: number; avgAccuracy: number }> = {};
      allAttempts.forEach(a => {
        if (!trackCounts[a.track]) {
          trackCounts[a.track] = { count: 0, avgScorePct: 0, avgAccuracy: 0 };
        }
        trackCounts[a.track].count += 1;
        trackCounts[a.track].avgScorePct += (a.totalScore / a.maxScore) * 100;
        trackCounts[a.track].avgAccuracy += a.accuracy;
      });

      Object.keys(trackCounts).forEach(k => {
        trackCounts[k].avgScorePct = Math.round(trackCounts[k].avgScorePct / trackCounts[k].count);
        trackCounts[k].avgAccuracy = Math.round(trackCounts[k].avgAccuracy / trackCounts[k].count);
      });

      res.json({
        totalAttempts: count,
        avgAccuracy,
        peakScore,
        trackCounts,
      });
    } catch (error: any) {
      console.error('Error computing stats:', error);
      res.status(500).json({ error: error.message || 'Failed to compute stats' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
