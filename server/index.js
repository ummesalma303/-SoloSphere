const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(express.json());

// const uri = "mongodb://localhost:27017/";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ot76b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
      
       // 0. if a user placed a bid already in this job
      const query = { email: data.email, jobId: data.jobId }
      
       const alreadyExist = await bidsCollection.findOne(query)
       console.log('If already exist-->', alreadyExist)
      if (alreadyExist) {
        return res
          .status(400)
          .send('You have already placed a bid on this job!')
         
       }

     // 1. Save data in bids collection
      const result = await bidsCollection.insertOne(data);
      // console.log('result in posted bids =>',result);

      const filter = {_id: new ObjectId(data.jobId)}
      // 2. Increase bid count in jobs collection
      const update = {
        $inc: {
          bid_count: 1
        }
      }
      const updateBids = await jobCollection.updateOne(filter, update)
      console.log(updateBids)
      res.send(result);
    });


     //  /* ------------------------ get some jobs data from db ----------------------- */

    app.get("/bids/:email", async (req, res) => {
      const email = req.params.email;
      const isBuyer = req.query.buyer
      // console.log('line number: 74',isBuyer,req.query.isBuyer)
      let query={}
      if (isBuyer) {
        query.buyer=email;
        // console.log('line number: 78',isBuyer,req.query.isbuyer)
      }
      // else {
      //   query.email = email
      // }
      const result = await bidsCollection.find(query).toArray();
      // console.log('buyerrrrrrrrrrrrrrrr=>',result)
      res.send(result);
    });

    app.patch('/bid-status-update/:id', async (req, res) => {
      const id = req.params.id
      const { status } = req.body

      const filter = { _id: new ObjectId(id) }
      const updated = {
        $set: { status },
      }
      const result = await bidsCollection.updateOne(filter, updated)
      res.send(result)
    })




/* ---------------------------------- jobs ---------------------------------- */
    /* ------------------------ get all jobs data from db ----------------------- */
    app.get("/add-job", async (req, res) => {
      const filter = req.query.filter
      const search = req.query.search
      const sort = req.query.sort
      // console.log('line no: 109', req.body.deadline)

      let query = {
        
      }
      if (filter) {
        query.category = filter
      }
      if(search){
        query = { title: { $regex: search, $options: "i" } };
       
      }
      let option = {}
      if (sort) {
       option={sort:{deadline: sort === 'asc' ? 1 : -1}}
      }
      
      
      const result = await jobCollection.find(query,option).toArray();
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

    app.get("/jobsEmail/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email)
      const query = { "buyer.email": email };
      // console.log(query)
      const result = await jobCollection.find(query).toArray();
      // console.log(result)
      res.send(result);
    });




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

    



    /* ----------------------- save a job data in mongodb ----------------------- */
    app.post("/add-job", async (req, res) => {
      const data = req.body;
      const result = await jobCollection.insertOne(data);
      console.log('result in posted job',result);

      res.send(result);
    });
    // save a jobData in db
    // app.post('/add-job', async (req, res) => {
    //   const jobData = req.body
    //   const result = await jobCollection.insertOne(jobData)
    //   console.log(result)
    //   res.send(result)
    // })

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
