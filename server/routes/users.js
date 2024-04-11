import express from "express";
import db from "../server.js";
import { ObjectId } from "mongodb";

const userRouter = express.Router();

// Get all users
userRouter.get("/", async (req, res) => {
  try {
    const users = await db.collection('users').find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Get a specific user by ID
userRouter.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

userRouter.post('/suggestions', async (req, res) => {
  try {
    const { user } = req.body;
    const usersCollection = db.collection('users');
    const suggestions = await usersCollection.aggregate([
      { $match: { _id: { $ne: ObjectId.createFromHexString(user._id) } } },
      { $addFields: {
          isFollowing: { $in: ["$_id", user.following.map(id => ObjectId.createFromHexString(id))] }
      } },
      { $match: { isFollowing: false } },
      { $limit: 10 }
    ]).toArray();
    
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Create a new user
userRouter.post("/", async (req, res) => {
  const { username, password, profilePicture, followers, following } = req.body;
  try {
    // Check if username is already taken
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    const result = await db.collection('users').insertOne({ username, password, profilePicture, followers, following });
    const insertedUser = await db.collection('users').findOne({ _id: result.insertedId });
    res.json(insertedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

userRouter.put("/edit/:id", async (req, res) => {
  const userId = req.params.id;
  const { username, password, profilePicture, followers, following } = req.body;
  try {
    const result = await db.collection('users').updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      { $set: { username, password, profilePicture, followers, following } }
    );
    if (result.modifiedCount === 1) {
      res.status(200).send("User updated successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Delete a user
userRouter.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await db.collection('users').deleteOne({ _id: ObjectId.createFromHexString(userId) });
    if (result.deletedCount === 1) {
      res.status(200).send("User deleted successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Login endpoint
userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.collection('users').findOne({ username, password });
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


userRouter.put("/follow", async (req, res) => {
    const { follower_id, following_id } = req.body;
    try {
        const follower = await db.collection('users').findOneAndUpdate(
            { _id: ObjectId.createFromHexString(follower_id) },
            { $push: { following: ObjectId.createFromHexString(following_id) } },
            { returnDocument: 'after' }
        );

        const followed = await db.collection('users').findOneAndUpdate(
            { _id: ObjectId.createFromHexString(following_id) },
            { $push: { followers: ObjectId.createFromHexString(follower_id) } },
            { returnDocument: 'after' }
        );
        res.json({follower, followed});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error");
    }
});


userRouter.put("/unfollow", async (req, res) => {
  const { unfollower_id, unfollowing_id } = req.body;
  try {
    const unfollower = await db.collection('users').findOneAndUpdate(
        { _id: ObjectId.createFromHexString(unfollower_id) },
        { $pull: { following: ObjectId.createFromHexString(unfollowing_id) } },
        { returnDocument: 'after' }
    );

    const unfollowed = await db.collection('users').findOneAndUpdate(
        { _id: ObjectId.createFromHexString(unfollowing_id) },
        { $pull: { followers: ObjectId.createFromHexString(unfollower_id) } },
        { returnDocument: 'after' }
    );
    res.json({unfollower, unfollowed});
} catch (error) {
    console.error(error);
    res.status(500).send("Error");
}
});

export default userRouter;
