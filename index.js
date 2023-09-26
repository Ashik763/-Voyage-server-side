const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = 5000

// middleware
app.use(cors({
  origin:["https://client-ashik763.vercel.app/"],
  methods: [ 'POST','GET'],
  credentials:true
}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@voyage.s21ywkk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const tours = client.db('Voyage').collection('tours');
    const reviews = client.db('Voyage').collection('Reviews');
    // console.log(tours);
    // app.get('/', (req, res) => {
    //    res.send("running...")
    // } )
    app.get('/alltours',async(req, res) => {
        const query = {};
        const tourPlaces =await tours.find(query).toArray();
        res.send(tourPlaces);

    })
    app.get('/homeTours',async(req, res) => {
        const query = {};
        const tourPlaces =await tours.find(query).limit(3).toArray();
        res.send(tourPlaces);

    })
    app.get('/tourDetails/:id',async(req, res) => {
        console.log(typeof(req.params.id));
        const id = req.params.id;
        // const query = {};
        const query = { _id:new ObjectId(id) };
        console.log(query);
        const tourPlace =await tours.findOne(query);
        res.send(tourPlace);

    })
    app.get('/reviews/:id',async(req, res) => {
        // console.log(typeof(req.params.id));
        const id = req.params.id;
        // const query = {};
        const query = { tour_id : id };
        console.log(query);
        const reviewsOnTour =await reviews.find(query).toArray();
        res.send(reviewsOnTour);

    })
    app.get('/homeReviews/',async(req, res) => {
      
        const query = {};
  
        // console.log(query);
        const reviewsOnHome =await reviews.find(query).limit(3).toArray();
        res.send(reviewsOnHome);

    })
    app.get('/myReviews/:email',async(req,res) =>{
      const email = req.params.email;
      const query = {email: email};
      const myReviews = await reviews.find(query).toArray();
      res.send(myReviews);


    })

    app.post('/addReview', async(req, res) => {
      const review = req.body;
      console.log(review)
      const result = await reviews.insertOne(review);
      console.log(result);
      res.send(result);
     

    })
    app.post('/addService', async(req, res) => {
      const tour_package = req.body;
      console.log(tour_package);
      const result = await tours.insertOne(tour_package);
      // console.log(result);
      res.send(result);
     

    })

    app.delete('/myReview/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)};
      const result = await reviews.deleteOne(query);
      res.send(result);

    })
    
  } 
  finally {

    
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    // console.log(tours);

  res.send('Hello World!')
} )

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
