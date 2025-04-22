import mongoose from 'mongoose'

const topicSchema = new mongoose.Schema({
  order: {
    type: Number, // the number spot in the order of prompts
    required: true,
    unique: true,    // 0 through 29
    min: 0,
    max: 29, 
  },
  prompt: {
    type: String, // the prompt for today the users will respond to
    required: true
  }, 
  date:   {
     type: Date,   
    required: true
  }   // new!

})

export default mongoose.model('Topic', topicSchema)
