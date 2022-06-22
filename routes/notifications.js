require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectId;
const URL = process.env.MONGODB_URI;
const client = MongoClient.connect(URL);
const dbName = "socialMedia";
const collection = 'notifications';

router.get('/:id', function(req, res, next) {
  const userId = req.params.id;
  client
      .then((db) => {
        const dbo = db.db(dbName);
        dbo
          .collection(collection)
          .find({userId: userId})
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

router.post('/like', function(req, res, next) {
    const newAlert = {
        alertType: req.body.alertType,
        postId: req.body.postId,
        userId:  req.body.userId,
        postTYP: req.body.postTYP,
        liked: req.body.liked,
        created: new Date
    };  
  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .insertOne(newAlert)
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Not Found' } });
   throw err;
  });
});

router.post('/comment', function(req, res, next) {
    const newAlert = {
        alertType: req.body.alertType,
        postId: req.body.postId,
        userId:  req.body.userId,
        postTYP: req.body.postTYP,
        commented: req.body.commented,
        created: new Date
    };  
    client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .insertOne(newAlert)
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Not Found' } });
   throw err;
  });
});

router.post('/follower', function(req, res, next) {
    const newAlert = {
        alertType: req.body.alertType,
        follower: req.body.follower,
        userId:  req.body.userId,
        created: new Date
    };  
    client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .insertOne(newAlert)
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Not Found' } });
   throw err;
  });
});

router.delete('/like', function(req, res, next) {
    const postId = req.body.postId;
    const liked = req.body.liked; 
    client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .findOneAndDelete({postId: postId, liked: liked})
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: err.message } });
   throw err;
  });
});

router.delete('/comment', function(req, res, next) {
    const postId = req.body.postId;
    const commented = req.body.commented;  
    client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .findOneAndDelete({postId: postId, commented: commented})
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Not Found' } });
   throw err;
  });
});

router.delete('/follower', function(req, res, next) {
    const follower = req.body.follower;
    const userId = req.body.userId;
    client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .findOneAndDelete({follower: follower, userId: userId})
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