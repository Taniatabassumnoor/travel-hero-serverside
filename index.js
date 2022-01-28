const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
// const fileUpload = require("express-fileupload");
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
// app.use(fileUpload());
// MONGODB database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qa19q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("Travel-Hero");
    const userCollection = database.collection("users");
    const reviewCollection = database.collection("reviews");
    const blogsCollection = database.collection("blogs");
    const userblogsCollection = database.collection("userblogs");

    //admin blog get
    app.get("/blogs", async (req, res) => {
      const cursor = blogsCollection.find({});
      const blogs = await cursor.toArray();
      res.json(blogs);
    });
    //   console.log(req.query);
    //   const cursor = blogsCollection.find({});
    //   const page = req.query.page;
    //   const size = parseInt(req.query.size);
    //   let blogs;
    //   const count = await cursor.count();
    //   if (page) {
    //     blogs = await cursor
    //       .skip(page * size)
    //       .limit(size)
    //       .toArray();
    //   } else {
    //     blogs = await cursor.toArray();
    //   }

    //   res.json({
    //     count,
    //     blogs,
    //   });
    // });
    //admin single blog
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogsCollection.findOne(query);
      res.json(result);
    });
    //admin blog post
    app.post("/blogs", async (req, res) => {
      const title = req.body.title;
      const author = req.body.author;
      const description = req.body.description;
      const category = req.body.category;
      const cost = req.body.cost;
      const date = req.body.date;
      const location = req.body.location;
      const image = req.body.image;
      // const pic = req.files.image;
      // const picData = pic.data;
      // const encodedPic = picData.toString("base64");
      // const imageBuffer = Buffer.from(encodedPic, "base64");
      const blog = {
        title,
        author,
        date,
        description,
        category,
        cost,
        location,
        image,
      };
      // console.log("body", req.body);
      // console.log("files", req.files);
      const result = await blogsCollection.insertOne(blog);

      res.json(result);
    });
    // ----------------------------------------------------
    // user blog post
    app.post("/userblogs", async (req, res) => {
      const title = req.body.title;
      const author = req.body.author;
      const description = req.body.description;
      const category = req.body.category;
      const cost = req.body.cost;
      const date = req.body.date;
      const location = req.body.location;
      const image = req.body.image;
      // const pic = req.files.image;
      // const picData = pic.data;
      // const encodedPic = picData.toString("base64");
      // const imageBuffer = Buffer.from(encodedPic, "base64");
      const userblog = {
        title,
        author,
        date,
        description,
        category,
        cost,
        location,
        image,
      };
      // console.log("body", req.body);
      // console.log("files", req.files);
      const result = await userblogsCollection.insertOne(userblog);

      res.json(result);
    });
    // -------------------------------------------------------
    //user blog get
    app.get("/getuserblog", async (req, res) => {
      const cursor = userblogsCollection.find({});
      const userblogs = await cursor.toArray();
      res.json(userblogs);
    });
    // -----------------------------------------------------------
    //user single blog
    app.get("/userblogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userblogsCollection.findOne(query);
      res.json(result);
    });
    // ---------------------------------------------------------
    // users collection insert a user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.json(result);
    });

    //get all user order
    app.get("/getuserblog", async (req, res) => {
      console.log("Getting all user orders");
      const cursor = userblogsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    //update an order
    app.put("/userblogs/:id", async (req, res) => {
      const id = req.params.id;
      updatedOrder = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedOrder.status,
        },
      };

      const result = await userblogsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //cancel an order
    app.delete("/userblogs/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Deleting the order with id ", id);
      const query = { _id: ObjectId(id) };
      const result = await userblogsCollection.deleteOne(query);
      res.send(result);
    });

    // // add products any admin
    // app.post("/products", async (req, res) => {
    //   const order = req.body;
    //   console.log(order);
    //   const result = await productsCollection.insertOne(order);
    //   res.json(result);
    // });

    // // users collection insert a user
    // app.post("/users", async (req, res) => {
    //   const user = req.body;
    //   const result = await userCollection.insertOne(user);
    //   res.json(result);
    // });

    // find user using email
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });
    // set user as a admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // check either user is admin or not 1
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // post reviews
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      console.log(result);
      res.json(result);
    });

    // get reviews
    app.get("/allreviews", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World from Travel Hero!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
