const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster4.7llpb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster4`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const equipmentCollection = client
      .db("equipmentDB")
      .collection("equipment");

    app.get("/equipment", async (req, res) => {
      const cursor = equipmentCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // all equipments data show
    app.get("/equipments", async (req, res) => {
      const cursor = equipmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/equipment", async (req, res) => {
      const equipment = req.body;
      const result = await equipmentCollection.insertOne(equipment);
      res.send(result);
    });

    app.delete("/equipment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await equipmentCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("game on gear server running");
});

app.listen(port, () => {
  console.log(`running port: ${port}`);
});
