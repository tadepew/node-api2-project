const express = require("express");

const db = require("../data/db");

const router = express.Router();

//GET all comments -- working
router.get("/", (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "The post information could not be retrieved." });
    });
});

//GET a specific comment -- working
router.get("/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id.length)
    .then(post => {
      if (!id.length) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "The post information could not be retrieved." });
    });
});

//POST a new blog post post -- working
router.post("/", (req, res) => {
  const newPost = req.body;
  if (!newPost.title || !newPost.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    db.insert(newPost)
      .then(post => {
        res.status(201).json(newPost);
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  }
});

//POST a new comment -- working
router.post("/:id/comments", (req, res) => {
  const newComment = req.body;
  const { id } = req.params;
  if (!newComment.text) {
    res.status(400).json({
      errorMessage: "Please provide text for the comment."
    });
  } else {
    db.findById(id) //check to see if post exists
      .then(post => {
        if (!post.length) {
          // is an array so have to do .length
          res.status(400).json({
            errorMessage: "The post with the specified ID does not exist."
          });
        } else {
          db.insertComment(newComment) //if post exists add comment
            .then(comment => {
              res.status(201).json(comment);
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error:
                  "There was an error while saving the comment to the database"
              });
            });
        }
      })
      .catch(err => {
        res.status(500).json({
          error:
            "There was a huge error while saving the comment to the database"
        });
      });
  }
});

//GET a post's comments -- working
router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (!post.length) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        console.log(id);
        db.findPostComments(id)
          .then(comments => {
            res.status(200).json(comments);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: "The comments information could not be retrieved."
            });
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "The comments information really could not be retrieved."
      });
    });
});

//DELETE a post -- working
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (!post.length) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        db.remove(id)
          .then(data => {
            res.status(200).json(data);
          })
          .catch(err => {
            res.status(500).json({ error: "The post could not be removed" });
          });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

//UPDATE a post
router.put("/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (!post.length) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (!req.body.title || !req.body.contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post."
        });
      } else {
        db.update(id, req.body)
          .then(post => {
            res.status(200).json(post);
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: "The post information could not be modified." });
          });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

module.exports = router; //export middlware
