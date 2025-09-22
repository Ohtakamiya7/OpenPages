import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Topic from '../models/Topic.js'

dotenv.config()

// ✅ Jan is month 0 (not 4 → May!)
const EPOCH = new Date(2025, 0, 1)  // Jan 1, 2025 local time
const MS_PER_DAY = 24 * 60 * 60 * 1000

// 30 prompts that the users will respond to 
const prompts = [
  "What are you grateful for today?",
  "Describe a highlight from your day!",
  "Share a piece of advice you live by!", 
  "Describe a challenge you overcame recently!",
  "What moment from today brought you joy? ",
  "Write about a lesson you learned this week ",
  "What’s something you appreciate about yourself?",
  "Write about a time that frustrated you recently, and express how that made you feel.  ",
  "What’s a goal you achieved recently?",
  "Describe a time you felt truly at peace",
  "What does self-care look like for you?",
  "What inspired you this week? ",
  "Write about a fear you want to conquer ",
  "What is a skill you’re proud of developing? ",
  "Describe your perfect day",
  "Who is someone you look up to and why?",
  "What does success mean to you? ",
  "Write about someone who positively influenced you",
  "What’s a habit you want to break or build?",
  "Describe a place where you feel most yourself",
  "What’s one thing you can do tomorrow to make it great? ",
  "Write about a meaningful conversation you had recently",
  "What are three things you’re thankful for right now?",
  "How do you handle stress and what helps you relax?",
  "What’s a dream you have for the future?",
  "Describe a time you stepped out of your comfort zone",
  "What’s one piece of advice you’d give your younger self?",
  "If you could be a character in any movie, show, or book, who would you want to be? ",
  "What does happiness feel like to you?",
  "If you could enter an alternate reality set in a movie or show, what movie or show's world would you want to be in? ", 
]

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)

  // Wipe old topics
  await Topic.deleteMany({})

  // ✅ Use 1-based order to match UI
  const docs = prompts.map((text, idx) => ({
    order: idx + 1, 
    prompt: text,
    date: new Date(EPOCH.getTime() + idx * MS_PER_DAY)
  }))

  await Topic.insertMany(docs)
  console.log(`Seeded ${docs.length} topics.`)
  process.exit()
}

seed().catch(console.error)
