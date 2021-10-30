const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

// Middleware
app.use(cors());
app.use(express.json());
dotenv.config();
// DB user and password
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

// Mongo config
const uri = `mongodb+srv://${user}:${password}@sandbox.5jrgy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// main run fuction
async function run() {
  try {
    await client.connect();
    const database = client.db('travelDB');
    const destinationCollection = database.collection('destination');
    const tourCollection = database.collection('tours');
    // add destination
    app.post('/addDestinantion', async (req, res) => {
      const result = await destinationCollection.insertOne(req.body);
      res.send(result);
    });
    // get all destinantions
    app.get('/allDestinantion', async (req, res) => {
      const result = await destinationCollection.find({}).toArray();
      res.send(result);
    });
    // get single destinantion
    app.get('/destinantionDetails/:id', async (req, res) => {
      const result = await destinationCollection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    // addTour
    app.post('/addTour', async (req, res) => {
      const result = await tourCollection.insertOne(req.body);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

// Running the run function
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from Node js server!');
});

app.listen(port, () => {
  console.log('Listening to port', port);
});
