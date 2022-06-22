require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectId;
const URL = process.env.MONGODB_URI;
const client = MongoClient.connect(URL);
const dbName = "socialMedia";
const collection = 'users';

router.get('/', function(req, res, next) {
    client
      .then((db) => {
        const dbo = db.db(dbName);
        dbo
          .collection(collection)
          .find({})
          .toArray()
          .then((data) => {
            res.send(data)
          });
      })
      .catch((err) => {
        res.status(400).send({ error: { message: 'Bad Request' } });
        throw err
      });
});

router.get('/user/:id', function(req, res, next) {
  const userID = { _id: ObjectId(req.params.id) };
  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .findOne(userID)
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Not Found' } });
   throw err;
  });
});

router.post('/user', function(req, res, next) {
  const newUser = {
    auth: req.body.auth,
    name: req.body.name,
    email: req.body.email,
    password: Number(req.body.password),
    img: "../client/public/images/profile-user.png",
    age: "",
    bio: "",
    following: [],
    followers: [],
    saved: [],
    location: { type: "Point", coordinates: [Number], index: "2dsphere" },
    created: new Date(),
  };

  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .insertOne(newUser)
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: err.message } });
   throw err;
  });
});

router.patch('/userInfo/:id', function(req, res, next) {
  const userID = { _id: ObjectId(req.params.id)};
  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .updateOne(userID,
    {$set: { 
      name: req.body.name, 
      age: req.body.age, 
      bio: req.body.bio, 
      img: req.body.img, 
      address: req.body.address, 
      gender: req.body.gender 
    } })
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Bad Request' } });
   throw err;
  });
});

router.patch('/saved/new/:id', function(req, res, next) {
  const postID = req.body.postID;
  const userID = { _id: ObjectId(req.params.id) };  
  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .findOneAndUpdate(userID, { 
      $push: { saved: postID } })
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Bad Request' } });
   throw err;
  });
});

router.patch('/saved/delete/:id', function(req, res, next) {
  const postID = req.body.postID;
  const userID = { _id: ObjectId(req.params.id)};  
  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .updateOne(userID, { 
      $pull: { saved: { postID } } })
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Not Found' } });
   throw err;
  });
});

router.patch('/followers/new/:id', function(req, res, next) {
  const follower = req.body.follower;
  const userID = { _id: ObjectId(req.params.id) }; 
  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .findOneAndUpdate(userID, { 
      $push: { followers: follower } })
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Bad Request' } });
   throw err;
  });
});

router.patch('/following/new/:id', function(req, res, next) {
  const following = req.body.following;
  const userID = { _id: ObjectId(req.params.id) };
  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .findOneAndUpdate(userID, { 
      $push: { following: following } })
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Bad Request' } });
   throw err;
  });
});

router.patch('/followers/delete/:id', function(req, res, next) {
  const userId = req.body.followerUser;
  const userID = { _id: ObjectId(req.params.id)}; 
  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .updateOne(userID, { 
      $pull: { followers: { userId: userId } } })
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Not Found' } });
   throw err;
  });
});

router.patch('/following/delete/:id', function(req, res, next) {
  const following = req.body.followeUserId;
  const userID = { _id: ObjectId(req.params.id)};
  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .updateOne(userID, { 
      $pull: { following: { userId: following } } })
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Not Found' } });
   throw err;
  });
});

router.delete('/user/:id', function(req, res, next) {
  const userID = { _id: ObjectId(req.params.id) };
  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .deleteOne(userID)
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Not Found' } });
   throw err;
  });
});

module.exports = router;