import express from 'express'
import Entry from '../models/Entry.js'

const router = express.Router()

// GET /api/entries/:order  → all entries for topic with entry number order
router.get('/:order', async (req, res) => {
  try {
    const order = parseInt(req.params.order, 10)
    const entries = await Entry.find({ topicOrder: order })
      .sort({ createdAt: -1 })
    res.json(entries)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/entries/:order → add a new entry to topic number order
router.post('/:order', async (req, res) => {
  try {
    const order = parseInt(req.params.order, 10)
    const { author, text, grateful, win, mood } = req.body
    const entry = await Entry.create({ topicOrder: order, author, text, grateful, win, mood })
    res.status(201).json(entry)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/entries/:order
// body: { id: "<mongo‑id>" }
router.delete('/:order', async (req, res) => {
  try {
    const order = parseInt(req.params.order, 10)
    const { id }  = req.body
    if (!id) return res.status(400).json({ error: 'Missing id' })

    // only delete the one doc with that _id and topicOrder
    const deleted = await Entry.findOneAndDelete({
      _id: id,
      topicOrder: order
    })

    if (!deleted) {
      return res.status(404).json({ error: 'Entry not found' })
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:order', async (req, res) => {
  const order = parseInt(req.params.order, 10)     // matching GET/POST logic
  const { id, author, text, grateful, win, mood } = req.body
  try {
    const entry = await Entry.findById(id)
    if (!entry) return res.status(404).json({ error: 'Entry not found' })

    // update fields
    entry.author  = author
    entry.text    = text
    entry.grateful= grateful
    entry.win     = win
    entry.mood    = mood
    entry.updatedAt = Date.now()

    await entry.save()
    res.json(entry)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not update entry' })
  }
})


export default router; 
