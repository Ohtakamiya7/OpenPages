import mongoose from 'mongoose'

const entrySchema = new mongoose.Schema({
    topicOrder: {
      type: Number, // the topic number in the list so we can go back and access the entries
      required: true
    },
    author: {
      type: String, // does not need to be real name,  can be alias
      required: true
    },
    text: {
      type: String, // the text in the entry 
      required: true
    },
    createdAt: {
      type: Date, // the date created 
      default: Date.now
    },
    grateful: {
      type: String, 
      required: true 
    }, 
    win: {
      type: String, 
      required: true
    }, 
    mood:{
      type: String, 
      required: true   
    }
  })

export default mongoose.model('Entry', entrySchema); 
