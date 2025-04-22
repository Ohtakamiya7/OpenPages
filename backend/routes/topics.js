import express from 'express'
import Topic from '../models/Topic.js'
const router = express.Router()

// get the index of todays prompt
function getTodayIndex(total) {
  const epoch = new Date('2025-01-01')    // pick a fixed start date
  const today = new Date()
  const days = Math.floor((today - epoch) / (24*60*60*1000))
  return days % total
}

// GET /api/topics/today
router.get('/today', async (req, res) => {
  try {
    const count = await Topic.countDocuments()
    const idx = getTodayIndex(count)
    const topic = await Topic.findOne({ order: idx })
    if (!topic) return res.status(404).json({ error: 'No topic found' })
    res.json(topic)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/topics
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 })
    res.json(topics)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// topics.js (Express router)

router.get("/:order", async (req, res) => {
  const order = Number(req.params.order)
  try {
    const topic = await Topic.findOne({ order })      // or however you store it
    if (!topic) return res.status(404).json({ error: "Topic not found" })
    res.json({ prompt: topic.prompt, order: topic.order, date: topic.date})
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})


export default router
