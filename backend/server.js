import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import entriesRouter from './routes/entries.js'
import topicsRouter from './routes/topics.js'

dotenv.config()
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Mount the topics routes
app.use('/api/entries', entriesRouter)
app.use('/api/topics', topicsRouter)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' MongoDB connected'))
.catch(err => console.error(' MongoDB error:', err))

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
