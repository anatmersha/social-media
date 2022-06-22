require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectId;
const URL = process.env.MONGODB_URI;
const client = MongoClient.connect(URL);
const dbName = "socialMedia";
const collection = 'posts';

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
    const userId = req.params.id;
    client
    .then((db) => {
      const dbo = db.db(dbName);
      dbo
      .collection(collection)
      .find({userId: userId})
      .toArray()
      .then((data) => {
       res.send(data);
      });
    })
    .catch((err) => {
     res.status(404).send({ error: { message: 'Not Found' } });
     throw err;
    });
});

router.post('/text', function(req, res, next) {
    const newTextPost = {
        userId: req.body.userId,
        text: req.body.text,
        postTYP: "text",
        location: req.body.location,
        comments: [],
        likes: [],
        created: new Date
    }
  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .insertOne(newTextPost)
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Not Found' } });
   throw err;
  });
});

router.post('/image', function(req, res, next) {
    const newImgPost = {
        userId: req.body.userId,
        image: req.body.image,
        caption: req.body.caption,
        postTYP: "image",
        location: req.body.location,
        comments: [],
        likes: [],
        created: new Date
    }
  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .insertOne(newImgPost)
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Not Found' } });
   throw err;
  });
});

router.post('/video', function(req, res, next) {
    const newVidPost = {
        userId: req.body.userId,
        video: req.body.video,
        caption: req.body.caption,
        postTYP: "video",
        location: req.body.location,
        comments: [],
        likes: [],
        created: new Date
    }

  client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .insertOne(newVidPost)
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: 'Not Found' } });
   throw err;
  });
});

router.patch('/like/:id', function(req, res, next) {
  const newPostLike = req.body.newPostLike;
  const userID = { _id: ObjectId(req.params.id) };
    client
      .then((db) => {
        const dbo = db.db(dbName);
        dbo
          .collection(collection)
          .findOneAndUpdate(userID, { 
            $push: { likes: newPostLike } })
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

router.patch('/comment/new/:id', function(req, res, next) {
  const comment = {
    userId: req.body.userId,
    userComment: req.body.userComment,
    created: new Date()      
  }
  const userID = { _id: ObjectId(req.params.id) };
  client
    .then((db) => {
      const dbo = db.db(dbName);
      dbo
        .collection(collection)
        .findOneAndUpdate(userID,{ $push: { comments: comment } })
        // .toArray()
        .then((data) => {
          res.send(data)
        });
    })
    .catch((err) => {
      res.status(400).send({ error: { message: err.message } });
      throw err
    });
});

router.patch('/comment/update', function(req, res, next) {
  const updatedComment = req.body.updatedComment;
  const date = req.query.date;
  const userID = { _id: ObjectId(req.params.id)};
  client
    .then((db) => {
      const dbo = db.db(dbName);
      dbo
        .collection(collection)
        .findOneAndUpdate(userID, { 
          $set: { "comments.$[elem].userComment": updatedComment } }, 
          { arrayFilters: [{ "elem.created": date }] })
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

router.delete('/like/:id', function(req, res, next) {
  const userId = req.body.userId;
  const userID = { _id: ObjectId(req.params.id)};
    client
  .then((db) => {
    const dbo = db.db(dbName);
    dbo
    .collection(collection)
    .updateOne(userID, { 
      $pull: { likes: { userId: userId } } } )
    .then((data) => {
     res.send(data);
    });
  })
  .catch((err) => {
   res.status(404).send({ error: { message: err.message } })
   throw err;
  });
});

router.patch('/comment/:id', function(req, res, next) {
  const date = req.query.date;
  const userID = { _id: ObjectId(req.params.id)};  
  // const userID = { "_id": ObjectId(req.params.id)};  
  client
.then((db) => {
  const dbo = db.db(dbName);
  dbo
  .collection(collection)
  .updateOne(userID, { 
      $pull: { comments: { created: date } } } )
  .then((data) => {
   res.send(data);
  });
})
.catch((err) => {
 res.status(404).send({ error: { message: 'Not Found' } });
 throw err;
});
});

router.delete('/:id', function(req, res, next) {
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