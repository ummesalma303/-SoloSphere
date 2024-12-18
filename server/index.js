const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017/";
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ot76b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const jobCollection = client.db("solo-db").collection("jobs");
    const bidsCollection = client.db("solo-db").collection("bids");

    /* ---------------------------------- bids ---------------------------------- */

    /* ----------------------- save a bids data in mongodb ----------------------- */
    app.post("/add-bid", async (req, res) => {
      const data = req.body;
      const result = await jobCollection.insertOne(data);
      console.log(result);

      res.send(result);
    });

    /* ------------------------ get all jobs data from db ----------------------- */
    app.get("/add-job", async (req, res) => {
      const result = await jobCollection.find().toArray();
      res.send(result);
    });

    //  /* ------------------------ get one jobs data from db ----------------------- */

    app.get("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
    });
    //  /* ------------------------ get some jobs data from db ----------------------- */

    app.get("/jobs/:email", async (req, res) => {
      const email = req.params.email;
      const query = { "buyer.email": email };
      const result = await jobCollection.find(query).toArray();
      res.send(result);
    });

    /* ----------------------- save a job data in mongodb ----------------------- */
    app.post("/add-job", async (req, res) => {
      const data = req.body;
      const result = await jobCollection.insertOne(data);
      console.log(result);

      res.send(result);
    });

    /* ------------------------------- delete jobs ------------------------------ */
    app.delete("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.deleteOne(query);
      res.send(result);
    });

    /* ------------------------ get some jobs data from db ----------------------- */
    //  app.get('/add-job',async(req,res)=>{
    //   const category = req.query.category
    //   let query = {}
    //   if (category) {
    //     query ={category: category}

    //   }
    //   const result = await jobCollection.find(query).toArray()
    //   // console.log(result)
    //   res.send(result)
    //  })
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello from SoloSphere Server....");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
