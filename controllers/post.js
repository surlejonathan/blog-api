import { db } from "../db.js";
import moment from "moment";

export const getPosts = async (req, res) => {
  const category = req.query.category;
  const query = category
    ? "SELECT * FROM posts WHERE category=?"
    : "SELECT * FROM posts";

  db.query(query, [category], (err, results) => {
    if (err) return res.json(err);
    res.status(200).json(results);
  });
};

export const getPost = async (req, res) => {
  const postId = req.params.id;
  const query =
    "SELECT p.id, `username`, `title`, `description`, p.image, u.image AS userImage, `category`,`date`, `updatedAt` FROM users u JOIN posts p ON u.id = p.user_id WHERE p.id = ?";

  db.query(query, [postId], (err, results) => {
    if (err) return res.json(err);
    res.status(200).json(results[0]);
  });
};

export const createPost = async (req, res) => {
  const currentUser = req.currentUser;
  const query =
    "INSERT INTO posts (`title`, `description`, `image`, `date`, `user_id`, `category`) VALUES (?)";
  const { title, description, image, category } = req.body;
  const values = [
    title,
    description,
    image,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    currentUser,
    category,
  ];

  db.query(query, [values], (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json("Post has been created.");
  });
};

export const updatePost = async (req, res) => {
  const currentUser = req.currentUser;
  const postId = req.params.id;
  const checkPost = "SELECT * FROM posts WHERE id = ? AND user_id = ?";
  const query =
    "UPDATE posts SET `title`=?, `description`=?, `image`=?, `category`=?, `updatedAt`=? WHERE id = ? AND user_id = ?";
  const { title, description, image, category } = req.body;
  const values = [
    title,
    description,
    image,
    category,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
  ];

  db.query(checkPost, [postId, currentUser], (err, results) => {
    if (err || !results.length)
      return res
        .status(403)
        .json("You need some permissions to update this post");

    db.query(query, [...values, postId, currentUser], (err, results) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("The post has been successfully updated!");
    });
  });
};

export const deletePost = async (req, res) => {
  const currentUser = req.currentUser;
  const postId = req.params.id;
  const checkPost = "SELECT * FROM posts WHERE id = ? AND user_id = ?";
  const query = "DELETE FROM posts WHERE id = ? AND user_id = ?";

  db.query(checkPost, [postId, currentUser], (err, results) => {
    if (err || !results.length)
      return res
        .status(403)
        .json("You need some permissions to delete this post");

    db.query(query, [postId, currentUser], (err, results) =>
      res.status(200).json("The post has been successfully deleted!")
    );
  });
};
