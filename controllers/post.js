import { db } from "../db.js";

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
    "SELECT p.id, `username`, `title`, `description`, p.image, u.image AS userImage, `category`,`date` FROM users u JOIN posts p ON u.id = p.user_id WHERE p.id = ?";

  db.query(query, [postId], (err, results) => {
    if (err) return res.json(err);
    res.status(200).json(results);
  });
};
