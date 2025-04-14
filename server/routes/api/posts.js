const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

//Get Posts 
router.get('/', async (req, res) => {
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray());

});

//Add Posts 
router.post('/', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.insertOne({
        text: req.body.text,
        createdAt: new Date()
    });
    res.status(201).send();
});

//Delete Posts 
router.delete('/:id', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
    res.status(200).send();
});

async function loadPostsCollection() {
    const mongoUri = process.env.MONGO_URI;
    const client = await mongodb.MongoClient.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return client.db('vue-express').collection('posts');
}


module.exports = router; 