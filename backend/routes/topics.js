// routes/topics.js
import express from 'express';
import Topic from '../models/Topic.js';
const router = express.Router();

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const EPOCH_UTC_MS = Date.UTC(2025, 0, 1); // still used to pick which prompt
function ymdUTC(ms) {
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function todayUtcMidnightMs() {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}
function getTodayIndex(total) {
  const daysSinceEpoch = Math.floor((todayUtcMidnightMs() - EPOCH_UTC_MS) / MS_PER_DAY);
  return ((daysSinceEpoch % total) + total) % total; // 0..total-1
}

// --- TODAY: return order = count (so maxOrder === count) ---
router.get('/today', async (req, res) => {
  try {
    const count = await Topic.countDocuments();
    if (!count) return res.status(500).json({ error: 'No topics seeded' });

    const idx0 = getTodayIndex(count);
    const topic = await Topic.findOne({ order: idx0 });
    if (!topic) return res.status(404).json({ error: 'No topic found' });

    res.set('Cache-Control', 'no-store');
    res.json({
      order: count,                                  // 👈 today is max
      prompt: topic.prompt,
      date: ymdUTC(todayUtcMidnightMs())             // today’s date
    });
  } catch (err) {
    console.error('[topics/today] error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- BY ORDER: interpret order as rolling position ending today ---
router.get('/:order', async (req, res) => {
  try {
    const order1 = Number(req.params.order);
    const count = await Topic.countDocuments();
    if (!Number.isFinite(order1) || order1 < 1 || order1 > count) {
      return res.status(400).json({ error: 'Bad order' });
    }

    const todayIdx0 = getTodayIndex(count);
    // stepsBack: how many days before today this page is
    const stepsBack = count - order1; // 0 => today, 1 => yesterday, ...
    const targetIdx0 = ((todayIdx0 - stepsBack) % count + count) % count;

    const topic = await Topic.findOne({ order: targetIdx0 });
    if (!topic) return res.status(404).json({ error: 'Topic not found' });

    const dateMs = todayUtcMidnightMs() - stepsBack * MS_PER_DAY;
    res.json({
      prompt: topic.prompt,
      order: order1,
      date: ymdUTC(dateMs)   // correct rolling calendar date
    });
  } catch (err) {
    console.error('[topics/:order] error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
