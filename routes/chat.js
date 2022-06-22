require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectId;
const URL = process.env.MONGODB_URI;
const client = MongoClient.connect(URL);
const dbName = "socialMedia";
const convosCollection = 'conversations';
const msgsCollection = 'messages';

router.get('/convo', function(req, res, next) {
  const senderID = req.body.senderID;
  const receiverID = req.body.receiverID;
    client
      .then((db) => {
        const dbo = db.db(dbName);
        dbo
          .collection(convosCollection)
          .find({members: { $all: [ senderID, receiverID ]} })
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
  const userId = req.params.id;
  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(convosCollection)
    .find({members: { $in: [ userId ] }})
    .toArray()
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: err.message } });
   throw err
  });
});

router.get('/convo/msgs/:id', function(req, res, next) {
  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(msgsCollection)
    .find({convoID: req.params.id})
    .toArray()
    .then((data) => {
      console.log(data);
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: err.message } });
   throw err
  });
});

router.post('/convo', function(req, res, next) {
  const newConvo = {
    members : [
        req.body.senderID,
        req.body.receiverID
    ],
    created: new Date        
  };

  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(convosCollection)
    .insertOne(newConvo)
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Not Found' } });
   throw err;
  });
});

router.post('/message', function(req, res, next) {
  const newMessage = {
    convoID: req.body.convoID,
    senderID: req.body.senderID,
    text: req.body.text,
    created: new Date        
};

  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(msgsCollection)
    .insertOne(newMessage)
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Not Found' } });
   throw err;
  });
});

router.delete('/convo', function(req, res, next) {
  const senderID = req.body.senderID
  const receiverID = req.body.receiverID  
  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(convosCollection)
    // deleteOne
    .findOneAndDelete({members: { $in: [ senderID,receiverID ] }})
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