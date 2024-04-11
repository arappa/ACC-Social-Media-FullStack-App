import express from "express";
import db from "../server.js";
import { ObjectId } from "mongodb";

const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  try {
    const sort = {'_id': -1}
    const posts = await db.collection('posts').find({}).sort(sort).toArray();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

postRouter.get("/", async (req, res) => {
  try {
    const posts = await db.collection('posts').find({}).toArray();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

postRouter.get("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await db.collection('posts').findOne({ _id: postId });
    if (post) {
      res.json(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

postRouter.get("/byuser/:id", async (req, res) => {
  const userId = req.params.id;
  const sort = {'_id': -1};
  try {

    const posts = await db.collection('posts').find({ "author.id": new ObjectId(userId) }).sort(sort).toArray();
    res.json(posts);

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


postRouter.post("/", async (req, res) => {
  const { caption, img, user } = req.body;
  try {
    const userId = ObjectId.createFromHexString(user.id);
    const author = { id: userId, username: user.username };
    const timestamp = new Date();
    const inserted = await db.collection('posts').insertOne({ author, caption, image: img, comments: [], timestamp});
    const post = await db.collection('posts').findOne({ _id: inserted.insertedId });
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


postRouter.put("/:id", async (req, res) => {
  const postId = req.params.id;
  const { caption, } = req.body;
  try {
    const updated = await db.collection('posts').updateOne({ _id: new ObjectId(postId) }, { $set: { caption } });
    if (updated.modifiedCount === 1) {
      const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
      res.json(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


postRouter.delete("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const deleted = await db.collection('posts').deleteOne({ _id: new ObjectId(postId) });
    if (deleted.deletedCount === 1) {
      res.status(204).send();
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


export default postRouter;
