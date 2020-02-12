const express = require("express");

const postRoutes = require("./posts/postRoutes");

const server = express();

server.use(express.json());

port = 5000;

server.use("/api/posts", postRoutes);

server.get("/", (req, res) => res.json("API is running"));

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
